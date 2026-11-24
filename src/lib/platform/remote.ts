// Live API layer for the platform: session bootstrap, auth, KYC, catalogue, cart, orders, refunds, auctions,
// notifications, profile/prefs/help. The PlatformController keeps navigation + validation + the view-model; everything
// that talks to the backend lives here and writes the result back into the controller state using the existing UI
// shapes. Ported from the mobile app's `context/remote.ts`, with browser adaptations (web session cookie, File uploads,
// window.open for documents).
import {
  getAccessToken, hasSession, hydrateSession, isApiError, isNetworkError, newIdempotencyKey, subscribeSession, CLIENT_ERROR_CODES,
} from '../../api';
import type {
  ApiError, AuctionWsEvent, Cart, DeliveryAddress, FilePurpose, ListProductsQuery, NotificationStreamEvent, OrderCard, OrderDetail, ProductCard,
  ProductDetail, ProductDocumentType, RefundDestination, RefundReasonWire, SupportMessage, SupportThread, OtpChannel,
} from '../../api';
import * as authSvc from '../../services/auth.service';
import * as auctionsSvc from '../../services/auctions.service';
import * as cartSvc from '../../services/cart.service';
import * as catalogueSvc from '../../services/catalogue.service';
import * as docsSvc from '../../services/documents.service';
import * as filesSvc from '../../services/files.service';
import * as kycSvc from '../../services/kyc.service';
import * as meSvc from '../../services/me.service';
import * as notifSvc from '../../services/notifications.service';
import * as ordersSvc from '../../services/orders.service';
import * as refSvc from '../../services/reference.service';
import * as refundsSvc from '../../services/refunds.service';
import * as supportSvc from '../../services/support.service';
import { connectAuctionWs, connectNotificationStream } from '../../services/realtime';
import type { AuctionWsHandle, RealtimeHandle } from '../../services/realtime';
import * as MB from './data';
import {
  applyMyBid, gramsPer, ID_TYPE_LABELS, ID_TYPE_WIRE, isOutgoingChatAuthor, KYC_DOC_TO_KIND, KYC_KIND_TO_DOC, mapAuctionDetail, mapAuctionSummary, mapCategory,
  mapDocumentRows, mapKycToUser, mapMeToUser, mapNotification, mapOrderDetail, mapProduct, mapRefund, mapShipment, moneyMajor,
  paymentWireSendsReference, pendingVariation, quotationNumber, quotationNumberToSubmit, resolveCountryCode, stageIndexOf, ts,
} from '../mappers';
import type { Auction, ChatMsg, KycDocId, KycFile, Notif, Order, OrderItem, Refund } from '../../types/mineralBridge';
import { compressImage } from '../images';
import { fresh } from './state';
import type { AppScreen, AppState, DocData, Errs, OrderMeta, PaymentInstructions, SupportMsg, UploadBucket, UploadRef } from './state';

const errorMessage = (e: unknown): string => (e instanceof Error ? e.message : 'Something went wrong');

/** Development-only helpers (simulated counterparties, OTP echo) are never active in a production build. */
export const IS_DEV = process.env.NODE_ENV !== 'production';

/**
 * What the Remote needs from its host (the PlatformController): state access, navigation and a few view helpers.
 */
export interface RemoteHost {
  state: AppState;
  setState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState> | null), cb?: () => void): void;
  flash(t: string): void;
  go(s: AppScreen, extra?: Partial<AppState>): void;
  jump(s: AppScreen, extra?: Partial<AppState>): void;
  back(): void;
  resume(ret: string): void;
  top(): void;
  order(id?: string): Order | undefined;
  patchOrder(id: string, fn: (o: Order) => Order): void;
  aucOf(id?: string): Auction | undefined;
  aucMin(a: Auction): number;
  patchAuc(id: string, fn: (a: Auction) => Auction): void;
  view(o: Order): { actionScreen: string };
  apiDocData(j: Record<string, unknown>, num: string): DocData;
  prefillShip(): void;
  isBusiness(r: { role?: string; buyerType?: string; sellerType?: string }): boolean;
  err(key: 'shipErr' | 'pfErr' | 'scErr' | 'draftErr' | 'editErr', obj: Errs): void;
  task<T>(p: Promise<T>): Promise<T>;
}

export const TERMS_VERSION = '2026-01';
const TERMS_WIRE: Record<string, 'advance_100' | 'advance_30_70' | 'lc_at_sight'> = {
  '100% advance before dispatch': 'advance_100', '30% advance, 70% before dispatch': 'advance_30_70', 'Letter of credit at sight': 'lc_at_sight',
};
const PAY_WIRE: Record<string, 'bank_transfer' | 'neft' | 'rtgs' | 'upi' | 'net_banking' | 'btc' | 'lc' | 'other'> = {
  'Bank transfer': 'bank_transfer', NEFT: 'neft', RTGS: 'rtgs', UPI: 'upi', 'Net banking': 'net_banking', Bitcoin: 'btc', 'Letter of credit': 'lc', 'Other approved method': 'other',
};
const PAYOUT_WIRE: Record<string, string> = { 'Bank transfer': 'bank_transfer', NEFT: 'bank_transfer', RTGS: 'bank_transfer', UPI: 'upi', Bitcoin: 'btc', 'Other approved method': 'other' };
const REFUND_WIRE: Record<string, RefundReasonWire> = {
  'Delivery delayed': 'delivery_delayed', 'Quantity or quality issue': 'quantity_quality', 'Damaged in transit': 'damaged_in_transit',
  'Paid twice': 'paid_twice', 'No longer needed': 'no_longer_needed', Other: 'other',
};
const COND_WIRE: Record<string, 'good' | 'minor_damage' | 'damaged'> = { Good: 'good', 'Minor damage': 'minor_damage', Damaged: 'damaged' };

/** "2 kg" / "2.5" -> {value, unit}. */
export function parseQty(text: string, defUnit: string): { value: number; unit: 'g' | 'kg' | 't' | 'ct' } | null {
  const m = /^\s*([\d,]*\.?\d+)\s*([a-zA-Z]*)\s*$/.exec(text);
  if (!m) return null;
  const value = parseFloat((m[1] ?? '').replace(/,/g, ''));
  const unit = (m[2] || defUnit || 'kg').toLowerCase();
  if (!(value > 0) || !['g', 'kg', 't', 'ct'].includes(unit)) return null;
  return { value, unit: unit as 'g' | 'kg' | 't' | 'ct' };
}

/** What the user typed for a new phone/email -> the wire identifier (E.164 for phones, lower-case email). */
export function contactIdentifier(channel: OtpChannel, raw: string, cc = '+234'): string {
  const v = raw.trim();
  if (channel === 'email') return v.toLowerCase();
  const digits = v.replace(/\D/g, '');
  return v.startsWith('+') ? '+' + digits : cc + digits.replace(/^0+/, '');
}

export const fmtBytes = (n: number) => (n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');

const isVersionConflict = (e: unknown) => isApiError(e) && e.status === 409 && /version/.test(e.code);

/** Friendly text for an API/client error. */
export function apiMessage(e: unknown): string {
  if (isApiError(e)) {
    if (e.code === CLIENT_ERROR_CODES.network) return 'Cannot reach Mineral Bridge. Check your connection and try again.';
    if (e.code === CLIENT_ERROR_CODES.timeout) return 'The request timed out. Try again.';
    return e.message || 'Something went wrong';
  }
  return errorMessage(e);
}

interface RunOpts {
  flag?: keyof AppState;
  /** Called instead of the default toast. */
  onFail?: (e: ApiError | Error) => void;
  quiet?: boolean;
}

export class Remote {
  private notifHandle?: RealtimeHandle;
  private aucHandle?: AuctionWsHandle;
  private aucHandleId = '';
  private unsubSession?: () => void;
  private idem = new Map<string, string>();
  private inflight = new Set<string>();
  private refunds: Refund[] = [];
  private refundOrderIds = new Map<string, string>();
  private soon?: ReturnType<typeof setTimeout>;
  private bootTimer?: ReturnType<typeof setTimeout>;
  private lastChatPoll = 0;
  private aucReload?: ReturnType<typeof setTimeout>;

  constructor(private s: RemoteHost) {}

  private get st() { return this.s.state; }

  /** Fire-and-forget, but tracked by the store so tests can await it (store.idle()). */
  private bg(p: Promise<unknown>) { void this.s.task(p); }

  /* ------------------------------------------------------------------ plumbing */

  idemKey(name: string): string {
    let k = this.idem.get(name);
    if (!k) { k = newIdempotencyKey(); this.idem.set(name, k); }
    return k;
  }
  idemClear(name: string) { this.idem.delete(name); }

  /** Single-flight runner: ignores a repeat call while the same key is running; toggles a busy flag; reports errors. */
  async run<T>(key: string, fn: () => Promise<T>, opts: RunOpts = {}): Promise<T | undefined> {
    if (this.inflight.has(key)) return undefined;
    this.inflight.add(key);
    if (opts.flag) this.s.setState({ [opts.flag]: true } as Partial<AppState>);
    try {
      return await fn();
    } catch (e) {
      this.fail(e, opts);
      return undefined;
    } finally {
      this.inflight.delete(key);
      if (opts.flag) this.s.setState({ [opts.flag]: false } as Partial<AppState>);
    }
  }

  fail(e: unknown, opts: RunOpts = {}) {
    if (isApiError(e) && (e.code === CLIENT_ERROR_CODES.aborted || e.code === CLIENT_ERROR_CODES.sessionExpired)) return;
    if (opts.onFail) return opts.onFail(e as Error);
    if (!opts.quiet) this.s.flash(apiMessage(e));
  }

  /** Field errors (`delivery.street` -> `street`) as a flat map. */
  fieldErrs(e: unknown): Errs {
    const out: Errs = {};
    if (isApiError(e)) Object.entries(e.flatFields()).forEach(([k, v]) => { out[k.split('.').pop() as string] = v; });
    return out;
  }

  /* ------------------------------------------------------------------ session */

  start() {
    if (this.unsubSession) return;
    this.unsubSession = subscribeSession(ev => { if (ev === 'expired') this.bg(this.signOutLocal('Your session expired. Please sign in again.')); });
    this.bg(this.bootstrap());
    this.bg(this.loadCatalogue());
  }

  stop() {
    this.unsubSession?.(); this.unsubSession = undefined;
    if (this.soon) clearTimeout(this.soon);
    if (this.bootTimer) clearTimeout(this.bootTimer);
    if (this.aucReload) clearTimeout(this.aucReload);
    this.stopRealtime();
  }

  /** Cold start: restore the stored session. With no session the app stays on Welcome. */
  async bootstrap(attempt = 0): Promise<void> {
    this.s.setState({ booting: true });
    try {
      await hydrateSession();
      if (!hasSession()) return;
      const me = await meSvc.getMe();
      this.s.setState(x => ({ user: mapMeToUser(me, x.user), prefs: me.notificationPreferences ?? x.prefs }));
      if (this.st.screen === 'welcome') this.s.jump('home');
      this.afterSignIn();
    } catch (e) {
      if (isNetworkError(e) && attempt < 3) {
        this.s.flash(apiMessage(e));
        this.bootTimer = setTimeout(() => this.bg(this.bootstrap(attempt + 1)), 3000);
      }
    } finally {
      this.s.setState({ booting: false });
    }
  }

  /** After any successful sign-in / registration: realtime + push local cart + load the signed-in data. */
  afterSignIn() {
    this.startRealtime();
    this.bg(this.syncAll());
  }

  async syncAll() {
    this.s.setState({ syncing: true });
    try {
      await this.pushLocalCart();
      const needKyc = this.st.user && this.st.user.kyc !== 'verified';
      await Promise.allSettled([
        this.loadSummary(), this.loadOrders(), this.loadNotifications(), this.loadCart(), this.loadAuctions(), this.loadRefunds(), this.loadPrefs(),
        ...(needKyc ? [this.loadKyc()] : []),
      ]);
    } finally {
      this.s.setState({ syncing: false });
    }
  }

  startRealtime() {
    this.notifHandle?.close();
    this.notifHandle = connectNotificationStream(() => getAccessToken(), ev => this.onNotifEvent(ev));
  }
  stopRealtime() {
    this.notifHandle?.close(); this.notifHandle = undefined;
    this.closeAuctionWs();
  }

  /** Local sign-out: drop every signed-in cache (orders, cart, notifications...), keep the public catalogue. */
  async signOutLocal(message?: string) {
    this.stopRealtime();
    this.idem.clear(); this.inflight.clear(); this.refunds = []; this.refundOrderIds.clear();
    const x = this.st;
    this.s.setState({
      ...fresh(),
      catalogueLoaded: x.catalogueLoaded, catVersion: x.catVersion, productsByMineral: x.productsByMineral, auth: { ...fresh().auth, cc: x.auth.cc },
    });
    if (message) this.s.flash(message);
  }

  async logout() {
    await authSvc.logout();
    await this.signOutLocal();
    this.s.flash('Logged out');
  }

  /* ------------------------------------------------------------------ auth */

  private otpIdentifier(): string {
    const a = this.st.auth, v = a.value.trim();
    if (a.method === 'email') return v.toLowerCase();
    return (a.cc || '+234') + v.replace(/\D/g, '').replace(/^0+/, '');
  }

  async requestOtp() {
    const a = this.st.auth;
    await this.run('otp:request', async () => {
      const res = await authSvc.requestOtp({
        intent: a.mode, channel: a.method, identifier: this.otpIdentifier(), ...(a.mode === 'signup' ? { fullName: a.name.trim() } : {}),
      });
      this.s.setState({ challengeId: res.challengeId, maskedDest: res.maskedDestination, devOtp: IS_DEV ? res.developmentOtp ?? '' : '', resendAt: ts(res.resendAvailableAt), otp: '', otpErr: '', authErr: '', registrationToken: '' });
      this.s.go('otp');
    }, { flag: 'authBusy', onFail: e => this.s.setState({ authErr: this.fieldMsg(e, ['identifier', 'fullName']) }) });
  }

  private fieldMsg(e: unknown, keys: string[]): string {
    if (isApiError(e) && e.fields) for (const k of keys) { const m = e.fieldError(k); if (m) return m; }
    return apiMessage(e);
  }

  async resendOtp() {
    const x = this.st;
    if (!x.challengeId) return this.s.flash('Request a new code first');
    if (x.resendAt > Date.now()) return this.s.flash('You can request a new code in ' + Math.max(1, Math.ceil((x.resendAt - Date.now()) / 1000)) + 's');
    await this.run('otp:resend', async () => {
      const res = await authSvc.resendOtp(x.challengeId, x.auth.method);
      this.s.setState({ challengeId: res.challengeId, resendAt: ts(res.resendAvailableAt), devOtp: IS_DEV ? res.developmentOtp ?? '' : '', otp: '', otpErr: '' });
      this.s.flash('A new code was sent');
    }, { flag: 'authBusy' });
  }

  async verifyOtp() {
    const x = this.st;
    await this.run('otp:verify', async () => {
      const res = await authSvc.verifyOtp({ challengeId: x.challengeId, code: x.otp, keepSignedIn: x.auth.keep });
      if (res.status === 'needs_registration') {
        this.s.setState({ registrationToken: res.registrationToken, otpErr: '' });
        return this.s.jump('regType');
      }
      this.s.setState(y => ({ user: mapMeToUser(res.me, y.user), prefs: res.me.notificationPreferences ?? y.prefs, otpErr: '', otp: '', challengeId: '' }));
      this.afterSignIn();
      this.s.flash('Signed in');
      this.s.resume(this.st.returnTo);
    }, { flag: 'authBusy', onFail: e => this.s.setState({ otpErr: apiMessage(e) }) });
  }

  async register() {
    const x = this.st, r = x.reg, a = x.auth;
    await this.run('register', async () => {
      const isBiz = this.s.isBusiness(r);
      const res = await authSvc.register({
        registrationToken: x.registrationToken, fullName: a.name.trim(), role: r.role as 'buyer' | 'seller' | 'both',
        ...(r.role !== 'seller' ? { buyerType: r.buyerType as never } : {}), ...(r.role !== 'buyer' ? { sellerType: r.sellerType as never } : {}),
        ...(isBiz || r.business.trim() ? { businessName: r.business.trim() } : {}),
        countryCode: resolveCountryCode(r.country), acceptTerms: true, termsVersion: TERMS_VERSION,
      });
      this.s.setState(y => ({ user: mapMeToUser(res.me, { ...y.user, via: a.method }), regErr: '', registrationToken: '', challengeId: '' }));
      this.afterSignIn();
      this.s.go('kyc');
    }, { flag: 'authBusy', onFail: e => this.s.setState({ regErr: this.fieldMsg(e, ['businessName', 'countryCode', 'fullName', 'role', 'buyerType', 'sellerType', 'acceptTerms']) }) });
  }

  /* ------------------------------------------------------------------ me / profile */

  async loadMe() {
    try {
      const me = await meSvc.getMe();
      this.s.setState(x => ({ user: mapMeToUser(me, x.user), prefs: me.notificationPreferences ?? x.prefs }));
    } catch (e) { this.fail(e, { quiet: true }); }
  }

  async loadSummary() {
    if (!this.st.user) return;
    try { const summary = await meSvc.getSummary(); this.s.setState({ summary, unread: summary.unreadNotifications }); } catch (e) { this.fail(e, { quiet: true }); }
  }

  async loadPrefs() {
    if (!this.st.user) return;
    try { const prefs = await meSvc.getPrefs(); this.s.setState({ prefs }); } catch (e) { this.fail(e, { quiet: true }); }
  }

  async togglePref(k: keyof AppState['prefs']) {
    const prev = this.st.prefs, next = { ...prev, [k]: !prev[k] };
    this.s.setState({ prefs: next });
    try { this.s.setState({ prefs: await meSvc.patchPrefs({ [k]: next[k] }) }); } catch (e) { this.s.setState({ prefs: prev }); this.fail(e); }
  }

  async saveProfile(f: { name: string; business: string; email: string; phone: string; country: string }) {
    const u = this.st.user;
    await this.run('profile', async () => {
      const code = resolveCountryCode(f.country);
      const me = await meSvc.patchMe({ fullName: f.name.trim(), ...(f.business.trim() ? { businessName: f.business.trim() } : {}), ...(code ? { countryCode: code } : {}) });
      this.s.setState(x => ({ user: mapMeToUser(me, x.user), editErr: {} }));
      const contactChanged = !!u && ((f.email || '').trim() !== (u.email || '') || (f.phone || '').trim() !== (u.phone || ''));
      this.s.flash(contactChanged ? 'Name and business saved. To change your phone or email, tap Change and verify the new one with a code.' : 'Profile saved');
      this.s.back();
    }, { onFail: e => { const fe = this.fieldErrs(e); const map: Errs = {}; if (fe.fullName) map.name = fe.fullName; if (fe.businessName) map.business = fe.businessName; if (fe.countryCode) map.country = fe.countryCode; if (Object.keys(map).length) this.s.err('editErr', map); else this.s.flash(apiMessage(e)); } });
  }

  /* contact (phone / email) change: OTP-verified, never part of PATCH /me */

  async startContactChange(channel: OtpChannel, identifier: string) {
    const field = channel === 'email' ? 'email' : 'phone';
    await this.run('contact:start', async () => {
      const res = await meSvc.contactChange({ channel, identifier });
      this.s.setState({
        contact: { field, channel, identifier, challengeId: res.challengeId, masked: res.maskedDestination, resendAt: res.resendAvailableAt ? ts(res.resendAvailableAt) : Date.now() + 30000, devOtp: IS_DEV ? res.developmentOtp ?? '' : '' },
        contactCode: '', contactErr: '', editErr: {},
      });
      this.s.go('contactOtp');
    }, { flag: 'contactBusy', onFail: e => this.s.err('editErr', { [field]: this.fieldMsg(e, ['identifier', 'channel']) }) });
  }

  async resendContactChange() {
    const c = this.st.contact;
    if (!c) return this.s.flash('Start the change again');
    if (c.resendAt > Date.now()) return this.s.flash('You can request a new code in ' + Math.max(1, Math.ceil((c.resendAt - Date.now()) / 1000)) + 's');
    await this.run('contact:resend', async () => {
      const res = await meSvc.contactChange({ channel: c.channel, identifier: c.identifier });
      this.s.setState({ contact: { ...c, challengeId: res.challengeId, masked: res.maskedDestination || c.masked, resendAt: res.resendAvailableAt ? ts(res.resendAvailableAt) : Date.now() + 30000, devOtp: IS_DEV ? res.developmentOtp ?? '' : '' }, contactCode: '', contactErr: '' });
      this.s.flash('A new code was sent');
    }, { flag: 'contactBusy' });
  }

  async verifyContactChange(code: string) {
    const c = this.st.contact;
    if (!c) return;
    await this.run('contact:verify', async () => {
      const me = await meSvc.verifyContactChange(c.challengeId, code);
      this.s.setState(x => {
        const user = mapMeToUser(me, x.user);
        const base = x.edit || { name: user.name, business: user.business, email: '', phone: '', country: user.country };
        return { user, prefs: me.notificationPreferences ?? x.prefs, contact: null, contactCode: '', contactErr: '', editErr: {}, edit: { ...base, phone: user.phone || '', email: user.email || '' } };
      });
      this.s.flash(c.field === 'email' ? 'Email updated' : 'Phone number updated');
      this.s.back();
    }, { flag: 'contactBusy', onFail: e => this.s.setState({ contactErr: apiMessage(e) }) });
  }

  async saveBizType() {
    const r = this.st.reg, u = this.st.user;
    await this.run('biztype', async () => {
      const me = await meSvc.putBusinessType({
        role: r.role as 'buyer' | 'seller' | 'both', ...(r.role !== 'seller' ? { buyerType: r.buyerType as never } : {}), ...(r.role !== 'buyer' ? { sellerType: r.sellerType as never } : {}),
        ...(u && u.business && u.business !== 'Individual' ? { businessName: u.business } : {}),
      });
      this.s.setState(x => ({ regErr: '', user: mapMeToUser(me, x.user) }));
      this.s.flash('Account type updated');
      const ret = this.st.returnTo;
      if (ret) { this.s.setState({ returnTo: '' }); this.s.back(); if (ret === 'checkout') { this.s.prefillShip(); this.s.go('checkout'); } } else this.s.back();
    }, { onFail: e => this.s.setState({ regErr: apiMessage(e) }) });
  }

  /* ------------------------------------------------------------------ help */

  async loadFaqs() {
    if (this.st.faqs) return;
    try { const r = await supportSvc.getFaqs(); this.s.setState({ faqs: r.items, contacts: r.contacts }); } catch (e) { this.fail(e, { quiet: true }); }
  }

  async supportOtherPayment(o: Order, body: string) {
    await this.run('support:' + o.id, async () => {
      await supportSvc.createThread({ topic: 'other_payment_method', orderRef: o.id, body });
      this.s.flash('Sent to Mineral Bridge support. They will reply on your order chat and by your chosen channels.');
    });
  }

  /* support inbox */

  private mapSupportMsgs(items: SupportMessage[]): SupportMsg[] {
    return (items || []).map((m, i) => {
      const a = m.author, kind = typeof a === 'string' ? a : a && typeof a === 'object' ? String((a as { kind?: string }).kind ?? '') : '';
      const me = isOutgoingChatAuthor(a, this.st.user?.id), system = kind === 'system';
      const name = typeof m.authorName === 'string' && m.authorName ? m.authorName : 'Mineral Bridge';
      return { id: String(m.id ?? m._id ?? 'm' + i), me, system, who: me ? 'You' : system ? 'Mineral Bridge' : name, text: m.body, at: ts(m.at) };
    }).sort((p, q) => p.at - q.at);
  }

  private mapSupportThread(t: SupportThread, fallbackRef: string) {
    return { ref: String(t.reference ?? t.ref ?? fallbackRef), topic: String(t.topic ?? 'general'), subject: String(t.subject ?? t.topic ?? 'general'), status: String(t.status ?? 'open'), messages: this.mapSupportMsgs(t.messages) };
  }

  async loadSupportThreads(quiet = false) {
    if (!this.st.user) return;
    this.s.setState({ supLoading: true, supErr: '' });
    try {
      const r = await supportSvc.listThreads();
      this.s.setState({ supThreads: [...r.items].sort((a, b) => ts(b.updatedAt) - ts(a.updatedAt)) });
    } catch (e) {
      this.s.setState({ supErr: apiMessage(e) });
      if (!quiet) this.fail(e, { quiet: true });
    } finally { this.s.setState({ supLoading: false }); }
  }

  /** Load one thread into `supThread`. Ignores the response if the user has moved to another thread meanwhile. */
  async openSupportThread(ref: string, quiet = false) {
    if (!ref || !this.st.user) return;
    if (!quiet) this.s.setState({ supThreadLoading: true });
    try {
      const t = this.mapSupportThread(await supportSvc.getThread(ref), ref);
      if (this.st.supRef === ref) this.s.setState({ supThread: t, supErr: '' });
    } catch (e) {
      if (this.st.supRef === ref) this.s.setState({ supErr: apiMessage(e) });
    } finally { if (!quiet) this.s.setState({ supThreadLoading: false }); }
  }

  private lastSupPoll = 0;
  pollSupport() { if (Date.now() - this.lastSupPoll > 8000 && this.st.supRef) { this.lastSupPoll = Date.now(); this.bg(this.openSupportThread(this.st.supRef, true)); } }

  async sendSupportMessage(ref: string, text: string) {
    await this.run('support:msg:' + ref, async () => {
      const prev = this.st.supMsg;
      this.s.setState({ supMsg: '', supErr: '' });
      try {
        await supportSvc.postMessage(ref, text);
      } catch (e) { this.s.setState({ supMsg: prev }); throw e; }
      await this.openSupportThread(ref, true);
      this.bg(this.loadSupportThreads(true));
    }, { flag: 'supBusy' });
  }

  async createSupportThread(body: string) {
    await this.run('support:new', async () => {
      const t = await supportSvc.createThread({ topic: 'general', body });
      const ref = String(t.reference ?? t.ref ?? '');
      this.s.setState({ supMsg: '', supErr: '', supRef: ref, ...(ref ? { supThread: this.mapSupportThread(t, ref) } : {}) });
      this.s.flash('Sent to Mineral Bridge support');
      this.bg(this.loadSupportThreads(true));
      if (ref) this.bg(this.openSupportThread(ref, true));
    }, { flag: 'supBusy' });
  }

  /* ------------------------------------------------------------------ KYC */

  private idTypeLabel(w?: string | null) { return (w && ID_TYPE_LABELS[w]) || this.st.kyc.idType; }

  async loadKyc() {
    if (!this.st.user) return;
    try {
      let k = await kycSvc.getKyc();
      // BUG-001: UI defaults to National ID; sync the draft so requiredKinds includes id_back.
      if (!k.idType) {
        const wire = ID_TYPE_WIRE[this.st.kyc.idType] || 'national_id';
        k = await kycSvc.patchKyc({ idType: wire });
      }
      const prev = this.st.kyc, kyc = { ...prev, idType: this.idTypeLabel(k.idType), consent: k.consent } as AppState['kyc'];
      (Object.keys(KYC_DOC_TO_KIND) as KycDocId[]).forEach(id => { kyc[id] = false; });
      const lazy: [KycDocId, string][] = [];
      (k.documents ?? []).forEach(d => {
        const id = KYC_KIND_TO_DOC[d.kind]; if (!id) return;
        const old = prev[id];
        const keep = old && old.fileId === d.fileId ? old : undefined;
        const isPdf = /\.pdf$/i.test(d.name);
        kyc[id] = keep ?? { kind: isPdf ? 'pdf' : 'img', src: '', name: d.name, size: fmtBytes(d.size), at: ts(d.uploadedAt), fileId: d.fileId };
        if (!keep && !isPdf) lazy.push([id, d.fileId]);
      });
      this.s.setState(x => ({ kyc, kycReq: k.requiredKinds ?? [], user: x.user ? mapKycToUser(x.user, k) : x.user }));
      lazy.forEach(([id, fileId]) => void filesSvc.getFileUrl(fileId).then(r => this.s.setState(x => { const f = x.kyc[id]; return f && f.fileId === fileId ? { kyc: { ...x.kyc, [id]: { ...f, src: r.url } } } : null; })).catch(() => {}));
    } catch (e) { this.fail(e, { quiet: true }); }
  }

  async setKycIdType(label: string) {
    const wire = ID_TYPE_WIRE[label];
    this.s.setState(x => ({ kyc: { ...x.kyc, idType: label, front: false, back: false }, kycErr: '' }));
    if (!wire || !this.st.user) return;
    try { await kycSvc.patchKyc({ idType: wire }); await this.loadKyc(); } catch (e) { this.fail(e); }
  }

  async setKycConsent(v: boolean) {
    this.s.setState(x => ({ kyc: { ...x.kyc, consent: v }, kycErr: '' }));
    if (!this.st.user) return;
    try { await kycSvc.patchKyc({ consent: v }); } catch (e) { this.fail(e, { quiet: true }); }
  }

  /** Upload one KYC document (a browser `File`/`Blob`) and attach it to the user's KYC record. */
  async uploadKycDoc(id: KycDocId, file: File | Blob, rec: KycFile) {
    const kind = KYC_DOC_TO_KIND[id];
    if (this.st.kycReq.length && !this.st.kycReq.includes(kind)) return this.s.setState({ kycDocErr: 'This document is not needed for your account.' });
    // Show the picked file immediately, then confirm (or roll back) once the server has it.
    this.s.setState(x => ({ kycDocErr: '', kyc: { ...x.kyc, [id]: rec } }));
    await this.run('kyc:' + id, async () => {
      const up = await filesSvc.uploadFile(file, 'kyc', { fileName: rec.name });
      await kycSvc.putDocument(kind, up.fileId);
      this.s.setState(x => ({ kycDocErr: '', kyc: { ...x.kyc, [id]: { ...rec, fileId: up.fileId } } }));
    }, { flag: 'kycUploading', onFail: e => this.s.setState(x => ({ kyc: { ...x.kyc, [id]: false }, kycDocErr: apiMessage(e) })) });
  }

  async removeKycDoc(id: KycDocId) {
    const f = this.st.kyc[id];
    this.s.setState(x => ({ kyc: { ...x.kyc, [id]: false } }));
    if (!f || !f.fileId) return;
    try { await kycSvc.deleteDocument(KYC_DOC_TO_KIND[id]); } catch (e) { this.fail(e); await this.loadKyc(); }
  }

  async submitKyc() {
    await this.run('kyc:submit', async () => {
      if (!this.st.kyc.consent) await kycSvc.patchKyc({ consent: true });
      else await kycSvc.patchKyc({ consent: true }).catch(() => undefined);
      const res = await kycSvc.submitKyc();
      this.s.setState(x => ({ kycErr: '', user: Object.assign({}, x.user!, { kycFlags: {}, kyc: 'pending' as const, kycRef: res.reference, kycAt: Date.now(), kycReason: '' }) }));
      this.s.jump('kycDone');
    }, { flag: 'kycBusy', onFail: e => this.s.setState({ kycErr: apiMessage(e) }) });
  }

  /* ------------------------------------------------------------------ catalogue */

  private async fetchProducts(q: ListProductsQuery, maxPages = 5): Promise<ProductCard[]> {
    const out: ProductCard[] = [];
    let cursor: string | undefined;
    for (let i = 0; i < maxPages; i++) {
      const page = await catalogueSvc.listProducts({ ...q, limit: 100, cursor });
      out.push(...page.items);
      if (!page.nextCursor) break;
      cursor = page.nextCursor;
    }
    return out;
  }

  private ingest(cards: (ProductCard | ProductDetail)[], replaceMineral?: string) {
    const aliases: Record<string, string> = {};
    const list = cards.map(c => { const p = mapProduct(c); if (c.id !== p.id) aliases[c.id] = p.id; return p; });
    if (replaceMineral) MB.dropMineral(replaceMineral);
    MB.upsertProducts(list, aliases);
    this.s.setState(x => {
      const by = { ...x.productsByMineral };
      if (replaceMineral) by[replaceMineral] = [];
      list.forEach(p => { const a = by[p.mineral] || (by[p.mineral] = []); if (!a.includes(p.id)) a.push(p.id); });
      return { productsByMineral: by, catVersion: x.catVersion + 1 };
    });
  }

  async loadCatalogue(force = false) {
    if (!force && (this.st.catalogueLoaded || this.st.catalogueLoading)) return;
    this.s.setState({ catalogueLoading: true, catalogueErr: '' });
    try {
      const [cats, prods] = await Promise.all([catalogueSvc.getCategories(), this.fetchProducts({})]);
      MB.setCategories(cats.map(mapCategory));
      this.ingest(prods);
      this.s.setState({ catalogueLoaded: true });
    } catch (e) {
      this.s.setState({ catalogueErr: apiMessage(e) });
    } finally {
      this.s.setState({ catalogueLoading: false });
    }
  }

  async loadMineral(mineral: string) {
    if (!mineral) return;
    try { this.ingest(await this.fetchProducts({ mineral }, 3), mineral); } catch (e) { this.fail(e, { quiet: true }); }
  }

  async loadProduct(pid: string) {
    if (!pid) return;
    try { this.ingest([await catalogueSvc.getProduct(pid)]); } catch (e) { this.fail(e, { quiet: true }); }
  }

  /**
   * Open a lot document (test report, certificate of analysis, origin declaration) from its signed URL.
   * Resolves true when opened, false when the lot has no such document (so the caller can fall back), and
   * undefined when the request failed (the error was already shown).
   */
  async openProductDocument(pid: string, type: ProductDocumentType, download = false): Promise<boolean | undefined> {
    // Open the tab synchronously (inside the click) so the browser's popup blocker allows it; point it at the signed URL later.
    const win = !download && typeof window !== 'undefined' ? window.open('', '_blank') : null;
    if (win) { try { win.opener = null; } catch { /* ignore */ } }
    const res = await this.run('proddoc:' + pid + ':' + type, async () => {
      try {
        const d = await catalogueSvc.getProductDocument(pid, type);
        if (!d || !/^https?:\/\//i.test(d.url || '')) return false;
        if (download) {
          const res = await fetch(d.url);
          if (!res.ok) throw new Error('download failed');
          const blob = await res.blob();
          const file = d.name || `${type}.pdf`;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 3000);
          this.s.flash('Downloaded ' + file);
          return true;
        }
        if (win) win.location.href = d.url; else window.open(d.url, '_blank', 'noopener');
        return true;
      } catch (e) {
        if (isApiError(e) && (e.status === 404 || e.code === 'document/not-available')) return false;
        if (e instanceof Error && !isApiError(e)) { this.s.flash(download ? 'Could not download this document' : 'Could not open this document in the browser'); return undefined; }
        throw e;
      }
    });
    if (res !== true && win) win.close();
    return res;
  }

  /* ------------------------------------------------------------------ cart */

  private mapCart(c: Cart): OrderItem[] {
    return c.items.filter(i => i.productRef).map(i => {
      const pid = i.productRef as string, p = MB.product(pid);
      const g = Number(i.qty.grams ?? Number(i.qty.value) * gramsPer(String(i.qty.unit)));
      const qty = p ? Number((g / gramsPer(p.unit)).toFixed(6)) : g;
      const it: OrderItem = { pid, qty, name: i.name ?? undefined, unit: p ? p.unit : 'g' };
      if (i.entered) { it.qIn = Number(i.entered.value); it.uIn = String(i.entered.unit); }
      if (!i.ok && i.issue) it.issue = i.issue;
      return it;
    });
  }

  private async applyCart(c: Cart) {
    const missing = c.items.filter(i => i.productRef && !MB.product(i.productRef));
    await Promise.all(missing.map(i => this.loadProduct(i.productRef as string)));
    this.s.setState(x => ({ cart: this.mapCart(c), cartVersion: c.version ?? x.cartVersion }));
  }

  async loadCart() {
    if (!this.st.user) return;
    try { await this.applyCart(await cartSvc.getCart()); } catch (e) { this.fail(e, { quiet: true }); }
  }

  /** Items added while signed out are pushed to the server cart after sign-in. */
  async pushLocalCart() {
    const local = this.st.cart;
    if (!local.length || !this.st.user) return;
    try {
      let last: Cart | undefined;
      for (const it of local) last = await cartSvc.putItem(it.pid, { value: it.qIn ?? it.qty, unit: it.uIn || MB.unitOfItem(it) || 'g' });
      if (last) await this.applyCart(last);
    } catch (e) { this.fail(e, { quiet: true }); }
  }

  /** Save (replace) one cart line. Signed-out users keep a local cart. Returns true on success. */
  async cartPut(pid: string, qIn: number, uIn: string, qty: number): Promise<boolean> {
    if (!this.st.user) {
      this.s.setState(x => { const had = x.cart.some(c => c.pid === pid), item = { pid, qty, qIn, uIn }; return { qtyErr: '', cart: had ? x.cart.map(c => (c.pid === pid ? item : c)) : [...x.cart, item] }; });
      return true;
    }
    const ok = await this.run('cart:' + pid, async () => {
      await this.applyCart(await cartSvc.putItem(pid, { value: qIn, unit: uIn }));
      this.s.setState({ qtyErr: '' });
      return true;
    }, { onFail: e => this.s.setState({ qtyErr: this.fieldMsg(e, ['qty', 'qty.value', 'value']) }) });
    return !!ok;
  }

  async cartRemove(pid: string) {
    this.s.setState(x => ({ cart: x.cart.filter(z => z.pid !== pid) }));
    if (!this.st.user) return;
    try { await this.applyCart(await cartSvc.removeItem(pid)); } catch (e) { this.fail(e); await this.loadCart(); }
  }

  /* ------------------------------------------------------------------ orders */

  private metaPatch(ref: string, p: Partial<OrderMeta>) { this.s.setState(x => ({ om: { ...x.om, [ref]: { ...(x.om[ref] || {}), ...p } } })); }

  /** Map a server order into the UI list (keeps client-only fields such as the local form summary). */
  applyDetail(d: OrderDetail): Order {
    const prev = this.s.order(d.reference), mapped = mapOrderDetail(d);
    const merged: Order = { ...(prev || {}), ...mapped } as Order;
    if (!mapped.quote) delete merged.quote;
    if (!mapped.cancelled) delete merged.cancelled;
    if (!mapped.rejected) delete merged.rejected;
    if (!mapped.variations) delete merged.variations;
    if (!mapped.hold) merged.hold = '';
    if (prev && prev.disc && prev.disc.qty && mapped.hold === 'discrepancy') merged.disc = prev.disc;
    if (mapped.hold !== 'discrepancy') merged.disc = null;
    this.attachRefunds(merged);
    this.s.setState(x => ({ orders: x.orders.some(o => o.id === merged.id) ? x.orders.map(o => (o.id === merged.id ? merged : o)) : [merged, ...x.orders] }));
    return merged;
  }

  private attachRefunds(o: Order) {
    const mine = this.refunds.filter(r => this.refundOrderIds.get(r.ref) === o.sid).sort((a, b) => b.at - a.at);
    if (!mine.length) return;
    o.refund = mine[0];
    o.history = mine.slice(1);
    o.refundedSoFar = mine.filter(r => r.status === 'refunded').reduce((a, r) => a + r.amount, 0);
    o.refunded = mine.some(r => r.status === 'refunded' && r.type === 'full');
    if (o.refund && o.refund.status === 'refunded' && o.refund.type === 'full') o.refundSettled = true;
  }

  async loadOrders() {
    if (!this.st.user) return;
    this.s.setState({ ordersLoading: true });
    try {
      const cards: OrderCard[] = [];
      let cursor: string | undefined;
      for (let i = 0; i < 3; i++) {
        const page = await ordersSvc.listOrders({ limit: 30, cursor });
        cards.push(...page.items);
        if (!page.nextCursor) break;
        cursor = page.nextCursor;
      }
      // Instant skeleton rows (title/status) so the list renders before the details arrive.
      this.s.setState(x => ({
        orders: cards.map(c => {
          const prev = x.orders.find(o => o.id === c.reference);
          if (prev) return prev;
          const at = ts(c.updatedAt), sell = c.kind === 'sell';
          const o: Order = {
            id: c.reference, kind: c.kind, idx: stageIndexOf(c.kind, c.step, c.status), created: at, items: sell ? [] : [{ pid: c.reference, qty: 0, name: c.title }],
            log: [{ who: MB.WHO.mb, text: c.title, note: '', at }],
          };
          if (sell) o.sell = { mineral: '', name: c.title, qty: c.sell?.qty ?? 0, unit: c.sell?.unit || 'kg', grade: c.sell?.grade || '', form: '', details: '', photos: 0, docs: [], ref: 0 };
          if (c.status === 'cancelled') o.cancelled = { reason: 'Cancelled', note: '', at };
          if (c.status === 'rejected') o.rejected = 'Rejected';
          return o;
        }),
      }));
      const refs = cards.map(c => c.reference);
      for (let i = 0; i < refs.length; i += 4) await Promise.all(refs.slice(i, i + 4).map(r => this.loadOrder(r, true)));
    } catch (e) { this.fail(e, { quiet: true }); } finally { this.s.setState({ ordersLoading: false }); }
  }

  /** Fetch one order (+ documents / shipment) and merge it. */
  async loadOrder(ref: string, quiet = false): Promise<Order | undefined> {
    if (!ref || !this.st.user) return undefined;
    try {
      const d = await ordersSvc.getOrder(ref);
      const o = this.applyDetail(d);
      this.metaPatch(ref, { loadedAt: Date.now() });
      await this.loadExtras(o);
      return this.s.order(ref);
    } catch (e) {
      if (!quiet) this.fail(e, { quiet: false });
      return undefined;
    }
  }

  private async loadExtras(o: Order) {
    const ref = o.id, st = MB.stages(o.kind), ai = st.findIndex(s => s.key === (o.kind === 'sell' ? 'picked' : 'assigned'));
    const needShip = o.idx + 1 >= ai && ai >= 0;
    const [docs, ship] = await Promise.all([
      ordersSvc.listDocuments(ref).catch(() => null),
      needShip ? ordersSvc.getShipment(ref).catch(() => null) : Promise.resolve(null),
    ]);
    this.s.patchOrder(ref, c => {
      if (docs) {
        c.docs = mapDocumentRows(docs);
        const insp = c.docs.find(x => x.type === 'inspection_report'), sgs = c.docs.find(x => x.type === 'test_certificate'), rec = c.docs.find(x => x.type === 'payment_receipt');
        c.company = insp ? { by: 'Mineral Bridge inspection team', at: insp.at, result: 'Report issued' } : undefined;
        c.sgs = sgs ? { no: sgs.number, at: sgs.at, result: 'Report issued' } : undefined;
        if (rec && c.idx >= st.findIndex(x => x.key === 'payOk')) c.txn = rec.number;
      }
      if (ship) c.ship = mapShipment(ship, c);
      return c;
    });
  }

  async loadRefunds() {
    if (!this.st.user) return;
    try {
      const out: Refund[] = []; let cursor: string | undefined;
      for (let i = 0; i < 3; i++) {
        const page = await refundsSvc.listRefunds({ limit: 50, cursor });
        page.items.forEach(r => { const m = mapRefund(r); out.push(m); this.refundOrderIds.set(m.ref, r.orderId); });
        if (!page.nextCursor) break;
        cursor = page.nextCursor;
      }
      this.refunds = out;
      this.s.setState(x => ({ orders: x.orders.map(o => { const c = { ...o }; this.attachRefunds(c); return c; }) }));
    } catch (e) { this.fail(e, { quiet: true }); }
  }

  /**
   * Run a customer order action with the order's current `version`. A 409 version conflict refetches the order
   * and asks the user to review it. Returns true when the server accepted the action.
   */
  async act(key: string, ref: string, call: (ver: number, o: Order) => Promise<OrderDetail | { order: OrderDetail }>, opts: { success?: string; flag?: keyof AppState; onFail?: (e: ApiError | Error) => void; done?: (o: Order) => void } = {}): Promise<boolean> {
    const r = await this.run(key + ':' + ref, async () => {
      const cur = this.s.order(ref);
      if (!cur) return false;
      try {
        const res = await call(cur.ver ?? 0, cur);
        const d = (res as { order?: OrderDetail }).order ?? (res as OrderDetail);
        const o = this.applyDetail(d);
        this.bg(this.loadExtras(o));
        if (opts.success) this.s.flash(opts.success);
        opts.done?.(o);
        return true;
      } catch (e) {
        if (isVersionConflict(e)) { await this.loadOrder(ref, true); this.s.flash('This order changed in the meantime. Review it and try again.'); return false; }
        throw e;
      }
    }, { flag: opts.flag, onFail: opts.onFail });
    return !!r;
  }

  async placeOrder() {
    const x = this.st, sh = x.ship;
    if (!x.user) return;
    await this.run('placeOrder', async () => {
      const delivery: DeliveryAddress = { org: sh.org.trim(), street: sh.street.trim(), city: sh.city.trim(), country: resolveCountryCode(sh.country), contact: sh.contact.trim(), mobile: sh.mobile.trim() };
      const key = this.idemKey('placeOrder');
      try {
        const d = await ordersSvc.createBuyOrder({ fromCart: true, delivery }, key);
        this.idemClear('placeOrder');
        const o = this.applyDetail(d);
        this.s.setState(y => ({ cart: [], cartVersion: y.cartVersion + 1, oid: o.id, stack: [], screen: 'placed', shipErr: {} }));
        this.s.top();
        this.bg(this.loadExtras(o)); this.bg(this.loadSummary()); this.bg(this.loadNotifications());
      } catch (e) { if (!isNetworkError(e)) this.idemClear('placeOrder'); throw e; }
    }, { flag: 'placing', onFail: e => this.orderFail(e, 'shipErr') });
  }

  private orderFail(e: unknown, key: 'shipErr' | 'pfErr' | 'scErr' | 'draftErr') {
    const fe = this.fieldErrs(e);
    if (Object.keys(fe).length) return this.s.err(key, fe);
    if (isApiError(e) && /kyc|role/.test(e.code)) this.bg(this.loadMe());
    this.s.flash(apiMessage(e));
  }

  /* quotation */
  private async withQuoteNo<T>(o: Order, fn: (no: string) => Promise<T>): Promise<T> {
    const known = quotationNumberToSubmit(o.quote?.no, '');
    if (known) {
      try { return await fn(known); } catch (e) {
        if (!(isApiError(e) && e.status === 409 && e.code === 'quotation/not-current')) throw e;
      }
    }
    const start = this.st.om[o.id]?.qTry ?? 0;
    let last: unknown;
    for (let i = start; i < start + 6; i++) {
      try {
        const r = await fn(quotationNumber(o.id, i + 1));
        this.metaPatch(o.id, { qTry: i });
        return r;
      } catch (e) {
        last = e;
        if (isApiError(e) && e.status === 409 && e.code === 'quotation/not-current') continue;
        throw e;
      }
    }
    throw last;
  }

  async acceptQuote() {
    const o = this.s.order(); if (!o) return;
    await this.act('quote', o.id, (ver, c) => this.withQuoteNo(c, no => ordersSvc.acceptQuote(c.id, { quotationNumber: no, version: ver })), { success: 'Quotation accepted', done: () => this.s.back() });
  }

  async declineQuote() {
    const o = this.s.order(); if (!o) return;
    await this.act('quote', o.id, (ver, c) => this.withQuoteNo(c, no => ordersSvc.declineQuote(c.id, { quotationNumber: no, version: ver, reason: 'Declined by customer' })), { success: 'Quotation declined', done: () => this.s.back() });
  }

  /* contract */
  async loadContract(ref: string) {
    if (!ref) return;
    try { this.metaPatch(ref, { contract: await ordersSvc.getContract(ref) }); } catch (e) { this.fail(e, { quiet: true }); }
  }

  async signContract(name: string) {
    const o = this.s.order(); if (!o) return;
    let hash = this.st.om[o.id]?.contract?.documentHash;
    if (!hash) { await this.loadContract(o.id); hash = this.st.om[o.id]?.contract?.documentHash; }
    if (!hash) return this.s.flash('The e-contract is not ready yet. Try again in a moment.');
    await this.act('contract', o.id, (ver, c) => ordersSvc.signContract(c.id, { documentHash: hash as string, nameTyped: name.trim(), readConfirmed: true, version: ver }), {
      success: 'Contract signed', done: () => { this.s.setState({ sign: { read: false, name: '' }, signErr: '' }); this.s.back(); },
      onFail: e => { if (isApiError(e) && /hash|contract/.test(e.code)) this.bg(this.loadContract(o.id)); this.s.setState({ signErr: apiMessage(e) }); },
    });
  }

  /* payment */
  async loadInstructions() {
    if (this.st.instr) return;
    try { const instr = await refSvc.getReference<PaymentInstructions>('payment-instructions'); this.s.setState({ instr }); } catch (e) { this.fail(e, { quiet: true }); }
  }

  async btcQuote(force = false) {
    const o = this.s.order(); if (!o) return;
    const cur = this.st.om[o.id]?.btc;
    if (!force && cur && cur.lockExpiresAt > Date.now() + 60000) return;
    await this.run('btc:' + o.id, async () => {
      const q = await ordersSvc.btcQuote(o.id, newIdempotencyKey()) as { address: string; amountSats: number; rateMinorPerBtc: number; lockExpiresAt: string; amount?: { amountMinor?: number } };
      const amountUsd = Number(q.amountSats) / 1e8 * (Number(q.rateMinorPerBtc) / 100);
      this.metaPatch(o.id, { btc: { address: q.address, amountSats: Number(q.amountSats), rateMinorPerBtc: Number(q.rateMinorPerBtc), lockExpiresAt: ts(q.lockExpiresAt), amountUsd } });
      this.s.setState({ btcLockAt: Date.now() });
    }, { onFail: e => this.s.setState({ payErr: apiMessage(e) }) });
  }

  async submitPay(method: string) {
    const o = this.s.order(), x = this.st; if (!o) return;
    const wire = PAY_WIRE[method] ?? 'other';
    await this.act('pay', o.id, async (ver, c) => {
      const key = this.idemKey('pay:' + c.id);
      const body = {
        method: wire, version: ver,
        ...(wire === 'btc' ? { btcTxid: (x.btcTx || '').trim() } : {}),
        ...(paymentWireSendsReference(wire) ? { reference: (x.payRef || '').trim() } : {}),
        ...(x.uploads.proof.length ? { proofFileIds: x.uploads.proof.map(p => p.fileId) } : {}),
      };
      try { const r = await ordersSvc.submitPayment(c.id, body, key); this.idemClear('pay:' + c.id); return r; } catch (e) { if (!isNetworkError(e)) this.idemClear('pay:' + c.id); throw e; }
    }, {
      flag: 'paying', success: method === 'Bitcoin' ? 'Bitcoin payment submitted · confirming on-chain' : 'Payment submitted · Mineral Bridge will confirm it',
      done: () => { this.s.setState(y => ({ btcTx: '', payRef: '', payErr: '', proof: false, uploads: { ...y.uploads, proof: [] } })); this.s.back(); },
      onFail: e => { if (isApiError(e) && e.code === 'payment/btc-quote-expired') this.bg(this.btcQuote()); this.s.setState({ payErr: this.fieldMsg(e, ['btcTxid', 'reference', 'proofFileIds', 'method']) }); },
    });
  }

  async submitBuyerForm() {
    const o = this.s.order(), f = this.st.pf; if (!o) return;
    await this.act('buyerform', o.id, (ver, c) => ordersSvc.submitBuyerForm(c.id, {
      method: f.method, terms: TERMS_WIRE[f.terms] ?? 'advance_100', billing: { name: f.billName.trim(), address: f.billAddr.trim() }, ...(f.instr.trim() ? { instructions: f.instr.trim() } : {}), confirmed: true, version: ver,
    }), {
      success: 'Details submitted for approval', done: (u) => { this.s.patchOrder(u.id, c => ({ ...c, form: { ...(c.form || {}), method: f.method, terms: f.terms } })); this.s.setState({ pfErr: {} }); this.s.back(); },
      onFail: e => this.orderFail(e, 'pfErr'),
    });
  }

  async submitSellerForm() {
    const o = this.s.order(), f = this.st.sc; if (!o) return;
    const payout = { method: PAYOUT_WIRE[f.method] ?? 'other', label: f.method, ...(f.method === 'UPI' ? { holder: f.bank.trim(), upiId: f.account.trim() } : { bankName: f.bank.trim(), account: f.account.trim() }) };
    await this.act('sellerform', o.id, (ver, c) => ordersSvc.submitSellerForm(c.id, { payout, inspectionSlot: { date: f.date, time: f.time, address: f.address.trim() }, confirmed: true, version: ver }), {
      success: 'Form submitted for approval', done: (u) => { this.s.patchOrder(u.id, c => ({ ...c, form: { method: f.method, date: f.date, time: f.time, address: f.address.trim() } })); this.s.setState({ scErr: {} }); this.s.back(); },
      onFail: e => this.orderFail(e, 'scErr'),
    });
  }

  async acceptReports() {
    const o = this.s.order(); if (!o) return;
    await this.act('reports', o.id, (ver, c) => ordersSvc.acceptInspection(c.id, ver), { success: 'Reports accepted', done: () => this.s.back() });
  }

  async queryReports(note: string) {
    const o = this.s.order(); if (!o) return;
    await this.act('reports', o.id, (ver, c) => ordersSvc.queryInspection(c.id, note, ver), { success: 'Clarification sent', done: () => { this.s.setState({ repNote: '', repErr: '' }); this.s.back(); }, onFail: e => this.s.setState({ repErr: apiMessage(e) }) });
  }

  async confirmReceipt() {
    const o = this.s.order(), x = this.st, rc = x.rc; if (!o) return;
    const q = parseQty(rc.qty, MB.unitOfItem(o.items[0] || { pid: '' }) || 'kg');
    if (!q) return this.s.setState({ rcErr: 'Enter the quantity as a number with a unit, e.g. 2 kg' });
    await this.act('receipt', o.id, (ver, c) => ordersSvc.confirmReceipt(c.id, { qtyReceived: q, condition: COND_WIRE[rc.cond] ?? 'good', photoFileIds: x.uploads.receipt.map(p => p.fileId), ...(rc.note.trim() ? { note: rc.note.trim() } : {}), version: ver }), {
      success: 'Delivery accepted', done: () => { this.resetReceipt(); this.s.back(); }, onFail: e => this.s.setState({ rcErr: apiMessage(e) }),
    });
  }

  async disputeReceipt() {
    const o = this.s.order(), x = this.st, rc = x.rc; if (!o) return;
    const q = parseQty(rc.qty, MB.unitOfItem(o.items[0] || { pid: '' }) || 'kg');
    if (!q) return this.s.setState({ rcErr: 'Enter the quantity as a number with a unit, e.g. 2 kg' });
    await this.act('receipt', o.id, (ver, c) => ordersSvc.disputeReceipt(c.id, { qtyReceived: q, condition: rc.cond.toLowerCase(), photoFileIds: x.uploads.receipt.map(p => p.fileId), note: rc.note.trim(), version: ver }), {
      success: 'Discrepancy raised', done: (u) => { this.s.patchOrder(u.id, c => ({ ...c, disc: { qty: rc.qty, cond: rc.cond, note: rc.note.trim(), photos: x.uploads.receipt.length, at: Date.now() } })); this.resetReceipt(); this.s.back(); }, onFail: e => this.s.setState({ rcErr: apiMessage(e) }),
    });
  }

  private resetReceipt() { this.s.setState(y => ({ rc: { qty: '', cond: 'Good', photos: 0, note: '' }, rcErr: '', uploads: { ...y.uploads, receipt: [] } })); }

  async cancelOrder(reason: string, note: string) {
    const o = this.s.order(); if (!o) return;
    await this.act('cancel', o.id, (ver, c) => ordersSvc.cancelOrder(c.id, { reason, ...(note ? { note } : {}), agree: true, version: ver }), {
      success: o.kind === 'sell' ? 'Sell request cancelled' : 'Order cancelled', done: () => { this.s.setState({ cx: { reason: '', note: '', agree: false }, cxErr: '' }); this.s.back(); this.bg(this.loadSummary()); }, onFail: e => this.s.setState({ cxErr: apiMessage(e) }),
    });
  }

  /** Accept or reject the price variation Mineral Bridge proposed on a sell order (`awaiting_seller`). */
  async decideVariation(decision: 'accept' | 'reject', note?: string) {
    const o = this.s.order(); if (!o) return;
    const pv = pendingVariation(o);
    if (!pv) return this.s.flash('There is no price update waiting for your answer');
    const text = (note || '').trim();
    await this.act('variation', o.id, (ver, c) => ordersSvc.decideVariation(c.id, pv.id, { decision, ...(text ? { note: text } : {}), version: ver }), {
      flag: 'varBusy', success: decision === 'accept' ? 'Price update accepted' : 'Price update rejected',
      done: () => { this.s.setState({ varNote: '', varErr: '' }); this.s.back(); },
      onFail: e => { if (isApiError(e) && /^variation\//.test(e.code)) this.bg(this.loadOrder(o.id, true)); this.s.setState({ varErr: apiMessage(e) }); },
    });
  }

  async loadCancellation(ref: string) {
    try { this.metaPatch(ref, { cancelInfo: await ordersSvc.getCancellation(ref) }); } catch (e) { this.fail(e, { quiet: true }); }
  }

  async submitChanges(note: string) {
    const o = this.s.order(); if (!o) return;
    await this.act('changes', o.id, (ver, c) => ordersSvc.submitChanges(c.id, { note, version: ver }), { success: 'Changes sent to Mineral Bridge', done: () => this.s.back() });
  }

  /* refunds */
  async createRefund(o: Order) {
    const x = this.st, r = x.rf;
    const fe = (k: keyof typeof r) => String(r[k] || '').trim();
    const dest: RefundDestination = r.dest === 'bank'
      ? { method: 'bank', holder: fe('holder'), bankName: fe('bank'), accountMasked: '••' + fe('account').replace(/\s/g, '').slice(-4), accountEnc: fe('account').replace(/\s/g, ''), swiftOrIfsc: fe('code'), country: fe('country') }
      : r.dest === 'upi' ? { method: 'upi', upiId: fe('upi'), holder: fe('upiName') }
        : r.dest === 'btc' ? { method: 'btc', btcAddress: fe('addr') } : { method: 'original' };
    const cancel = x.cancelRefund === o.id;
    await this.run('refund:' + o.id, async () => {
      const key = this.idemKey('refund:' + o.id);
      try {
        const body = { type: r.type, ...(r.type === 'partial' ? { amountMinor: Math.round(parseFloat(String(r.amount).replace(/[^\d.]/g, '')) * 100) } : {}), reason: REFUND_WIRE[r.reason] ?? 'other', note: fe('note'), destination: dest, ...(x.uploads.refund.length ? { attachmentFileIds: x.uploads.refund.map(p => p.fileId) } : {}), ...(cancel ? { cancelOrder: true } : {}), agree: true as const };
        const res = await refundsSvc.createRefund(o.id, body, key);
        this.idemClear('refund:' + o.id);
        const m = mapRefund(res); this.refunds = [m, ...this.refunds.filter(z => z.ref !== m.ref)]; this.refundOrderIds.set(m.ref, res.orderId);
        this.s.setState(y => ({ rfErr: '', rf: { ...y.rf, reason: '' }, rfFieldErr: {}, cancelRefund: '', uploads: { ...y.uploads, refund: [] } }));
        this.s.setState(y => ({ rf: { ...(fresh().rf) }, uploads: { ...y.uploads, refund: [] } }));
        this.s.flash('Refund request submitted · ' + m.ref);
        this.s.back();
        await this.loadOrder(o.id, true); await this.loadRefunds();
      } catch (e) { if (!isNetworkError(e)) this.idemClear('refund:' + o.id); throw e; }
    }, { onFail: e => { const f = this.fieldErrs(e); this.s.setState({ rfErr: apiMessage(e), rfFieldErr: f }); } });
  }

  /* chat */
  /** BUG-016: author may be the string `'user'`/`'agent'`, or `{ kind, id, sender_role }`. */
  private mapMsgs(items: { body: string; author: unknown; at: string }[]): ChatMsg[] {
    const myId = this.st.user?.id;
    return items.map(m => ({ me: isOutgoingChatAuthor(m.author, myId), text: m.body, at: ts(m.at) })).sort((p, q) => p.at - q.at);
  }

  async loadChat(ref: string) {
    if (!ref || !this.st.user) return;
    this.lastChatPoll = Date.now();
    try {
      const page = await ordersSvc.listMessages(ref);
      const server = this.mapMsgs(page.items);
      this.s.setState(x => ({ chat: { ...x.chat, [ref]: [...server, ...(x.chat[ref] || []).filter(m => m.local)].sort((a, b) => a.at - b.at) } }));
    } catch (e) { this.fail(e, { quiet: true }); }
  }

  pollChat() { if (Date.now() - this.lastChatPoll > 8000) this.bg(this.loadChat(this.st.oid)); }

  private lastOrderPoll = 0;
  /** Refresh sell requests and the open order without a manual reload (BUG-015). */
  pollOrders() {
    if (!this.st.user || Date.now() - this.lastOrderPoll < 8000) return;
    this.lastOrderPoll = Date.now();
    this.bg(this.loadOrders());
    if (this.st.screen === 'order' && this.st.oid) this.bg(this.loadOrder(this.st.oid, true));
  }

  async sendChat(o: Order, text: string) {
    const msg: ChatMsg = { me: true, text, at: Date.now() };
    this.s.setState(x => ({ msg: '', chat: { ...x.chat, [o.id]: [...(x.chat[o.id] || []), msg] } }));
    try { await ordersSvc.sendMessage(o.id, { body: text }); await this.loadChat(o.id); } catch (e) {
      this.s.setState(x => ({ chat: { ...x.chat, [o.id]: (x.chat[o.id] || []).filter(m => m !== msg) }, msg: text }));
      this.fail(e);
    }
  }

  /* shipment */
  async loadShipment(ref: string) {
    const o = this.s.order(ref); if (!o) return;
    try { const sh = await ordersSvc.getShipment(ref); this.s.patchOrder(ref, c => ({ ...c, ship: mapShipment(sh, c) })); } catch (e) { if (!(isApiError(e) && e.status === 404)) this.fail(e, { quiet: true }); }
  }

  /* sell */
  async submitSell() {
    const x = this.st, d = x.draft;
    await this.run('sell', async () => {
      const key = this.idemKey('sell');
      try {
        const res = await ordersSvc.createSellOrder({
          mineral: d.mineral, name: MB.mineralName(d.mineral), qty: { value: parseFloat(d.qty), unit: d.unit as 'g' | 'kg' | 't' | 'ct' }, grade: d.grade.trim(),
          form: d.form as 'Raw' | 'Semi-finished' | 'Finished', details: d.details.trim(), photoFileIds: x.uploads.sellPhotos.map(p => p.fileId),
          ...(x.uploads.sellDocs.length ? { documentFileIds: x.uploads.sellDocs.map(p => p.fileId) } : {}),
        }, key);
        this.idemClear('sell');
        const o = this.applyDetail(res);
        this.s.setState(y => ({ oid: o.id, hasDraft: false, draftErr: {}, draft: fresh().draft, uploads: { ...y.uploads, sellPhotos: [], sellDocs: [] }, stack: [], screen: 'sellDone' }));
        this.s.top(); this.bg(this.loadSummary()); this.bg(this.loadNotifications());
      } catch (e) { if (!isNetworkError(e)) this.idemClear('sell'); throw e; }
    }, { flag: 'placing', onFail: e => this.orderFail(e, 'draftErr') });
  }

  /* ------------------------------------------------------------------ uploads */

  /**
   * Open the browser file picker, upload every picked file (`POST /files`) and record the file ids in `uploads[bucket]`.
   * Must be called from a click handler (the picker needs a user gesture).
   */
  pickFiles(bucket: UploadBucket, purpose: FilePurpose, opts: { limit?: number; label?: string; max?: number; accept?: string } = {}) {
    const have = this.st.uploads[bucket].length;
    if (this.st.uploading) return;
    if (opts.max && have >= opts.max) return this.s.flash('You can add up to ' + opts.max + ' files');
    if (typeof document === 'undefined') return;
    const room = Math.min(opts.limit ?? 1, opts.max ? opts.max - have : 10);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = opts.accept || (purpose === 'sell_photo' || purpose === 'delivery_photo' ? 'image/*' : 'image/*,application/pdf');
    input.multiple = room > 1;
    input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', () => {
      const files = Array.from(input.files ?? []).slice(0, room);
      input.remove();
      if (files.length) this.bg(this.uploadPicked(bucket, purpose, files, opts.label));
    });
    input.addEventListener('cancel', () => input.remove());
    input.click();
  }

  private async uploadPicked(bucket: UploadBucket, purpose: FilePurpose, files: File[], label?: string) {
    await this.run('upload:' + bucket, async () => {
      const added: UploadRef[] = [];
      for (const f of files) {
        if (f.size > 10 * 1048576) { this.s.flash('A file is larger than 10 MB and was skipped'); continue; }
        // BUG-011: some pickers leave type empty; infer image from purpose/extension.
        const looksImg =
          /^image\//.test(f.type) ||
          (!f.type && /\.(jpe?g|png|webp|heic|heif|gif)$/i.test(f.name || '')) ||
          ((purpose === 'sell_photo' || purpose === 'delivery_photo') && f.type !== 'application/pdf');
        if (!looksImg && f.type !== 'application/pdf') { this.s.flash('Only images and PDF files can be uploaded'); continue; }
        const body = looksImg ? await compressImage(f, 1800, 0.82) : f;
        const up = await filesSvc.uploadFile(body, purpose, { fileName: f.name });
        // Always keep a blob preview URL for images so the sell-form thumbnails update immediately.
        const previewUri = looksImg ? URL.createObjectURL(body) : '';
        added.push({ fileId: up.fileId, name: f.name || up.name, uri: previewUri, type: body.type || up.contentType || (looksImg ? 'image/jpeg' : f.type), label });
      }
      if (added.length) this.s.setState(x => ({ uploads: { ...x.uploads, [bucket]: [...x.uploads[bucket], ...added] } }));
      this.syncCounters();
    }, { flag: 'uploading' });
  }
  removeUpload(bucket: UploadBucket, match: number | string) {
    this.st.uploads[bucket].forEach((u, i) => { if ((typeof match === 'number' ? i === match : u.label === match) && u.uri.startsWith('blob:')) URL.revokeObjectURL(u.uri); });
    this.s.setState(x => ({ uploads: { ...x.uploads, [bucket]: x.uploads[bucket].filter((u, i) => (typeof match === 'number' ? i !== match : u.label !== match)) } }));
    this.syncCounters();
  }

  /** Keep the UI counters (photos, docs, receipt photos, refund files, proof) in step with the uploaded files. */
  syncCounters() {
    this.s.setState(x => ({
      draft: { ...x.draft, photos: x.uploads.sellPhotos.length, docs: x.uploads.sellDocs.map(u => u.label || u.name) },
      rc: { ...x.rc, photos: x.uploads.receipt.length }, rf: { ...x.rf, files: x.uploads.refund.length }, proof: x.uploads.proof.length > 0,
    }));
  }

  /* ------------------------------------------------------------------ documents */

  async loadDoc(num: string, oid?: string) {
    if (!num || this.st.docs[num]) return;
    this.s.setState({ docLoading: true });
    try {
      const j = await docsSvc.getDocument(num);
      this.s.setState(x => ({ docs: { ...x.docs, [num]: this.s.apiDocData(j, num) } }));
      void oid;
    } catch (e) { this.fail(e); } finally { this.s.setState({ docLoading: false }); }
  }

  /* ------------------------------------------------------------------ notifications */

  async loadNotifications() {
    if (!this.st.user) return;
    try {
      const page = await notifSvc.listNotifications({ limit: 50 });
      const refOf = (id: string) => this.st.orders.find(o => o.sid === id)?.id;
      this.s.setState({ notifs: page.items.map(n => mapNotification(n, refOf)), unread: page.unreadCount });
    } catch (e) { this.fail(e, { quiet: true }); }
  }

  async readNotif(n: Notif) {
    if (n.read) return;
    this.s.setState(x => ({ notifs: x.notifs.map(y => (y.id === n.id ? { ...y, read: true } : y)), unread: Math.max(0, x.unread - 1) }));
    try { const r = await notifSvc.markRead(n.id); this.s.setState({ unread: r.unreadCount }); } catch (e) { this.fail(e, { quiet: true }); }
  }

  async readAll() {
    this.s.setState(x => ({ notifs: x.notifs.map(y => ({ ...y, read: true })), unread: 0 }));
    this.s.flash('All marked as read');
    try { await notifSvc.markAllRead(); } catch (e) { this.fail(e, { quiet: true }); await this.loadNotifications(); }
  }

  private onNotifEvent(ev: NotificationStreamEvent) {
    const d = ev.data || {};
    switch (ev.event) {
      case 'session.revoked': return this.bg(this.signOutLocal('You were signed out from another device.'));
      case 'notification.sync': {
        const n = Number((d as { unreadCount?: number }).unreadCount);
        if (Number.isFinite(n) && n !== this.st.unread) this.refreshSoon();
        return;
      }
      case 'notification.created': {
        const t = (d as { title?: string }).title; if (t) this.s.flash(t);
        return this.refreshSoon();
      }
      case 'order.stage_changed': {
        const ref = String((d as { ref?: string; orderRef?: string; reference?: string }).ref ?? (d as { orderRef?: string }).orderRef ?? (d as { reference?: string }).reference ?? '');
        if (ref) this.bg(this.loadOrder(ref, true));
        return this.refreshSoon();
      }
      case 'kyc.decided': { this.bg(this.loadMe()); this.bg(this.loadKyc()); return this.refreshSoon(); }
      default: return undefined;
    }
  }

  private refreshSoon() {
    if (this.soon) clearTimeout(this.soon);
    this.soon = setTimeout(() => { this.bg(this.loadNotifications()); this.bg(this.loadSummary()); if (this.st.screen === 'orders' || this.st.screen === 'home') this.bg(this.loadOrders()); }, 800);
  }

  /* ------------------------------------------------------------------ auctions */

  private upsertAuction(a: Auction) {
    this.s.setState(x => ({ auctions: x.auctions.some(y => y.id === a.id) ? x.auctions.map(y => (y.id === a.id ? { ...y, ...a } : y)) : [a, ...x.auctions] }));
  }

  async loadAuctions() {
    this.s.setState({ auctionsLoading: true });
    try {
      const sts = ['live', 'upcoming', 'ended'] as const;
      const pages = await Promise.all(sts.map(status => auctionsSvc.listAuctions({ status, limit: 50 }).catch(() => null)));
      const mine = this.st.user ? await auctionsSvc.listMyBids({ limit: 50 }).catch(() => null) : null;
      this.s.setState(x => {
        const prev = new Map(x.auctions.map(a => [a.sid || a.id, a]));
        let list: Auction[] = [];
        pages.forEach(p => { (p?.items ?? []).forEach(i => { const m = mapAuctionSummary(i), old = prev.get(m.sid as string); list.push(old ? { ...old, ...m, bids: old.bids.length ? old.bids : m.bids } : m); }); });
        (mine?.items ?? []).forEach(r => {
          const i = list.findIndex(a => a.sid === r.auctionId);
          const cur = i >= 0 ? list[i] : undefined;
          if (i >= 0 && cur) list[i] = applyMyBid(cur, r);
          else list.push(applyMyBid({ id: r.auctionId, sid: r.auctionId, pid: '', name: r.auctionName, qty: 0, unit: '', status: r.status === 'ended' ? 'ended' : 'live', start: moneyMajor(r.highestBid), endsAt: ts(r.closesAt), bids: [{ who: 'You', amt: moneyMajor(r.yourBid), at: ts(r.closesAt) }], imageUrl: r.imageUrl ?? undefined }, r));
        });
        // keep orderIds already known for won auctions
        list = list.map(a => { const old = prev.get(a.sid || a.id); return old && old.orderId && !a.orderId ? { ...a, orderId: old.orderId } : a; });
        return { auctions: list };
      });
    } catch (e) { this.fail(e, { quiet: true }); } finally { this.s.setState({ auctionsLoading: false }); }
  }

  async loadAuction(id: string, opts: { fresh?: boolean } = {}) {
    if (!id) return;
    try {
      const cur = this.s.aucOf(id), ref = cur?.sid || id;
      const [d, bids] = await Promise.all([auctionsSvc.getAuction(ref), auctionsSvc.listBids(ref).catch(() => null)]);
      const m = mapAuctionDetail(d, bids?.items ?? [], cur);
      this.upsertAuction(m);
      const amt = parseFloat(this.st.bidAmt);
      if (opts.fresh || !(amt >= (m.minNext ?? 0))) this.s.setState({ bidAmt: String(m.minNext ?? '') });
      if (m.status === 'live' && this.st.screen === 'auction') this.openAuctionWs(m);
    } catch (e) { this.fail(e, { quiet: true }); }
  }

  private openAuctionWs(a: Auction) {
    if (!this.st.user || !a.sid || this.aucHandleId === a.sid) return;
    this.closeAuctionWs();
    this.aucHandleId = a.sid;
    this.aucHandle = connectAuctionWs(a.sid, () => getAccessToken(), { onEvent: ev => this.onAuctionEvent(a.id, ev), onError: () => undefined });
  }

  closeAuctionWs() { this.aucHandle?.close(); this.aucHandle = undefined; this.aucHandleId = ''; }

  private reloadAuctionSoon(id: string) {
    if (this.aucReload) clearTimeout(this.aucReload);
    this.aucReload = setTimeout(() => this.bg(this.loadAuction(id)), 600);
  }

  onAuctionEvent(id: string, ev: AuctionWsEvent) {
    const a = this.s.aucOf(id); if (!a) return;
    switch (ev.event) {
      case 'bid.placed': {
        const b = ev.data.bid, amt = moneyMajor(b.amount);
        this.s.patchAuc(id, c => {
          if (!c.bids.some(z => z.amt === amt && z.who === (b.isYours ? 'You' : b.bidderLabel))) c.bids.push({ who: b.isYours ? 'You' : b.bidderLabel, amt, at: ts(b.placedAt) });
          c.count = ev.data.bidCount; c.reserveMet = ev.data.reserveMet; c.ver = ev.data.version; c.minNext = moneyMajor(ev.data.highestBid) + (c.inc || 500);
          if (b.isYours) { c.leading = true; c.outbid = false; } else if (c.mine) { c.leading = false; c.outbid = true; }
          return c;
        });
        const n = this.s.aucOf(id)!;
        if (this.st.aid === id && !(parseFloat(this.st.bidAmt) >= this.s.aucMin(n))) this.s.setState({ bidAmt: String(this.s.aucMin(n)) });
        return;
      }
      case 'bidder.outbid': this.s.patchAuc(id, c => { c.outbid = true; c.leading = false; return c; }); this.s.flash('You have been outbid'); return;
      case 'auction.extended': this.s.patchAuc(id, c => { c.endsAt = ts(ev.data.closesAt); return c; }); this.s.flash('Bidding extended'); return;
      case 'auction.closed': {
        const won = ev.data.outcome === 'won', mine = !!ev.data.yourBid || a.mine;
        this.s.patchAuc(id, c => { c.status = 'ended'; c.endsAt = Math.min(c.endsAt, Date.now()); c.result = won ? 'won' : mine ? 'lost' : 'closed'; c.outbid = false; return c; });
        if (won && this.st.screen === 'auction' && this.st.aid === id) this.s.go('auctionWon'); else this.s.flash(mine ? 'Auction ended' : 'Auction ended');
        this.reloadAuctionSoon(id);
        return;
      }
      default: return undefined;
    }
  }

  /** BUG-017: register or clear the server-side auto-bid ceiling without requiring a manual bid. */
  async syncAutoBid(a: Auction, on: boolean, maxMajor: number) {
    const ref = a.sid || a.id;
    try {
      if (on && maxMajor > 0) {
        await auctionsSvc.setAutoBid(ref, Math.round(maxMajor * 100));
        this.s.patchAuc(a.id, c => { c.autoMax = maxMajor; return c; });
        this.s.flash('Auto-bid on · up to ' + maxMajor);
      } else {
        await auctionsSvc.clearAutoBid(ref);
        this.s.patchAuc(a.id, c => { c.autoMax = 0; return c; });
        this.s.flash('Auto-bid off');
      }
    } catch (e) {
      this.s.setState({ autoOn: !on });
      this.fail(e);
    }
  }

  async placeBid(a: Auction, amt: number, autoMax: number) {
    await this.run('bid:' + a.id, async () => {
      const key = this.idemKey('bid:' + a.id + ':' + amt);
      try {
        const r = await auctionsSvc.placeBid(a.sid || a.id, Math.round(amt * 100), a.ver ?? 0, key);
        this.idemClear('bid:' + a.id + ':' + amt);
        this.s.patchAuc(a.id, c => { c.bids.push({ who: 'You', amt, at: Date.now() }); c.mine = true; c.leading = true; c.outbid = false; c.ver = r.auction.version; c.count = r.auction.bidCount; c.minNext = r.auction.highestMinor / 100 + (c.inc || 500); c.endsAt = ts(r.auction.closesAt); return c; });
        if (autoMax >= amt) { try { await auctionsSvc.setAutoBid(a.sid || a.id, Math.round(autoMax * 100)); this.s.patchAuc(a.id, c => { c.autoMax = autoMax; return c; }); } catch (e) { this.fail(e); } }
        else if (a.autoMax) { try { await auctionsSvc.clearAutoBid(a.sid || a.id); this.s.patchAuc(a.id, c => { c.autoMax = 0; return c; }); } catch { /* ignore */ } }
        this.s.setState({ bidErr: '', bidAmt: String(this.s.aucMin(this.s.aucOf(a.id)!)) });
        this.s.flash('Bid placed · you are the highest bidder');
        this.reloadAuctionSoon(a.id);
      } catch (e) { if (!isNetworkError(e)) this.idemClear('bid:' + a.id + ':' + amt); throw e; }
    }, { onFail: e => { if (isVersionConflict(e)) { this.bg(this.loadAuction(a.id, { fresh: true })); this.s.setState({ bidErr: 'The auction moved on. Review the new minimum bid and try again.' }); } else this.s.setState({ bidErr: apiMessage(e) }); } });
  }

  async toggleReminder(a: Auction, on: boolean) {
    this.s.setState(x => ({ reminders: { ...x.reminders, [a.id]: on } }));
    this.s.flash(on ? 'We will message you when bidding opens' : 'Reminder cancelled');
    try { if (on) await auctionsSvc.setReminder(a.sid || a.id); else await auctionsSvc.clearReminder(a.sid || a.id); } catch (e) { this.s.setState(x => ({ reminders: { ...x.reminders, [a.id]: !on } })); this.fail(e); }
  }

  async auctionToOrder(a: Auction, toPay: boolean) {
    await this.run('aucorder:' + a.id, async () => {
      const r = await auctionsSvc.createWinnerOrder(a.sid || a.id);
      this.s.patchAuc(a.id, c => { c.orderId = r.orderRef; return c; });
      const o = await this.loadOrder(r.orderRef, true);
      if (!o) return this.s.flash('Your order was created. Open it from Orders.');
      const pay = toPay && this.s.view(o).actionScreen === 'pay';
      this.s.setState({ stack: pay ? ['orders', 'order'] : ['orders'], screen: pay ? 'pay' : 'order', oid: o.id, payErr: '' });
      this.s.top();
    });
  }

  /* ------------------------------------------------------------------ screen hooks */

  /** Called by the store whenever the visible screen changes: load what that screen needs. */
  onScreen(sc: AppScreen, prev: AppScreen) {
    const x = this.st, signed = !!x.user, oid = x.oid;
    if (prev === 'auction' && sc !== 'auction' && sc !== 'auctionWon') this.closeAuctionWs();
    switch (sc) {
      case 'cats': case 'minerals': case 'sellCats': this.bg(this.loadCatalogue()); break;
      case 'lots': this.bg(this.loadCatalogue()); this.bg(this.loadMineral(x.mineral)); break;
      case 'detail': this.bg(this.loadProduct(x.pid)); break;
      case 'cart': case 'checkout': this.bg(this.loadCart()); break;
      case 'home': if (signed) { this.bg(this.loadSummary()); this.bg(this.loadOrders()); } break;
      case 'orders': if (signed) { this.bg(this.loadOrders()); this.bg(this.loadAuctions()); this.bg(this.loadRefunds()); } break;
      case 'order': case 'quote': case 'payInsp': case 'sellConfirm': case 'report': case 'receipt': case 'refunds': case 'priceVar':
        if (signed && oid) this.bg(this.loadOrder(oid, true));
        break;
      case 'contract': if (signed && oid) { this.bg(this.loadOrder(oid, true)); this.bg(this.loadContract(oid)); } break;
      case 'pay': if (signed && oid) { this.bg(this.loadOrder(oid, true)); this.bg(this.loadInstructions()); if (x.pmethod === 'Bitcoin') this.bg(this.btcQuote()); } break;
      case 'shipment': if (signed && oid) this.bg(this.loadShipment(oid)); break;
      case 'chat': if (signed && oid) this.bg(this.loadChat(oid)); break;
      case 'cancel': if (signed && oid) this.bg(this.loadCancellation(oid)); break;
      case 'refund': if (signed && oid) this.bg(this.loadOrder(oid, true)); break;
      case 'doc': if (x.doc && x.doc.num) this.bg(this.loadDoc(x.doc.num, x.doc.oid)); break;
      case 'auctions': this.bg(this.loadAuctions()); break;
      case 'auction': case 'auctionWon': this.bg(this.loadAuction(x.aid, { fresh: prev !== 'auction' })); break;
      case 'notifs': if (signed) this.bg(this.loadNotifications()); break;
      case 'prefs': if (signed) this.bg(this.loadPrefs()); break;
      case 'help': this.bg(this.loadFaqs()); break;
      case 'support': if (signed) this.bg(this.loadSupportThreads()); break;
      case 'supportThread': if (signed && x.supRef) this.bg(this.openSupportThread(x.supRef)); break;
      case 'kyc': case 'kycStatus': case 'kycDoc': if (signed) this.bg(this.loadKyc()); break;
      case 'profile': if (signed) { this.bg(this.loadMe()); this.bg(this.loadSummary()); } break;
      default: break;
    }
  }
}
