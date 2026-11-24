/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions -- ported 1:1 from the design's view logic, which builds free-form records and uses short-circuit calls */
// Platform state and view-model logic, ported from the Claude Design page "Mineral Bridge Web v5".
// renderVals() returns the values the screen components in src/components/platform render against.
import { MB4 } from './data';
import { compressImage, imageUrl } from '../images';
import { kycDocLabel, kycDocRows, kycRequiredDocIds, lotAvailabilityLabel, otpEmailForDisplay, paymentNeedsReference, paymentSubmitError, pendingVariation, productHasLotDocuments, productIsAvailableOnRequest, productIsSoldOut, resolveCountryCode, screenPollsOrders } from '../mappers';
import { Remote, IS_DEV, fmtBytes, contactIdentifier } from './remote';
import type { RemoteHost } from './remote';
import { EMPTY_USER, emptyDraft, emptyRefund, fresh as freshState } from './state';
import { statusTone, topicLabel } from './supportVals';
import type { OtpChannel, ProductDocumentType } from '../../api/types';

type AnyObj = Record<string, any>;
/** Demo / simulation helpers (screen rail, "Simulate" buttons, sample KYC files). Off unless explicitly enabled in a non-production build. */
export const DEV_TOOLS = IS_DEV && process.env.NEXT_PUBLIC_MB_DEV_TOOLS === '1';
const X = (): any => MB4;
const IMG = (n: any) => "url('" + imageUrl(String(n || 'cat-precious')).replace(/'/g, '%27') + "')";
const EMPTY_PRODUCT: AnyObj = { id: '', mineral: '', name: '', form: '', avail: 0, unit: '', min: 0, grade: '', lab: '', cert: '', origin: '', img: 'cat-precious', ref: 0 };
const EMPTY_CAT: AnyObj = { id: '', name: '', img: 'cat-precious', minerals: [] };
const PRODUCT_DOC: Record<string, ProductDocumentType> = { lotReport: 'lot_test_report', lotCoa: 'certificate_of_analysis', lotOrigin: 'origin_declaration' };
const ACTION: AnyObj = { quote: 'Review quotation', contract: 'Review and sign e-contract', payInsp: 'Submit payment details', sellConfirm: 'Submit seller confirmation form', report: 'Review inspection reports', pay: 'Make payment', receipt: 'Confirm receipt', priceVar: 'Review price update' };
const HOLD: AnyObj = { refund: 'Refund requested · order paused while Mineral Bridge reviews it', quoteDeclined: 'Quotation declined · waiting for a revised quotation', clarify: 'Clarification requested · waiting on Mineral Bridge', discrepancy: 'Discrepancy raised · order kept open', changes: 'Changes requested · please update your details' };
const UF: AnyObj = { g: 1, kg: 1000, t: 1e6 };
const RF_DEST = (m?: any) => [['original', 'Original payment method', m + ' · back to the account or wallet you paid from', 'M1 4h22v16H1zM1 10h22'], ['bank', 'Bank account', 'NEFT, RTGS or SWIFT transfer to any bank account', 'M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-7 10 7z'], ['upi', 'UPI', 'Instant transfer to a UPI ID (India)', 'M13 2L3 14h9l-1 8 10-12h-9z'], ['btc', 'Bitcoin wallet', 'On-chain BTC to your wallet address', 'M9 4v16M13 4v3M13 17v3M7 7h7a3 3 0 0 1 0 6H7M7 13h8a3 3 0 0 1 0 6H7']];
const RF_FIELDS: AnyObj = { bank: [['holder', 'ACCOUNT HOLDER NAME', 'As shown on the bank account'], ['bank', 'BANK NAME', 'e.g. HDFC Bank, Zenith Bank'], ['account', 'ACCOUNT NUMBER', '', 'numeric'], ['account2', 'CONFIRM ACCOUNT NUMBER', '', 'numeric'], ['code', 'IFSC / SWIFT / SORT CODE', 'e.g. HDFC0001234 or ZEIBNGLA'], ['country', 'BANK COUNTRY', 'e.g. India']], upi: [['upi', 'UPI ID', 'name@bank'], ['upiName', 'NAME ON UPI', 'As shown in your UPI app']], btc: [['addr', 'WALLET ADDRESS', 'bc1q…'], ['addr2', 'CONFIRM WALLET ADDRESS', 'Paste the address again']] };
const CC = [['+234', '🇳🇬'], ['+233', '🇬🇭'], ['+27', '🇿🇦'], ['+254', '🇰🇪'], ['+255', '🇹🇿'], ['+263', '🇿🇼'], ['+243', '🇨🇩'], ['+225', '🇨🇮'], ['+91', '🇮🇳'], ['+971', '🇦🇪'], ['+44', '🇬🇧'], ['+1', '🇺🇸']];
const UNAME: AnyObj = { g: 'Gram', kg: 'Kilogram', t: 'Ton' };
const REFUND_REASONS = ['Delivery delayed', 'Quantity or quality issue', 'Damaged in transit', 'Paid twice', 'No longer needed', 'Other'];
const RF_STEPS = [['requested', 'Refund requested'], ['review', 'Under review'], ['approved', 'Approved'], ['processing', 'Processing'], ['refunded', 'Refunded']];
const ACTOR: AnyObj = { mb: 'Mineral Bridge', sgs: 'SGS', lp: 'logistics partner' };
const TERMS = ['100% advance before dispatch', '30% advance, 70% before dispatch', 'Letter of credit at sight'];
const PAY = ['Bank transfer', 'NEFT', 'RTGS', 'UPI', 'Net banking', 'Letter of credit', 'Bitcoin', 'Other approved method'];
const SELLPAY = ['Bank transfer', 'NEFT', 'RTGS', 'UPI', 'Bitcoin', 'Other approved method'];
const SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30'];
const KYC_INFO: AnyObj = {
  front: { title: 'ID front', short: 'Photo of the front side', ratio: '1.58', hint: 'Place the front of your ID inside the frame', icon: 'M3 5h18v14H3zM7 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0M14 9h4M14 13h4M6 16h6', desc: 'Take a clear photo of the front of your ID. The name, photo and ID number must be readable.', tips: ['All four corners are inside the photo', 'No glare, blur or fingers covering text', 'The ID is valid and not expired'] },
  back: { title: 'ID back', short: 'Photo of the back side', ratio: '1.58', hint: 'Turn your ID over and fit it in the frame', icon: 'M3 5h18v14H3zM6 15h12M6 11h8', desc: 'Now the back of the same ID. Barcodes and the code strip must be visible.', tips: ['Same ID as the front', 'Barcode or code strip fully visible', 'Good light, no shadows'] },
  selfie: { title: 'Selfie with ID', short: 'Hold your ID next to your face', ratio: '0.8', hint: 'Fit your face in the circle, ID beside your chin', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1', desc: 'Take a selfie holding the same ID beside your face so we can match you to the document.', tips: ['Face clearly visible, no sunglasses or hat', 'ID held next to your face, details readable', 'Plain background, good light'] },
  address: { title: 'Proof of address', short: 'Utility bill, bank statement or lease', ratio: '0.75', hint: 'Fit the whole page inside the frame', icon: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', desc: 'A utility bill, bank statement or lease showing your name and address.', tips: ['Dated within the last 3 months', 'Your full name and address are visible', 'The whole page is in the photo, or upload the PDF'] },
  biz: { title: 'Business document', short: 'Registration, licence or permit', ratio: '0.75', hint: 'Fit the whole page inside the frame', icon: 'M4 21V5a2 2 0 0 1 2-2h8l6 6v12zM14 3v6h6M8 13h8M8 17h5', desc: 'Your company registration, mining or dealer licence, or trading permit.', tips: ['Shows the registered business name', 'Registration or licence number readable', 'Not expired'] }
};
export class PlatformController {
  /** Signed-out, empty state plus the web UI prefs. Orders, cart, catalogue etc. only ever come from the /v2 API. */
  state: AnyObj = { ...freshState(), ready: false, booting: true, navMin: false, listView: 'cards', webRail: false };
  readonly remote: Remote = new Remote(this as unknown as RemoteHost);
  private version = 0;
  private listeners = new Set<() => void>();
  private _t: any;
  private _tick: any;
  private pending = new Set<Promise<unknown>>();
  private dueSeen = new Map<string, number>();

  /** Updates apply synchronously, then subscribers re-render. A null patch is ignored. A screen change loads that screen's data. */
  setState(update: AnyObj | ((prev: AnyObj) => AnyObj | null), cb?: () => void) {
    const prev = this.state;
    const patch = typeof update === 'function' ? update(prev) : update;
    if (patch) {
      this.state = { ...prev, ...patch };
      this.version += 1;
      this.listeners.forEach(l => l());
      if (this.state.screen !== prev.screen) this.remote.onScreen(this.state.screen, prev.screen);
    }
    if (cb) cb();
  }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  getVersion = () => this.version;

  /** Track a background promise (and let tests / shutdown wait for it). */
  task<T>(p: Promise<T>): Promise<T> {
    this.pending.add(p);
    const done = () => { this.pending.delete(p); };
    p.then(done, done);
    return p;
  }
  /** Resolves once every tracked async task (including ones started by other tasks) has settled. */
  async idle() { while (this.pending.size) await Promise.allSettled([...this.pending]); }

  renderVals(): any {
    const v = this._rv(), s = this.state, scr = s.screen || 'welcome';
    const ONB = ['welcome','auth','otp','regType','regDetails','kyc','kycDoc','kycDone'];
    const WIDE = ['home','cats','minerals','lots','orders','auctions','refunds','notifs','profile','help','sellCats'];
    const MID = ['detail','order','auction','shipment','chat','doc','receipt','report','quote','contract','auctionWon'];
    const TT: AnyObj = { home:'Home', cats:'Buy minerals', sellCats:'Sell minerals', orders:'Orders', profile:'Profile', notifs:'Notifications', help:'Help & support', refunds:'Refunds', auctions:'Auctions' };
    const m = v.m || ({} as AnyObj);
    const onboard = ONB.includes(scr);
    const railOpen = !!s.webRail;
    const rail = (v.rail || []).map((g?: any) => ({ ...g, items: (g.items || []).map((r?: any) => ({ ...r, tap: () => { this.setState({ webRail:false }); r.tap && r.tap(); } })) }));
    const split = !onboard && !WIDE.includes(scr) && !['chat', 'placed', 'sellDone', 'doc', 'cart', 'contactOtp', 'support', 'supportThread'].includes(scr) || (scr === 'cart' && !!(s.cart || []).length);
    const sm = this.webSummary(scr, m);
    const lv = s.listView || 'cards';
    return Object.assign({}, v, { rail,
      isCards: lv === 'cards', isTable: lv === 'table',
      setCards: () => { this.setState({ listView: 'cards' }); try { localStorage.setItem('mb5-listview', 'cards'); } catch {} },
      setTable: () => { this.setState({ listView: 'table' }); try { localStorage.setItem('mb5-listview', 'table'); } catch {} },
      cardsBg: lv === 'cards' ? '#fff' : 'transparent', tableBg: lv === 'table' ? '#fff' : 'transparent',
      listCount: scr === 'refunds' ? ((v.refundList || []).length + ' refund' + ((v.refundList || []).length === 1 ? '' : 's')) : ((v.orderList || []).length + ' item' + ((v.orderList || []).length === 1 ? '' : 's')),
      web: {
      goAuctions: () => this.jump('auctions'), goHelp: () => this.jump('help'),
      onboard, app: !onboard, devTools: DEV_TOOLS,
      split, barCta: !!m.cta && !split,
      sumH: sm.h, sumTitle: sm.title, sumSub: sm.sub || '', sum: sm.rows || [], hasSum: !!(sm.rows && sm.rows.length), sumNote: sm.note || '',
      sideCls: s.navMin ? 'w5-min' : '', navLabel: s.navMin ? 'Expand menu' : 'Collapse menu',
      navIcon: s.navMin ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6',
      toggleNav: () => { const n = !this.state.navMin; this.setState({ navMin: n }); try { localStorage.setItem('mb5-navmin', n ? '1' : ''); } catch {} },
      w: onboard ? '520px' : (WIDE.includes(scr) || split ? '1200px' : (MID.includes(scr) ? '1040px' : '760px')),
      title: m.title || TT[scr] || '',
      hasStep: !!m.step, canBack: !!m.canBack,
      railOpen, railLabel: railOpen ? 'Hide screen list' : 'Jump to any screen',
      toggleRail: () => this.setState({ webRail: !this.state.webRail }),
      stop: (e?: any) => e.stopPropagation(),
      nav: (v.tabs || []).map((t?: any) => ({ label:t.label, icon:t.icon, tap:t.tap, cls: t.bg === '#D9B456' ? 'on' : '',
        style: 'display:flex; align-items:center; gap:12px; width:100%; height:44px; padding:0 14px; border:none; border-radius:12px; cursor:pointer; font-family:inherit; font-size:14px; font-weight:600; text-align:left; transition:background .15s; ' + (t.bg === '#D9B456' ? 'background:#D9B456; color:#121214;' : 'background:transparent; color:#B9B7BD;') }))
    } });
  }

  webSummary(scr?: any, m?: any): any {
    if (!this.state.ready || !MB4) return { h: '', title: (m && m.title) || '', rows: [] };
    const s = this.state, M = MB4, u = s.user;
    try {
    const prodName = (p?: any) => p ? (p.name || M.mineralName(p.mineral)) : '';
    if (scr === 'detail') {
      const p = M.PRODUCTS.find((x?: any) => x.id === s.pid) || ({} as AnyObj);
      return { h: 'LOT ' + (p.id || ''), title: prodName(p), rows: [['Mineral', M.mineralName(p.mineral)], ['Form', p.form], ['Available', p.avail > 0 ? p.avail + ' ' + p.unit : 'Sold out'], ['Minimum order', p.min ? p.min + ' ' + p.unit : '—'], ['Price', 'By quotation']].filter((r?: any) => r[1]).map(([k, v]: any) => ({ k, v: String(v) })), note: 'No payment is taken when you order. Mineral Bridge reviews the order and sends a quotation.' };
    }
    if (scr === 'cart' || scr === 'checkout') {
      const rows = (s.cart || []).map((c?: any) => { const p = M.PRODUCTS.find((x?: any) => x.id === c.pid); return { k: prodName(p), v: (c.qIn || c.qty) + ' ' + (c.uIn || (p || ({} as AnyObj)).unit || '') }; });
      return { h: 'ORDER SUMMARY', title: rows.length + (rows.length === 1 ? ' lot' : ' lots'), rows: rows.concat([{ k: 'Price', v: 'By quotation' }, { k: 'Payment', v: 'After quotation' }]), note: scr === 'checkout' ? 'Placing the order sends it to Mineral Bridge Operations for review.' : 'Checkout needs a verified account.' };
    }
    if (scr === 'sellForm') {
      const d = s.draft || ({} as AnyObj);
      return { h: 'SELL REQUEST', title: M.mineralName(d.mineral || 'gold'), rows: [['Quantity', d.qty ? d.qty + ' ' + d.unit : '—'], ['Grade', d.grade || '—'], ['Form', d.form || '—'], ['Photos', String(d.photos || 0)], ['Documents', String((d.docs || []).length)]].map(([k, v]: any) => ({ k, v })), note: 'Our operations team reviews the request and contacts you to agree a price.' };
    }
    const acct = ['profile', 'editProfile', 'bizType', 'kycStatus', 'prefs'];
    if (acct.includes(scr) && u) {
      const kyc = ({ verified: 'Verified', pending: 'Under review', rejected: 'Action needed', none: 'Not started' } as AnyObj)[u.kyc] || u.kyc;
      return { h: 'ACCOUNT', title: u.name, sub: u.business, rows: [['Country', u.country], ['Mobile', u.phone], ['Email', u.email], ['KYC', kyc]].filter((r?: any) => r[1]).map(([k, v]: any) => ({ k, v })), note: 'Your legal name is matched to your KYC record.' };
    }
    const o = this.order && this.order();
    if (o && !['auction', 'auctionWon'].includes(scr)) {
      const vw = this.view(o);
      return { h: o.kind === 'sell' ? 'SELL REQUEST' : 'ORDER', title: vw.title, sub: vw.id, rows: [['Status', vw.status], ['Stage', vw.step], ['Quantity', vw.qtyLine], ['Value', vw.value], ['Updated', vw.updated]].filter((r?: any) => r[1]).map(([k, v]: any) => ({ k, v: String(v) })), note: vw.next };
    }
    } catch {}
    return { h: (m.step || 'MINERAL BRIDGE'), title: m.title || '', rows: [] };
  }

  /** Restores UI preferences only (never user/orders/cart/catalogue), boots the live session and starts the 1 s clock. */
  start(): any {
    if (this._tick) return;
    let navMin = false, listView = 'cards';
    try { navMin = !!localStorage.getItem('mb5-navmin'); listView = localStorage.getItem('mb5-listview') || 'cards'; } catch {}
    this.remote.start();
    this.setState({ ready: true, navMin, listView });
    this._tick = setInterval(() => {
      const st = this.state; if (!st.ready) return;
      if (st.screen === 'pay' && st.pmethod === 'Bitcoin') return this.setState({ tick: Date.now() });
      if (st.screen === 'chat') this.remote.pollChat();
      if (st.screen === 'supportThread') this.remote.pollSupport();
      if (screenPollsOrders(st.screen)) this.remote.pollOrders();
      if (!['auctions', 'auction', 'orders', 'contactOtp'].includes(st.screen)) return;
      // A live auction past its end time is settled by the server: ask it for the result (at most every 10 s).
      (st.auctions || []).filter((a?: any) => a.status === 'live' && a.endsAt <= Date.now()).forEach((a?: any) => {
        if (Date.now() - (this.dueSeen.get(a.id) || 0) < 10000) return;
        this.dueSeen.set(a.id, Date.now());
        void this.task(this.remote.loadAuction(a.id));
      });
      this.setState({ tick: Date.now() });
    }, 1000);
  }
  stop(): any { clearInterval(this._tick); this._tick = undefined; clearTimeout(this._t); this.remote.stop(); }
  flash(t?: any): any { clearTimeout(this._t); this.setState({ toast: t }); this._t = setTimeout(() => this.setState({ toast: '' }), 2400); }
  go(s?: any, extra?: any): any { this.setState((x?: any) => Object.assign({ stack: [...x.stack, x.screen], screen: s }, extra || ({} as AnyObj))); this.top(); }
  resume(ret?: any): any {
    if (!ret) return this.jump('home', { returnTo: '' });
    const u = this.state.user; if (ret === 'checkout' && (!u || u.kyc !== 'verified')) ret = 'cart';
    const ST: AnyObj = { checkout: ['home', 'cart'], sellForm: ['home', 'sellCats'], cart: ['home'] };
    this.setState({ stack: ST[ret] || ['home'], screen: ret, returnTo: '' }); this.top();
    if (ret === 'checkout') setTimeout(() => this.prefillShip(), 0);
  }
  jump(s?: any, extra?: any): any {
    const u = this.state.user;
    if (s === 'editProfile' && u) extra = Object.assign({ edit: { name: u.name, business: u.business, email: u.email || '', phone: u.phone || '', country: u.country || '' }, editErr: {} }, extra || ({} as AnyObj));
    this.setState(Object.assign({ stack: [], screen: s }, extra || ({} as AnyObj))); this.top();
  }
  back(): any { this.setState((x?: any) => { const st = [...x.stack]; const p = st.pop(); return p ? { stack: st, screen: p } : { screen: x.user ? 'home' : 'welcome' }; }); this.top(); }
  top(): any { setTimeout(() => { const el = document.querySelector('.sc'); if (el) el.scrollTop = 0; }, 0); }
  order(id?: any): any { return this.state.orders.find((o?: any) => o.id === (id || this.state.oid)); }
  patchOrder(id?: any, fn?: any): any { this.setState((x?: any) => ({ orders: x.orders.map((o?: any) => o.id === id ? fn(Object.assign({}, o)) : o) })); }
  log(o?: any, who?: any, text?: any, note?: any, extra?: any): any { o.log = [...o.log, { who, text, note: note || '', at: Date.now() }]; return Object.assign(o, extra || ({} as AnyObj)); }
  youDo(text?: any, note?: any, extra?: any): any { const o = this.order(); this.patchOrder(o.id, (c?: any) => { c.idx += 1; c.hold = ''; return this.log(c, 'You', text, note, extra); }); }
  notify(o?: any, title?: any, note?: any): any { this.setState((x?: any) => ({ notifs: [{ id: 'n' + Date.now(), oid: o ? o.id : '', to: o ? '' : 'kycStatus', title, note, at: Date.now(), read: false }, ...x.notifs] })); }
  gate(ret?: any): any {
    const u = this.state.user;
    if (!u) { this.setState({ returnTo: ret, auth: Object.assign({}, this.state.auth, { mode: 'signin' }) }); this.go('auth'); this.flash('Sign in to continue'); return false; }
    if (u.kyc === 'none' || u.kyc === 'rejected') { this.setState({ returnTo: ret }); this.go('kyc'); this.flash('Complete KYC to continue'); return false; }
    if (u.kyc === 'pending') { this.setState({ returnTo: ret, sheet: 'kycPending' }); return false; }
    const need = ret === 'sellForm' ? 'seller' : 'buyer';
    if (u.role !== 'both' && u.role !== need) { this.setState({ returnTo: ret, sheet: need === 'seller' ? 'needSeller' : 'needBuyer' }); return false; }
    return true;
  }
  /** DEVELOPMENT ONLY (NEXT_PUBLIC_MB_DEV_TOOLS=1): local simulation of counterparty steps; never calls the API. */
  demo(kind?: any): any {
    if (!DEV_TOOLS) return;
    const M = X(), o = this.order(); if (!o) return;
    const st = M.stages(o.kind), next = st[o.idx + 1], now = Date.now();
    if (kind === 'reject') { this.patchOrder(o.id, (c?: any) => this.log(c, M.WHO.mb, 'Order rejected', 'The seller has withdrawn this quantity. Please choose another lot.', { rejected: 'The seller has withdrawn this quantity. Please choose another lot.' })); this.notify(o, 'Order rejected', 'Reason shared in your order.'); return; }
    if (kind === 'changes') { this.patchOrder(o.id, (c?: any) => { c.idx -= 1; return this.log(c, M.WHO.mb, 'Changes requested', (o.kind === 'sell' ? 'Please choose an inspection date within the next 10 days.' : 'Please update the billing address to match your company registration.'), { hold: 'changes' }); }); this.notify(o, 'Changes requested', o.kind === 'sell' ? 'Update your seller confirmation form.' : 'Update your payment details.'); return; }
    if (kind === 'refundDecline') { this.patchOrder(o.id, (c?: any) => this.log(c, M.WHO.mb, 'Refund declined', 'The shipment is already with the logistics partner and the goods match the contract. Contact support if you disagree.', { hold: c.refund && c.refund.fromDisc ? 'discrepancy' : '', refund: Object.assign({}, c.refund, { status: 'declined', reason2: 'The shipment is already with the logistics partner and the goods match the contract.', at2: now }) })); this.notify(o, 'Refund declined', 'Reason shared in your order.'); return; }
    if (o.hold === 'refund') {
      const r = o.refund, nx = ({ requested: 'review', review: 'approved', approved: 'processing', processing: 'refunded' } as AnyObj)[r.status];
      const TXT = ({ review: ['Refund under review', 'Our finance team is checking the payment and order status.'], approved: ['Refund approved', M.money(r.amount) + ' will be returned to ' + r.to + '.'], processing: ['Refund processing', 'Sent to the bank. Allow 3–7 working days to appear.'], refunded: ['Refund completed', M.money(r.amount) + ' refunded · bank reference RF' + String(now).slice(-8)] } as AnyObj)[nx];
      this.patchOrder(o.id, (c?: any) => { const rf = Object.assign({}, c.refund, { status: nx, ['at_' + nx]: now }); if (nx === 'refunded') { rf.bankRef = 'RF' + String(now).slice(-8); c.refundedSoFar = (c.refundedSoFar || 0) + rf.amount; } const out = this.log(c, M.WHO.mb, TXT[0], TXT[1], { refund: rf, hold: nx === 'refunded' ? '' : 'refund' }); if (nx === 'refunded' && rf.fromDisc) { out.disc = null; out.log = [...out.log, { who: M.WHO.mb, text: 'Discrepancy settled by refund', note: M.money(rf.amount) + ' refunded for the difference.', at: now + 1 }]; }
        if (nx === 'refunded' && c.kind === 'buy') { out.refundSettled = true; this.closeIfDelivered(out, now + 2); }
        return out; });
      this.notify(o, TXT[0], TXT[1]); return;
    }
    if (o.hold && o.hold !== 'changes') {
      const R = ({ quoteDeclined: ['Revised quotation issued', 'Revised total ' + M.money(o.quote.total * 0.985), { quote: Object.assign({}, o.quote, { total: Math.round(o.quote.total * 0.985), issued: now, rev: (o.quote.rev || 1) + 1 }) }], clarify: ['Clarification provided', 'SGS confirmed the sampling method and re-issued the certificate.', {}], discrepancy: ['Discrepancy resolved', 'Mineral Bridge checked the delivery and shipped the missing quantity. Confirm receipt again when it arrives.', {}] } as AnyObj)[o.hold];
      this.patchOrder(o.id, (c?: any) => this.log(c, M.WHO.mb, R[0], R[1], Object.assign({ hold: '' }, R[2])));
      this.notify(o, R[0], R[1]); return;
    }
    if (!next || next.actor === 'you') return;
    const u = M.demoUpdate(o, next.key, now);
    this.patchOrder(o.id, (c?: any) => { c.idx += 1; const out = this.log(c, M.WHO[next.actor], u[0], u[1], u[2] || ({} as AnyObj)); if (out.refundSettled) this.closeIfDelivered(out, now + 1); return out; });
    this.notify(o, u[0], u[1]);
  }
  closeIfDelivered(c?: any, at?: any): any {
    const M = X(), st = M.stages('buy'), di = st.findIndex((x?: any) => x.key === 'delivered'), ri = st.findIndex((x?: any) => x.key === 'receipt'), ei = st.length - 1;
    if (c.idx < di || c.idx >= ri) return c;
    c.idx = ei; c.hold = '';
    c.log = [...c.log, { who: M.WHO.mb, text: 'Receipt confirmation not needed', note: 'This order was settled by refund, so it closes on delivery.', at }, { who: M.WHO.mb, text: 'Order completed', note: 'Closed after refund ' + ((c.refund || ({} as AnyObj)).ref || '') + '. All records are stored in your history.', at: at + 1 }];
    return c;
  }
  view(o?: any): any {
    const M = X(), st = M.stages(o.kind), next = st[o.idx + 1], last = st[Math.max(0, o.idx)] || st[0];
    const refunded = !!(o.refund && o.refund.status === 'refunded' && o.refund.type === 'full');
    const cx = !!o.cancelled, done = !next || refunded || cx, rej = !!o.rejected || cx;
    const needVar = !!pendingVariation(o) && !rej && !done;
    const nextScreen = next ? next.screen : '';
    // A declined quotation must not hide a later payment retry (BUG-010).
    const holdBlocks = !!o.hold && o.hold !== 'changes' && !(o.hold === 'quoteDeclined' && nextScreen && nextScreen !== 'quote');
    const you = needVar || (!!next && next.actor === 'you' && !rej && !holdBlocks);
    const holdText = o.hold ? (o.holdNote ? (HOLD[o.hold] || 'On hold').split(' · ')[0] + ' · ' + o.holdNote : HOLD[o.hold] || 'On hold') : '';
    const status = rej ? (cx ? 'Cancelled' : 'Rejected') : refunded ? 'Refunded' : done ? 'Completed' : needVar ? 'Action needed' : o.hold ? (HOLD[o.hold] || 'On hold').split(' · ')[0] : you ? 'Action needed' : 'Waiting on ' + ACTOR[next.actor];
    const tone = cx ? ['#F1EFE9', '#3A3940'] : rej ? ['#FDECEA', '#B42318'] : refunded ? ['#EDE9F7', '#4B3B8F'] : done ? ['#E2F2E9', '#17704C'] : you || o.hold ? ['#FBF3E4', '#A1620B'] : ['#F1EFE9', '#3A3940'];
    const value = o.quote ? (o.quote.est ? 'From ' : '') + M.money(o.quote.total) : 'By quotation';
    const p0 = o.kind === 'sell' && o.sell ? M.PRODUCTS.find((p?: any) => p.mineral === o.sell.mineral) : M.product((o.items[0] || ({} as AnyObj)).pid);
    const lastAt = o.log.length ? o.log[o.log.length - 1].at : o.created;
    return {
      id: o.id, kind: o.kind, title: M.titleOf(o), status, pillBg: tone[0], pillFg: tone[1],
      headline: rej ? (cx ? (o.kind === 'sell' ? 'Sell request cancelled' : 'Order cancelled') : 'Order rejected') : refunded ? 'Order cancelled and refunded' : done ? (o.kind === 'sell' ? 'Sale completed' : 'Order completed') : last.label,
      next: rej ? (cx ? 'Cancelled by you on ' + M.fmt(o.cancelled.at) + ' · ' + o.cancelled.reason + (o.kind === 'sell' ? '. No inspection or payment took place.' : '. Nothing was charged.') : o.rejected || '') : refunded ? M.money(o.refund.amount) + ' refunded to ' + o.refund.to + ' · ref ' + o.refund.ref : done ? 'All records are stored in your history.' : needVar ? 'Your turn: ' + ACTION.priceVar : o.hold ? holdText : you ? 'Your turn: ' + ACTION[next.screen] : 'Next: ' + next.label + ' (' + ACTOR[next.actor] + ')',
      you, actionLabel: needVar ? ACTION.priceVar : you ? ACTION[next.screen] : '', actionScreen: needVar ? 'priceVar' : you ? next.screen : '',
      canDemo: DEV_TOOLS && !rej && !done && !you && o.hold !== 'changes', demoLabel: o.hold === 'refund' ? 'Simulate: refund ' + (({ requested: 'review started', review: 'approved', approved: 'processing', processing: 'completed' } as AnyObj)[(o.refund || ({} as AnyObj)).status] || 'update') : o.hold ? 'Simulate Mineral Bridge response' : next ? 'Simulate: ' + next.label : '',
      canReject: DEV_TOOLS && !rej && !!next && next.key === 'accepted', canDeclineRefund: DEV_TOOLS && o.hold === 'refund' && ['requested', 'review'].includes((o.refund || ({} as AnyObj)).status), canChanges: DEV_TOOLS && !rej && !!next && next.key === 'formOk' && !o.hold,
      pct: Math.round((o.idx + 1) / st.length * 100) + '%', step: 'STAGE ' + (o.idx + 1) + ' OF ' + st.length, value,
      qtyLine: o.kind === 'sell' && o.sell ? o.sell.qty + ' ' + o.sell.unit + (o.sell.grade ? ' · ' + o.sell.grade : '') : o.items.filter((it?: any) => it.qty > 0).map((it?: any) => it.qty + ' ' + M.unitOfItem(it)).join(' + '),
      img: IMG(p0 ? p0.img : 'cat-precious'),
      updated: M.fmt(lastAt), done, rej
    };
  }
  _rv(): any {
    const s = this.state;
    if (!s.ready || !MB4) return { m: {}, is: {}, rail: [], tabs: [], sheet: {} };
    const M = X(), go = (x?: any, e?: any) => () => this.go(x, e), u = s.user;
    const META: AnyObj = {
      welcome: {}, auth: { header: 1, canBack: 1, title: s.auth.mode === 'signup' ? 'Create account' : 'Sign in', cta: s.authBusy ? 'Sending code…' : 'Send verification code' },
      otp: { header: 1, canBack: 1, title: 'Verify', cta: s.authBusy ? 'Verifying…' : 'Verify and continue' },
      regType: { header: 1, title: 'Account type', step: 'STEP 1 OF 3 · ACCOUNT TYPE', prog: '33%', cta: 'Continue' },
      regDetails: { header: 1, canBack: 1, title: 'Your details', step: 'STEP 2 OF 3 · DETAILS', prog: '66%', cta: s.authBusy ? 'Creating account…' : 'Continue' },
      kyc: { header: 1, canBack: 1, title: 'KYC verification', step: 'STEP 3 OF 3 · KYC', prog: '100%', cta: s.kycBusy ? 'Submitting…' : 'Submit for review' },
      kycDoc: { header: 1, canBack: 1, title: 'Upload document', step: 'STEP 3 OF 3 · KYC', prog: '100%', cta: s.kycUploading ? 'Uploading…' : (s.kyc[s.kycDocId] ? 'Save and continue' : 'Upload to continue'), ctaOpacity: s.kycUploading || !s.kyc[s.kycDocId] ? .45 : 1 },
      kycDone: { cta: s.returnTo ? 'Continue where you left off' : 'Go to home' },
      home: { tabs: 'home' }, cats: { tabs: 'buy', header: 1, title: 'Buy minerals', cartBtn: 1 },
      minerals: { tabs: 'buy', header: 1, canBack: 1, title: (M.CATS.find((c?: any) => c.id === s.cat) || ({} as AnyObj)).name, cartBtn: 1 },
      lots: { tabs: 'buy', header: 1, canBack: 1, title: M.mineralName(s.mineral), cartBtn: 1 },
      detail: { header: 1, canBack: 1, title: 'Product details', cartBtn: 1, cta: (() => { const dp = M.product(s.pid); return dp && !productIsSoldOut(dp) ? 'Add to cart' : 'See other lots'; })() },
      cart: { header: 1, canBack: 1, title: 'Cart', cta: s.cart.length ? 'Proceed to checkout' : '' },
      checkout: { header: 1, canBack: 1, title: 'Checkout', cta: s.placing ? 'Placing order…' : 'Place order' },
      placed: { cta: 'Track order', cta2: 'Continue browsing' },
      orders: { tabs: 'orders', header: 1, title: 'Orders' }, order: { header: 1, canBack: 1, title: s.oid },
      quote: { header: 1, canBack: 1, title: 'Quotation', cta: 'Accept quotation', cta2: 'Decline quotation', cta2Fg: '#B42318' },
      contract: { header: 1, canBack: 1, title: 'E-contract', cta: 'Sign e-contract' },
      payInsp: { header: 1, canBack: 1, title: 'Payment details', cta: 'Submit details' },
      sellConfirm: { header: 1, canBack: 1, title: 'Seller confirmation', cta: 'Submit form' },
      report: { header: 1, canBack: 1, title: 'Inspection reports', cta: 'Accept reports', cta2: 'Request clarification', cta2Fg: '#A1620B' },
      pay: { header: 1, canBack: 1, title: 'Make payment', cta: s.paying ? 'Processing…' : s.pmethod === 'Bitcoin' ? 'I have sent the Bitcoin' : (s.pmethod === 'Bank transfer' ? 'I have made the transfer' : 'Pay with ' + (s.pmethod || 'UPI')), ctaOpacity: s.paying ? .6 : 1 },
      refund: { header: 1, canBack: 1, title: 'Request a refund', cta: 'Submit refund request' },
      cancel: this.cancelMeta(),
      refunds: { header: 1, canBack: 1, title: 'Refunds' },
      receipt: { header: 1, canBack: 1, title: 'Confirm receipt', cta: 'Accept delivery', cta2: 'Raise a discrepancy', cta2Fg: '#B42318' },
      chat: { header: 1, canBack: 1, title: 'Chat with Mineral Bridge' },
      shipment: { header: 1, canBack: 1, title: 'Shipment tracking' },
      sellCats: { tabs: 'sell', header: 1, title: 'Sell minerals' },
      sellForm: { header: 1, canBack: 1, title: 'Sell ' + M.mineralName(s.draft.mineral || 'gold'), cta: s.placing ? 'Submitting…' : 'Submit sell request', cta2: 'Save draft', cta2Fg: '#121214' },
      sellDone: { cta: 'Track request', cta2: 'Back to home' },
      profile: { tabs: 'profile', header: 1, title: 'Profile' },
      editProfile: { header: 1, canBack: 1, title: 'Edit profile', cta: 'Save changes' },
      bizType: { header: 1, canBack: 1, title: 'Account type', cta: 'Save' },
      kycStatus: { header: 1, canBack: 1, title: 'KYC & documents', cta: u && u.kyc === 'none' ? 'Start verification' : '' },
      notifs: { tabs: '', header: 1, canBack: 1, title: 'Notifications' }, prefs: { header: 1, canBack: 1, title: 'Notification channels' },
      contactOtp: { header: 1, canBack: 1, title: s.contact && s.contact.field === 'email' ? 'Verify new email' : 'Verify new number', cta: s.contactBusy ? 'Verifying…' : 'Verify and save' },
      help: { header: 1, canBack: 1, title: 'Help & support' },
      support: { header: 1, canBack: 1, title: 'Support messages', cta: 'New message' },
      supportThread: { header: 1, canBack: 1, title: s.supRef ? s.supRef : 'New message' },
      auctions: { header: 1, canBack: 1, title: 'Auctions' },
      auction: Object.assign({ header: 1, canBack: 1, title: 'Auction' }, this.aucCta()),
      auctionWon: { cta: this.aucWonCta(), cta2: 'Back to auctions' },
      doc: { header: 1, canBack: 1, title: 'Document', cta: 'Download', cta2: 'Share' },
      priceVar: this.varMeta()
    };
    const m = Object.assign({ ctaOpacity: 1, cta2Fg: '#6B6A70' }, META[s.screen] || ({} as AnyObj));
    if (m.tabs === undefined) m.tabs = ''; if (s.placing || s.authBusy || s.kycBusy || s.contactBusy || s.varBusy) m.ctaOpacity = .6;
    const is: AnyObj = {}; Object.keys(META).forEach((k?: any) => is[k] = s.screen === k);
    const TAB = [['home', 'Home', 'M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z'], ['buy', 'Buy', 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0'], ['sell', 'Sell', 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'], ['orders', 'Orders', 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 12h6M9 16h4'], ['profile', 'Profile', 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8']];
    const tabScreen: AnyObj = { home: 'home', buy: 'cats', sell: 'sellCats', orders: 'orders', profile: 'profile' };
    const tabs = TAB.map(([id, label, icon]: any) => ({ label, icon, bg: m.tabs === id ? '#D9B456' : 'transparent', fg: m.tabs === id ? '#121214' : '#9C9AA0', tap: () => this.jump(tabScreen[id]) }));
    const RAIL = [['ONBOARDING', [['welcome', 'Welcome'], ['auth', 'Sign in / sign up'], ['otp', 'OTP verification'], ['regType', 'Buyer / seller type'], ['regDetails', 'Your details'], ['kyc', 'KYC'], ['kycDone', 'KYC submitted']]],
      ['BUY', [['home', 'Home'], ['cats', 'Categories'], ['minerals', 'Subcategories'], ['lots', 'Product lots'], ['detail', 'Product details'], ['cart', 'Cart'], ['checkout', 'Checkout'], ['placed', 'Order placed']]],
      ['ORDER TRACKING', [['orders', 'Orders'], ['order', 'Order tracking'], ['quote', 'Quotation'], ['contract', 'E-contract'], ['pay', 'Payment'], ['receipt', 'Receipt confirmation'], ['shipment', 'Shipment tracking'], ['chat', 'Chat']]],
      ['SELL', [['sellCats', 'Select mineral'], ['sellForm', 'Mineral details'], ['sellDone', 'Request submitted'], ['sellTrack', 'Sell tracking'], ['sellConfirm', 'Seller confirmation form'], ['report', 'Inspection reports']]],
      ['AUCTIONS', [['auctions', 'Auctions'], ['auction', 'Auction & bidding'], ['auctionWon', 'Auction won']]],
      ['ACCOUNT', [['profile', 'Profile'], ['editProfile', 'Edit profile'], ['kycStatus', 'KYC & documents'], ['notifs', 'Notifications'], ['prefs', 'Notification channels'], ['help', 'Help & support']]]];
    const rail = RAIL.map(([h, items]: any) => ({ h, items: items.map(([id, label]: any) => { const scr = id === 'sellTrack' ? 'order' : id; const on = s.screen === scr && (id !== 'sellTrack' || (this.order() || ({} as AnyObj)).kind === 'sell') && (id !== 'order' || (this.order() || ({} as AnyObj)).kind !== 'sell'); return { label, bg: on ? '#121214' : 'transparent', fg: on ? '#F4F2ED' : '#3A3940', weight: on ? 600 : 500, tap: () => this.railJump(id) }; }) }));

    const o = this.order() || s.orders[0], ov = o ? this.view(o) : {};
    const prod = M.product(s.pid) || EMPTY_PRODUCT;
    return Object.assign({ m, is, tabs, rail: DEV_TOOLS ? rail : [], toast: s.toast, back: () => this.back(), primary: () => this.primary(), secondary: () => this.secondary(),
      goCart: go('cart'), cartCount: s.cart.length ? String(s.cart.length) : '', closeSheet: () => this.setState({ sheet: '' }), sheet: this.sheetVals(),
      devTools: DEV_TOOLS, devOtp: IS_DEV ? s.devOtp : '',
      pv: (() => { const p = pendingVariation(o); if (!p) return null; const up = p.to >= p.from; return { from: M.money(p.from), to: M.money(p.to), delta: (up ? '+' : '−') + M.money(Math.abs(p.to - p.from)), up, reason: p.reason, note: p.note || '', busy: !!s.varBusy, err: s.varErr || '', noteVal: s.varNote || '', setNote: (e?: any) => this.setState({ varNote: e.target.value, varErr: '' }), accept: () => this.decideVariation('accept'), reject: () => this.decideVariation('reject') }; })(),
      resetDemo: () => { if (DEV_TOOLS) void this.task(this.remote.signOutLocal('Local state reset')); }
    }, this.authVals(), this.buyVals(prod), this.orderVals(o, ov), this.sellVals(), this.accountVals(), this.contactVals(), this.supportVals(), this.auctionVals(), this.refundVals(o), this.docVals(), this.cancelVals(o));
  }
  railJump(id?: any): any {
    if (!DEV_TOOLS) return;
    const s = this.state, sc = id === 'sellTrack' ? 'order' : id, o = s.orders.find((x?: any) => (id === 'sellTrack' ? x.kind === 'sell' : true));
    const extra: AnyObj = {};
    if (o && ['order', 'quote', 'contract', 'payInsp', 'report', 'pay', 'receipt', 'chat', 'sellConfirm', 'shipment'].includes(sc)) extra.oid = o.id;
    if (sc === 'checkout') setTimeout(() => this.prefillShip(), 0);
    if (sc === 'editProfile' && s.user) { extra.edit = { name: s.user.name, business: s.user.business, email: s.user.email || '', phone: s.user.phone || '', country: s.user.country || '' }; extra.editErr = {}; }
    if (sc === 'sellForm' && !s.draft.mineral) extra.draft = Object.assign({}, s.draft, { mineral: 'gold' });
    this.jump(sc, extra);
  }
  stepOpen(): any {
    const o = this.order(); if (!o) return false;
    const next = X().stages(o.kind)[o.idx + 1];
    const ok = next && next.screen === this.state.screen && !o.rejected && !o.cancelled && (!o.hold || o.hold === 'changes');
    if (!ok) this.flash('This step is not open yet for ' + o.id);
    return ok;
  }
  err(key?: any, obj?: any): any { this.setState({ [key]: obj }); const first = Object.values(obj)[0]; if (first) this.flash(first); }
  /** Price-variation (sell orders): the screen asks the seller to accept or reject a new price from Mineral Bridge. */
  varMeta(): any {
    const pv = pendingVariation(this.order());
    return { header: 1, canBack: 1, title: 'Price update', cta: pv ? (this.state.varBusy ? 'Submitting…' : 'Accept new price') : '', cta2: pv ? 'Reject new price' : '', cta2Fg: '#B42318' };
  }
  decideVariation(decision: 'accept' | 'reject'): any {
    const s = this.state, o = this.order();
    if (s.varBusy) return;
    if (!o || !pendingVariation(o)) return this.flash('There is no price update waiting for your answer');
    this.setState({ varErr: '' });
    if (decision === 'reject') return this.setState({ sheet: 'rejectVariation' });
    void this.task(this.remote.decideVariation('accept', s.varNote));
  }
  primary(): any {
    const s = this.state, M = X(), sc = s.screen, u = s.user;
    const bg = (p: Promise<unknown>) => { void this.task(p); };
    const H: AnyObj = {
      auth: () => {
        if (s.authBusy) return;
        const a = s.auth, v = a.value.trim();
        if (a.mode === 'signup' && a.name.trim().length < 2) return this.setState({ authErr: 'Enter your full name' });
        const nd = v.replace(/\D/g, '').replace(/^0+/, '');
        if (a.method !== 'email' && (nd.length < 7 || nd.length > 12)) return this.setState({ authErr: 'Enter a valid WhatsApp number for ' + (a.cc || '+234') + ' (7–12 digits, without the country code)' });
        if (a.method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return this.setState({ authErr: 'Enter a valid email address' });
        this.setState({ authErr: '', otp: '', otpErr: '' });
        bg(this.remote.requestOtp());
      },
      otp: () => {
        if (s.authBusy) return;
        if (!/^\d{4}$/.test(s.otp)) return this.setState({ otpErr: 'Enter all 4 digits' });
        bg(this.remote.verifyOtp());
      },
      regType: () => {
        const r = s.reg;
        if (!r.role) return this.setState({ regErr: 'Choose buyer, seller or both' });
        if (r.role !== 'seller' && !r.buyerType) return this.setState({ regErr: 'Choose your buyer type' });
        if (r.role !== 'buyer' && !r.sellerType) return this.setState({ regErr: 'Choose your seller type' });
        this.setState({ regErr: '' }); this.go('regDetails');
      },
      regDetails: () => {
        if (s.authBusy) return;
        const r = s.reg;
        if (this.isBusiness(r) && r.business.trim().length < 2) return this.setState({ regErr: 'Enter your business or trading name' });
        if (!r.country.trim()) return this.setState({ regErr: 'Enter your country' });
        if (!resolveCountryCode(r.country)) return this.setState({ regErr: 'Choose a supported country (type its full name, e.g. Nigeria)' });
        if (!r.terms) return this.setState({ regErr: 'Accept the terms to continue' });
        if (!s.registrationToken) return this.setState({ regErr: 'Your verification expired. Go back and request a new code.' });
        this.setState({ regErr: '' });
        bg(this.remote.register());
      },
      kyc: () => {
        if (s.kycBusy) return;
        const k = s.kyc;
        const labels: Record<string, string> = { front: 'ID front', back: 'ID back', selfie: 'selfie', address: 'proof of address', biz: 'business document' };
        const need = kycRequiredDocIds(s.kycReq, k.idType, this.bizDocNeeded())
          .filter((id) => !k[id])
          .map((id) => labels[id] ?? id);
        if (need.length) return this.setState({ kycErr: 'Still needed: ' + need.join(', ') });
        const stale = Object.keys(KYC_INFO).filter((id?: any) => this.kycFlag(id));
        if (stale.length) return this.setState({ kycErr: 'Re-upload requested: ' + stale.map((id?: any) => KYC_INFO[id].title.toLowerCase()).join(', ') + '. Replace ' + (stale.length > 1 ? 'them' : 'it') + ' before resubmitting.' });
        if (!k.consent) return this.setState({ kycErr: 'Tick the consent box to submit' });
        this.setState({ kycErr: '' });
        bg(this.remote.submitKyc());
      },
      kycDone: () => this.resume(s.returnTo),
      auction: () => this.auctionPrimary(),
      refund: () => this.submitRefund(),
      cancel: () => this.submitCancel(),
      auctionWon: () => this.auctionToOrder(s.aid, true),
      doc: () => this.downloadDoc(),
      kycDoc: () => { if (s.kycUploading) return; if (!s.kyc[s.kycDocId]) return this.setState({ kycDocErr: 'Upload a photo or file first' }); this.flash('Document saved'); this.nextKycDoc(); },
      detail: () => { const p = M.product(s.pid); if (p && productIsSoldOut(p)) return this.go('lots', { mineral: p.mineral, fform: 'All', labOnly: false, search: '' }); this.addToCart(); },
      cart: () => { if (!s.cart.length) return; if (!this.gate('checkout')) return; this.prefillShip(); this.go('checkout'); },
      checkout: () => this.placeOrder(),
      placed: () => { this.setState({ stack: ['orders'], screen: 'order' }); this.top(); },
      sellDone: () => { this.setState({ stack: ['orders'], screen: 'order' }); this.top(); },
      quote: () => { if (!this.stepOpen()) return; bg(this.remote.acceptQuote()); },
      contract: () => {
        if (!this.stepOpen()) return;
        if (!s.sign.read) return this.setState({ signErr: 'Confirm you have read the contract' });
        if (s.sign.name.trim().toLowerCase() !== u.name.toLowerCase()) return this.setState({ signErr: 'Type your full name exactly as ' + u.name });
        this.setState({ signErr: '' });
        bg(this.remote.signContract(s.sign.name));
      },
      payInsp: () => this.submitPayInsp(),
      sellConfirm: () => this.submitSellConfirm(),
      report: () => { if (!this.stepOpen()) return; bg(this.remote.acceptReports()); },
      pay: () => {
        if (s.paying || !this.stepOpen()) return;
        const method = s.pmethod || 'UPI';
        if (method === 'Bitcoin') { const tx = (s.btcTx || '').trim(); if (!/^[0-9a-fA-Fx]{16,}$/.test(tx)) return this.setState({ payErr: 'Paste the transaction ID from your wallet (at least 16 characters)' }); }
        else { const err = paymentSubmitError(method, s.payRef || '', !!s.uploads.proof.length); if (err) return this.setState({ payErr: err }); }
        this.setState({ payErr: '' });
        bg(this.remote.submitPay(method));
      },
      receipt: () => {
        if (!this.stepOpen()) return;
        const r = s.rc;
        if (!(parseFloat(r.qty) > 0)) return this.setState({ rcErr: 'Enter the quantity you received' });
        if (s.uploads.receipt.length < 1) return this.setState({ rcErr: 'Add at least one photo of the delivery' });
        this.setState({ rcErr: '' });
        bg(this.remote.confirmReceipt());
      },
      sellForm: () => this.submitSell(),
      editProfile: () => this.saveProfile(),
      bizType: () => this.saveBizType(),
      kycStatus: () => this.go('kyc'),
      contactOtp: () => {
        if (s.contactBusy) return;
        if (!/^\d{4}$/.test(s.contactCode)) return this.setState({ contactErr: 'Enter all 4 digits' });
        bg(this.remote.verifyContactChange(s.contactCode));
      },
      priceVar: () => this.decideVariation('accept'),
      support: () => this.openSupport('')
    };
    (H[sc] || (() => {}))();
  }
  secondary(): any {
    const s = this.state, sc = s.screen;
    const bg = (p: Promise<unknown>) => { void this.task(p); };
    const H: AnyObj = {
      placed: () => this.jump('cats'), sellDone: () => this.jump('home'),
      auctionWon: () => { this.setState({ stack: ['orders'], screen: 'auctions', atab: 'ended' }); this.top(); },
      cancel: () => this.back(),
      doc: () => {
        const d = this.docData(s.doc), text = d.title + ' ' + d.no;
        if (navigator.share) navigator.share({ title: d.title, text }).catch(() => {});
        else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => this.flash('Document reference copied'), () => this.flash('Could not copy'));
        else this.flash('Sharing is not available in this browser');
      },
      quote: () => { if (this.stepOpen()) this.setState({ sheet: 'declineQuote' }); },
      report: () => {
        if (!this.stepOpen()) return;
        if (s.repNote.trim().length < 5) return this.setState({ repErr: 'Describe what needs clarifying' });
        bg(this.remote.queryReports(s.repNote.trim()));
      },
      receipt: () => {
        if (!this.stepOpen()) return;
        if (s.rc.note.trim().length < 5) return this.setState({ rcErr: 'Describe the discrepancy in the note' });
        if (!(parseFloat(s.rc.qty) > 0)) return this.setState({ rcErr: 'Enter the quantity you received' });
        bg(this.remote.disputeReceipt());
      },
      sellForm: () => { this.setState({ hasDraft: true }); this.flash('Draft saved'); },
      priceVar: () => this.decideVariation('reject')
    };
    (H[sc] || (() => {}))();
  }
  sheetVals(): any {
    const s = this.state, k = s.sheet, close = () => this.setState({ sheet: '' });
    const S: AnyObj = {
      kycPending: ['Verification still under review', 'Your KYC (' + ((s.user || ({} as AnyObj)).kycRef || '') + ') is being reviewed. You can browse, but buying and selling open once it is approved.', 'View status', '#121214', () => { close(); this.go('kycStatus'); }],
      declineQuote: ['Decline this quotation?', 'Mineral Bridge will be told and can send a revised quotation. Your order stays open.', 'Decline quotation', '#B42318', () => { close(); void this.task(this.remote.declineQuote()); }],
      rejectVariation: ['Reject this price?', 'Mineral Bridge will be told and the order is paused while they review it with you. Your note is shared with them.', 'Reject price', '#B42318', () => { close(); void this.task(this.remote.decideVariation('reject', this.state.varNote)); }],
      needSeller: ['Add selling to your account', 'Your account is set up for buying only. Choose a seller type to sell to Mineral Bridge. Your draft is kept.', 'Add seller type', '#121214', () => { close(); this.setState((x?: any) => ({ reg: Object.assign({}, x.reg, { role: 'both', buyerType: x.user.buyerType || '', sellerType: '' }), regErr: '' })); this.go('bizType'); }],
      needBuyer: ['Add buying to your account', 'Your account is set up for selling only. Choose a buyer type to place orders. Your cart is kept.', 'Add buyer type', '#121214', () => { close(); this.setState((x?: any) => ({ reg: Object.assign({}, x.reg, { role: 'both', buyerType: '', sellerType: x.user.sellerType || '' }), regErr: '' })); this.go('bizType'); }],
      logout: ['Log out?', 'You will need a verification code to sign in again.', 'Log out', '#B42318', () => { close(); this.jump('welcome', { returnTo: '' }); void this.task(this.remote.logout()); }],
      discardDraft: ['Discard this draft?', 'Photos and details you entered will be removed.', 'Discard draft', '#B42318', () => { close(); this.setState((x?: any) => ({ hasDraft: false, draft: emptyDraft(), uploads: { ...x.uploads, sellPhotos: [], sellDocs: [] } })); this.flash('Draft discarded'); }]
    };
    const v = S[k]; if (!v) return { open: false };
    return { open: true, title: v[0], body: v[1], cta: v[2], bg: v[3], confirm: v[4] };
  }
  unitOf(p?: any): any { const q = this.state.qu; return UF[p.unit] && q && q.pid === p.id && UF[q.u] ? q.u : p.unit; }
  conv(v?: any, from?: any, to?: any): any { return UF[from] && UF[to] ? +(v * UF[from] / UF[to]).toFixed(6) : v; }
  addToCart(): any {
    const s = this.state, M = X(), p = M.product(s.pid), qIn = parseFloat(s.qty);
    if (!p) return;
    const u = this.unitOf(p), q = this.conv(qIn, u, p.unit), nf = (v?: any) => M.num(+v.toFixed(6));
    if (productIsSoldOut(p)) return this.flash('This lot is no longer available');
    if (!(qIn > 0)) return this.setState({ qtyErr: 'Enter a quantity' });
    if (q < p.min) return this.setState({ qtyErr: 'Minimum order is ' + nf(this.conv(p.min, p.unit, u)) + ' ' + u + (u !== p.unit ? ' (' + p.min + ' ' + p.unit + ')' : '') });
    if (p.avail > 0 && q > p.avail) return this.setState({ qtyErr: 'Only ' + nf(this.conv(p.avail, p.unit, u)) + ' ' + u + ' available' + (u !== p.unit ? ' (' + p.avail + ' ' + p.unit + ')' : '') });
    const had = s.cart.some((c?: any) => c.pid === p.id);
    void this.task(this.remote.cartPut(p.id, qIn, u, q).then((ok?: any) => { if (!ok) return; this.flash(had ? 'Cart quantity updated' : 'Added to cart'); this.go('cart'); }));
  }
  prefillShip(): any {
    const s = this.state, u = s.user, last = s.orders.find((o?: any) => o.kind === 'buy' && o.addr);
    if (s.ship.street) return;
    this.setState({ ship: last && last.addr ? Object.assign({}, last.addr) : { org: (u && u.business !== 'Individual' && u.business) || '', street: '', city: '', country: (u && u.country) || '', contact: (u && u.name) || '', mobile: (u && u.phone) || '' }, shipErr: {} });
  }
  placeOrder(): any {
    const s = this.state, M = X();
    if (s.placing) return;
    if (!this.gate('checkout')) return;
    const e: AnyObj = {}, sh = s.ship;
    [['org', 'Company / receiver name'], ['street', 'Street address'], ['city', 'City'], ['country', 'Country'], ['contact', 'Contact person']].forEach(([k, l]: any) => { if (!String(sh[k] || '').trim()) e[k] = l + ' is required'; });
    if (String(sh.mobile || '').replace(/\D/g, '').length < 9) e.mobile = 'Mobile needs at least 9 digits';
    if (!e.country && !resolveCountryCode(sh.country)) e.country = 'Enter the delivery country as a full country name';
    if (Object.keys(e).length) return this.err('shipErr', e);
    const bad = s.cart.find((c?: any) => { const p = M.product(c.pid); return !!c.issue || (!!p && (productIsSoldOut(p) || (p.avail > 0 && c.qty > p.avail))); });
    if (bad) return this.flash('A cart item is no longer available in that quantity');
    if (!s.cart || !s.cart.length) { this.flash('Your cart is empty. Add a lot first.'); return this.jump('cats'); }
    this.setState({ shipErr: {} });
    void this.task(this.remote.placeOrder());
  }
  buyVals(p?: any): any {
    const SORTS: any[] = [['featured', 'Available first'], ['high', 'Most quantity'], ['low', 'Least quantity'], ['name', 'Name A–Z']];
    const s = this.state, M = X(), u = s.user, go = (x?: any, e?: any) => () => this.go(x, e);
    const q = s.search.trim().toLowerCase();
    const lotLine = (x?: any) => lotAvailabilityLabel(x);
    const cardOff = (x?: any) => productIsSoldOut(x);
    const card = (x?: any) => ({ id: x.id, name: x.name, form: x.form, img: IMG(x.img), qty: lotLine(x), grade: x.lab ? x.grade : 'Test report on request', lab: x.lab || 'No third-party report yet', origin: x.origin, off: cardOff(x), opacity: cardOff(x) ? .55 : 1, hasLabTag: !!x.lab && !cardOff(x), labBg: x.lab ? '#E2F2E9' : '#F1EFE9', labFg: x.lab ? '#17704C' : '#6B6A70', tap: () => this.go('detail', { pid: x.id, qty: String(x.min), qtyErr: '' }) });
    let lots = M.PRODUCTS.filter((x?: any) => x.mineral === s.mineral);
    const forms = ['All', ...new Set(lots.map((x?: any) => x.form))];
    if (s.fform !== 'All') lots = lots.filter((x?: any) => x.form === s.fform);
    if (s.labOnly) lots = lots.filter((x?: any) => x.lab);
    if (q) lots = lots.filter((x?: any) => (x.name + ' ' + x.form + ' ' + x.origin + ' ' + x.grade).toLowerCase().includes(q));
    const SORT: AnyObj = { featured: (a?: any, b?: any) => Number(b.avail > 0) - Number(a.avail > 0), high: (a?: any, b?: any) => b.avail - a.avail, low: (a?: any, b?: any) => a.avail - b.avail, name: (a?: any, b?: any) => a.name.localeCompare(b.name) };
    lots = [...lots].sort(SORT[s.sort]);
    const global = q && s.screen === 'cats' ? M.PRODUCTS.filter((x?: any) => (x.name + ' ' + M.mineralName(x.mineral) + ' ' + x.form).toLowerCase().includes(q)).slice(0, 12).map(card) : [];
    const cat = M.CATS.find((c?: any) => c.id === s.cat) || M.CATS[0] || EMPTY_CAT;
    const mine = s.orders.map((o?: any) => this.view(o)), actN = mine.filter((v?: any) => v.you).length;
    const inCart = s.cart.find((c?: any) => c.pid === p.id);
    return {
      userFirst: u ? u.name.split(' ')[0] : 'Guest', isGuest: !u, kycBanner: !!u && u.kyc !== 'verified',
      kycBannerText: u && u.kyc === 'pending' ? 'KYC under review · ' + u.kycRef : u && u.kyc === 'rejected' ? 'KYC needs another document' : 'Complete KYC to buy or sell',
      goKycStatus: go('kycStatus'), goSignup: () => { this.setState((x?: any) => ({ auth: Object.assign({}, x.auth, { mode: 'signup' }) })); this.go('auth'); },
      goBuy: () => this.jump('cats'), goSell: () => this.jump('sellCats'), goOrders: () => this.jump('orders'), goNotifs: go('notifs'),
      unread: (() => { const n = s.unread || s.notifs.filter((x?: any) => !x.read).length; return n ? String(n) : ''; })(),
      homeStats: [['Action needed', actN, 'orders'], ['Active orders', mine.filter((v?: any) => v.kind === 'buy' && !v.done && !v.rej).length, 'orders'], ['Sell requests', mine.filter((v?: any) => v.kind === 'sell' && !v.done && !v.rej).length, 'orders']].map(([l, n, to]: any) => ({ l, n: String(n), tap: () => { this.setState({ otab: l === 'Sell requests' ? 'sell' : 'buy' }); this.jump(to); } })),
      needYou: mine.filter((v?: any) => v.you).slice(0, 3).map((v?: any) => ({ id: v.id, title: v.title, action: v.actionLabel, tap: () => this.go('order', { oid: v.id }) })), hasNeedYou: actN > 0 && !!u,
      homeCats: M.CATS.map((c?: any) => ({ name: c.name, n: M.PRODUCTS.filter((x?: any) => c.minerals.some(([m]: any) => m === x.mineral)).length + ' lots', img: IMG(c.img), tap: () => this.go('minerals', { cat: c.id, search: '' }) })),
      search: s.search, setSearch: (e?: any) => this.setState({ search: e.target.value }), clearSearch: () => this.setState({ search: '' }),
      hasGlobal: global.length > 0, global, noGlobal: !!q && s.screen === 'cats' && !global.length, notSearching: !q,
      cats: M.CATS.map((c?: any) => ({ name: c.name, img: IMG(c.img), subs: c.minerals.map((m?: any) => m[1]).join(' · '), n: M.PRODUCTS.filter((x?: any) => c.minerals.some(([m]: any) => m === x.mineral)).length + ' lots', tap: () => this.go('minerals', { cat: c.id, search: '' }) })),
      catName: cat.name, catImg: IMG(cat.img),
      subs: cat.minerals.map(([id, name]: any) => { const n = M.PRODUCTS.filter((x?: any) => x.mineral === id).length; return { name, n: n ? n + (n === 1 ? ' lot' : ' lots') : 'No lots yet', forms: [...new Set(M.PRODUCTS.filter((x?: any) => x.mineral === id).map((x?: any) => x.form))].join(' · ') || 'New listings soon', tap: () => this.go('lots', { mineral: id, fform: 'All', labOnly: false, search: '', sort: 'featured' }) }; }),
      lots: lots.map(card), lotCount: lots.length + (lots.length === 1 ? ' lot' : ' lots'), noLots: !lots.length,
      lotsEmptyText: M.PRODUCTS.some((x?: any) => x.mineral === s.mineral) ? 'No lots match these filters.' : 'No ' + M.mineralName(s.mineral).toLowerCase() + ' lots are listed yet.',
      resetFilters: () => this.setState({ fform: 'All', labOnly: false, search: '', sort: 'featured' }),
      formChips: forms.map((f?: any) => ({ label: f, bg: s.fform === f ? '#121214' : '#fff', fg: s.fform === f ? '#F4F2ED' : '#121214', border: s.fform === f ? '#121214' : '#E4E2DB', tap: () => this.setState({ fform: f }) })),
      labChipBg: s.labOnly ? '#121214' : '#fff', labChipFg: s.labOnly ? '#F4F2ED' : '#121214', toggleLab: () => this.setState({ labOnly: !s.labOnly }),
      sorts: SORTS.map(([id, l]: any) => ({ label: l, on: s.sort === id, weight: s.sort === id ? 600 : 400, tap: () => this.setState({ sort: id, sortOpen: false }) })),
      sortLabel: (SORTS.find((x?: any) => x[0] === s.sort) || SORTS[0])[1], sortOpen: !!s.sortOpen, sortChevron: s.sortOpen ? 'rotate(180deg)' : 'none',
      toggleSort: () => this.setState({ sortOpen: !s.sortOpen }),
      gridCols: s.cols === 3 ? 'repeat(3,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))', gridGap: s.cols === 3 ? '8px' : '10px', cardPad: s.cols === 3 ? '8px 9px 10px' : '10px 11px 12px', nameSize: s.cols === 3 ? '12.5px' : '14px', showGridMeta: s.cols !== 3,
      colOpts: [[2, '2 columns', 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'], [3, '3 columns', 'M3 4h5v5H3zM9.5 4h5v5h-5zM16 4h5v5h-5zM3 13h5v5H3zM9.5 13h5v5h-5zM16 13h5v5h-5z']].map(([n, label, icon]: any) => ({ label, icon, bg: (s.cols || 2) === n ? '#fff' : 'transparent', fg: (s.cols || 2) === n ? '#121214' : '#8B8A90', tap: () => this.setState({ cols: n }) })),
      lotNum: String(lots.length), lotWord: lots.length === 1 ? 'lot' : 'lots',
      p: { id: p.id, name: p.name, form: p.form, mineral: M.mineralName(p.mineral), img: IMG(p.img), qty: lotLine(p), unit: p.unit, min: p.min + ' ' + p.unit, origin: p.origin, hasLab: !!p.lab, noLab: !p.lab, grade: p.grade, lab: p.lab, cert: p.cert, off: productIsSoldOut(p), on: !productIsSoldOut(p), onRequest: productIsAvailableOnRequest(p) },
      pDocs: productHasLotDocuments(p) ? [['Test report', p.lab + ' · ' + p.cert + '-TR.pdf'], ['Certificate of analysis', p.cert + '.pdf'], ['Origin declaration', 'Mine of origin · ' + p.origin.split(' · ')[0]]].map(([n, f]: any, i: any) => { const t = ['lotReport', 'lotCoa', 'lotOrigin'][i] as string; return { n, f, tap: () => this.openProductDoc(p, PRODUCT_DOC[t] as ProductDocumentType, t, false), dl: () => this.openProductDoc(p, PRODUCT_DOC[t] as ProductDocumentType, t, true) }; }) : [],
      qty: s.qty, setQty: (e?: any) => this.setState({ qty: e.target.value.replace(/[^\d.]/g, ''), qtyErr: '' }), qtyErr: s.qtyErr, inCartNote: inCart ? 'In your cart: ' + (inCart.uIn ? inCart.qIn + ' ' + inCart.uIn : inCart.qty + ' ' + p.unit) : '',
      ...(() => { const pu = p.unit, u = this.unitOf(p), can = !!UF[pu], nf = (v?: any) => (+v.toFixed(6)).toLocaleString('en-US', { maximumFractionDigits: 6 }), q = parseFloat(s.qty);
        return { unitPick: can, noUnitPick: !can,
          qtyUnits: can ? ['g', 'kg', 't'].map((k?: any) => ({ label: UNAME[k], short: k, bg: u === k ? '#121214' : 'transparent', fg: u === k ? '#F4F2ED' : '#6B6A70', tap: () => { if (k === u) return; const v = parseFloat(s.qty); this.setState({ qu: { pid: p.id, u: k }, qty: v > 0 ? String(this.conv(v, u, k)) : s.qty, qtyErr: '' }); } })) : [],
          qtyEquiv: can && q > 0 ? '= ' + ['g', 'kg', 't'].filter((k?: any) => k !== u).map((k?: any) => nf(this.conv(q, u, k)) + ' ' + k).join(' = ') : '',
          minShown: can ? nf(this.conv(p.min, pu, u)) + ' ' + u : p.min + ' ' + pu, maxShown: can ? nf(this.conv(p.avail, pu, u)) + ' ' + u : p.avail + ' ' + pu }; })(),
      cart: s.cart.map((c?: any) => { const x = M.product(c.pid) || ({} as AnyObj); return { name: c.name || x.name || c.pid, id: c.pid, issue: c.issue || '', img: IMG(x.img), qty: c.uIn && c.uIn !== M.unitOfItem(c) ? c.qIn + ' ' + c.uIn + ' (' + (+c.qty.toFixed(4)) + ' ' + M.unitOfItem(c) + ')' : c.qty + ' ' + M.unitOfItem(c), grade: x.lab ? x.grade : 'Test report on request', edit: () => this.go('detail', { pid: c.pid, qty: String(c.qIn || c.qty), qu: { pid: c.pid, u: c.uIn || M.unitOfItem(c) } }), remove: () => { void this.task(this.remote.cartRemove(c.pid)); } }; }),
      cartEmpty: !s.cart.length, hasCart: s.cart.length > 0,
      ship: s.ship, shipErr: s.shipErr, shipFields: [['org', 'COMPANY / RECEIVER'], ['street', 'STREET ADDRESS'], ['city', 'CITY'], ['country', 'COUNTRY'], ['contact', 'CONTACT PERSON'], ['mobile', 'MOBILE']].map(([k, l]: any) => ({ l, v: s.ship[k] || '', err: (s.shipErr || ({} as AnyObj))[k] || '', border: (s.shipErr || ({} as AnyObj))[k] ? '#B42318' : '#E4E2DB', set: (e?: any) => this.setState((x?: any) => ({ ship: Object.assign({}, x.ship, { [k]: e.target.value }), shipErr: Object.assign({}, x.shipErr, { [k]: '' }) })) })),
      buyerLine: u ? u.name + ' · ' + u.business : '', buyerContact: u ? (u.phone || u.email) : '',
      placedOrder: (s.orders.find((o?: any) => o.id === s.oid) || ({} as AnyObj)).id || ''
    };
  }
  submitPayInsp(): any {
    if (!this.stepOpen()) return;
    const f = this.state.pf, e: AnyObj = {};
    if (!f.method) e.method = 'Choose a payment method'; if (!f.terms) e.terms = 'Choose payment terms';
    if (!f.billName.trim()) e.billName = 'Billing name is required'; if (!f.billAddr.trim()) e.billAddr = 'Billing address is required';
    if (!f.c1) e.c = 'Tick the confirmation';
    if (Object.keys(e).length) return this.err('pfErr', e);
    void this.task(this.remote.submitBuyerForm());
  }
  submitSellConfirm(): any {
    if (!this.stepOpen()) return;
    const f = this.state.sc, e: AnyObj = {};
    if (!f.method) e.method = 'Choose how you want to be paid';
    if (!f.bank.trim()) e.bank = f.method === 'UPI' ? 'Account holder name is required' : 'Bank / wallet name is required';
    if (f.method === 'UPI') { if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(f.account.trim())) e.account = 'Enter a valid UPI ID, e.g. name@okbank'; }
    else if (f.account.trim().length < 6) e.account = 'Enter a valid account or wallet number';
    if (!f.date) e.date = 'Choose an inspection date'; if (!f.time) e.time = 'Choose a time';
    if (!f.address.trim()) e.address = 'Inspection location is required';
    if (!f.c1) e.c = 'Tick the confirmation';
    if (Object.keys(e).length) return this.err('scErr', e);
    void this.task(this.remote.submitSellerForm());
  }
  /** The Orders screen lists (buying / selling / auctions). Needed even when there is no current order. */
  orderListVals(): any {
    const s = this.state;
    return {
      orderTabs: [['buy', 'Buying'], ['sell', 'Selling'], ['auction', 'Auctions']].map(([id, l]: any) => ({ label: l + ' · ' + (id === 'auction' ? this.myAucs().length : s.orders.filter((x?: any) => x.kind === id && !x.auction).length), bg: s.otab === id ? '#121214' : 'transparent', fg: s.otab === id ? '#F4F2ED' : '#6B6A70', tap: () => this.setState({ otab: id }) })),
      orderList: s.otab === 'auction' ? this.myAucs().map((a?: any) => this.aucOrderCard(a)) : s.orders.filter((x?: any) => x.kind === s.otab && !x.auction).map((x?: any) => Object.assign(this.view(x), { tap: () => this.go('order', { oid: x.id }) })),
      noOrders: s.otab === 'auction' ? !this.myAucs().length : !s.orders.some((x?: any) => x.kind === s.otab && !x.auction), ordersEmptyCta: s.otab === 'buy' ? 'Browse minerals' : s.otab === 'auction' ? 'Browse auctions' : 'Sell a mineral', ordersEmptyTap: () => s.otab === 'auction' ? this.go('auctions', { atab: 'live' }) : this.jump(s.otab === 'buy' ? 'cats' : 'sellCats'),
      ordersLoading: !!s.ordersLoading
    };
  }
  sendChat(o: any, text: string): any { void this.task(this.remote.sendChat(o, text)); }
  openProductDoc(p: any, type: ProductDocumentType, t: string, download = false): any {
    void this.task(this.remote.openProductDocument(p.id, type, download).then((ok?: any) => { if (ok === false) { if (download) this.downloadDoc({ t, pid: p.id }); else this.openDoc({ t, pid: p.id }); } }));
  }
  orderVals(o?: any, ov?: any): any {
    const s = this.state, M = X(), u = s.user || EMPTY_USER;
    if (!o) return this.orderListVals();
    const st = M.stages(o.kind), ph = M.phases(o.kind), all = !st[o.idx + 1], cur = all ? st[o.idx].phase : st[o.idx + 1].phase;
    const chips = (list?: any, val?: any, set?: any) => list.map((v?: any) => ({ label: v, bg: val === v ? '#121214' : '#fff', fg: val === v ? '#F4F2ED' : '#121214', border: val === v ? '#121214' : '#E4E2DB', tap: () => set(v) }));
    const days = Array.from({ length: 7 }, (_?: any, i?: any) => M.day(Date.now() + (i + 2) * 864e5));
    const pf = s.pf, setPf = (p?: any) => this.setState((x?: any) => ({ pf: Object.assign({}, x.pf, p), pfErr: {} })), pe = s.pfErr || ({} as AnyObj);
    const sc = s.sc, setSc = (p?: any) => this.setState((x?: any) => ({ sc: Object.assign({}, x.sc, p), scErr: {} })), se = s.scErr || ({} as AnyObj);
    const fld = (obj?: any, err?: any, set?: any, k?: any, l?: any, ph2?: any) => ({ l, ph: ph2 || '', v: obj[k] || '', err: err[k] || '', border: err[k] ? '#B42318' : '#E4E2DB', set: (e?: any) => set({ [k]: e.target.value }) });
    const ct = s.contacts, wa = ct ? String(ct.whatsapp || '').replace(/\D/g, '') : '';
    const contact = [['Phone', ct ? 'tel:' + ct.phone : ''], ['SMS', ct ? 'sms:' + ct.phone : ''], ['Email', ct ? 'mailto:' + ct.email : ''], ['WhatsApp', wa ? 'https://wa.me/' + wa : ''], ['Chat', '']].map(([l, href]: any) => ({ l, tap: () => { if (l === 'Chat') return this.go('chat'); if (!href) return this.flash('Contact details are loading. Try again in a moment.'); window.open(href, l === 'WhatsApp' ? '_blank' : '_self'); } }));
    const chat = (s.chat[o.id] || []).map((c?: any) => ({ text: c.text, at: M.fmt(c.at), me: c.me, them: !c.me, action: c.action === 'refund' ? (this.refundable(o) ? 'Open refund form' : '') : c.action === 'trackRefund' ? 'View refund status' : '', act: () => c.action === 'refund' ? this.openRefund(o, { note: c.ctx || '' }) : this.go('order', { oid: o.id }) }));
    const docs = [];
    if (o.quote) docs.push(['Quotation ' + o.quote.no, M.fmt(o.quote.issued)]);
    if (o.idx >= st.findIndex((x?: any) => x.key === 'contractMb')) docs.push(['E-contract (signed by both)', 'PDF']);
    if (o.company) docs.push(['Mineral Bridge inspection report', M.fmt(o.company.at)]);
    if (o.sgs) docs.push(['SGS test report ' + o.sgs.no, M.fmt(o.sgs.at)]);
    if (o.txn) docs.push(['Payment confirmation ' + o.txn, 'PDF']);
    if (o.ship) docs.push(['Shipment ' + o.ship.id + ' · transport documents', 'PDF']);
    // Documents: the issued ones come from the API (rendered by GET /documents/:number); cancellation and refund receipts are built from the order.
    const DK: any[] = [];
    (o.docs || []).forEach((d?: any) => DK.push([{ t: 'api', num: d.number, oid: o.id }, d.label || d.type, d.number + (d.at ? ' · ' + M.fmt(d.at) : '') + (d.status ? ' · ' + String(d.status) : '')]));
    if (o.cancelled) DK.push([{ t: 'cancel', oid: o.id }, 'Cancellation confirmation', 'Cancelled ' + M.fmt(o.cancelled.at)]);
    [...(o.history || []), ...(o.refund ? [o.refund] : [])].filter((r?: any) => r.status === 'refunded').forEach((r?: any) => DK.push([{ t: 'refund', oid: o.id, ref: r.ref }, 'Refund receipt ' + r.ref, M.money(r.amount)]));
    const est = !!(o.quote && o.quote.est), amount = o.quote ? (est ? 'From ' : '') + M.money(o.quote.total) : '';
    const ins = s.instr, btc = s.om[o.id] && s.om[o.id].btc, btcLeft = btc ? Math.max(0, btc.lockExpiresAt - Date.now()) : 0, btcAmt = btc ? (btc.amountSats / 1e8).toFixed(8) : '';
    const NA = ins ? '—' : 'Loading…', pm = s.pmethod || 'UPI', f0 = o.form || ({} as AnyObj);
    const acct: any[] = [['Beneficiary', ins ? ins.beneficiary : NA], ['Bank', ins ? ins.bank : NA], ['Account', ins ? ins.account : NA], ['SWIFT', ins ? ins.swift : NA], ['Reference', o.id]];
    const payRows: any[] = pm === 'UPI' ? [['Pay to UPI ID', ins ? ins.upiId || 'Not available. Use bank transfer.' : NA], ['Payee', ins ? ins.beneficiary : NA], ['Note / reference', o.id]]
      : pm === 'Bitcoin' ? (btc ? [['Amount', btcAmt + ' BTC'], ['Rate', '1 BTC = ' + M.money(btc.rateMinorPerBtc / 100)], ['Network', 'Bitcoin (on-chain)'], ['Address', btc.address], ['Memo', o.id]] : [['Bitcoin quote', s.paying ? 'Requesting…' : 'Not requested yet']])
        : pm === 'Net banking' ? acct
          : f0.method === 'Letter of credit' ? [['Issuing bank', 'Your bank'], ['Beneficiary', ins ? ins.beneficiary : NA], ['Reference', o.id]]
            : acct;
    return Object.assign({ ov }, {
      ...this.orderListVals(),
      phases: ph.map((l?: any, i?: any) => { const d = all || i < cur, a = !all && i === cur; return { l, n: String(i + 1), done: d, active: a, pending: !d && !a, dot: d ? '#121214' : a ? '#D9B456' : '#fff', dotBorder: d ? '#121214' : a ? '#D9B456' : '#D5D3CC', fg: !d && !a ? '#8B8A90' : '#121214', line: i === ph.length - 1 ? 'transparent' : d ? '#121214' : '#E4E2DB', tag: d ? 'Done' : a ? 'Now' : '' }; }),
      audit: [...o.log].reverse().map((l?: any, i?: any, arr?: any) => ({ who: l.who, text: l.text, note: l.note, at: M.fmt(l.at), line: i === arr.length - 1 ? 'transparent' : '#EFEDE7', youBg: l.who === 'You' ? '#121214' : '#F1EFE9', youFg: l.who === 'You' ? '#D9B456' : '#3A3940', ini: l.who === 'You' ? 'YOU' : l.who.startsWith('SGS') ? 'SGS' : l.who.startsWith('Sahel') ? 'LP' : 'MB' })),
      orderLines: o.kind === 'sell' && o.sell ? [{ n: o.sell.name, q: o.sell.qty + ' ' + o.sell.unit, g: o.sell.grade + ' · ' + o.sell.form }] : o.items.map((it?: any) => { const p = M.product(it.pid) || ({} as AnyObj); return { n: it.name || p.name || it.pid, q: it.qty + ' ' + M.unitOfItem(it), g: p.lab ? p.grade + ' · ' + p.lab : 'Test report on request' }; }),
            hasAmount: !!amount, amount, amountLabel: o.kind === 'sell' ? 'AGREED PRICE' : 'QUOTED TOTAL',
      hasShip: !!o.ship, showTrack: !!o.ship && !(o.refund && o.refund.status === 'refunded'), shipLine: o.ship ? o.ship.partner + ' · ' + o.ship.id : '', shipContact: o.ship ? o.ship.contact : '',
      sh: Object.assign({ id: '', status: '', from: '', to: '', partner: '', contact: '', mode: '', pickup: '', vehicle: '', driver: '', seals: '', eta: '', location: '', pod: '' }, o.ship || ({} as AnyObj)),
      goShipment: () => this.go('shipment'), callDriver: () => this.flash('Calling ' + ((o.ship || ({} as AnyObj)).partner || 'logistics partner')), openPod: () => { const d = (o.docs || []).find((x?: any) => /pod|proof/i.test(x.type)); if (d) this.openDoc({ t: 'api', num: d.number, oid: o.id }); else this.flash('The proof of delivery is not available yet'); },
      shipSteps: (() => { const ORDER = ['Pickup scheduled', 'Picked up', 'In transit', 'Delivered']; const st = (o.ship || ({} as AnyObj)).status === 'Delivered to vault' ? 'Delivered' : (o.ship || ({} as AnyObj)).status; const i = ORDER.indexOf(st); return ['Booked', 'Collected', 'In transit', 'Delivered'].map((l?: any, k?: any) => ({ l, bar: k <= i ? '#D9B456' : 'rgba(255,255,255,.14)', fg: k <= i ? '#F4F2ED' : '#9C9AA0' })); })(),
      shipDocs: ((o.ship || ({} as AnyObj)).docs || []).map((n?: any) => ({ n, f: o.ship.id + ' · ' + o.ship.partner, tap: () => this.flash('Transport documents are listed under Documents on the order page'), dl: () => this.flash('Transport documents are listed under Documents on the order page') })), hasShipDocs: !!((o.ship || ({} as AnyObj)).docs || []).length,
      shipEvents: [...((o.ship || ({} as AnyObj)).events || [])].reverse().map(([t, at]: any, i?: any, a?: any) => ({ t, at: M.fmt(at), dot: i === 0 ? '#D9B456' : '#121214', line: i === a.length - 1 ? 'transparent' : '#E4E2DB' })),
      hasInsp: !!o.insp, inspLine: o.insp ? o.insp.when + ' · ' + ((o.form || ({} as AnyObj)).address || '') : '',
      odocs: DK.map(([t, n, f, ref]: any) => ({ n, f, tap: () => this.openDoc({ t, oid: o.id, ref }), dl: () => this.downloadDoc({ t, oid: o.id, ref }) })), hasDocs: DK.length > 0,
      goAction: () => { if (ov.actionScreen === 'quote' && !o.quote) return; this.prefillForms(o); this.go(ov.actionScreen); }, goChat: () => this.go('chat'),
      runDemo: () => this.demo(''), demoReject: () => this.demo('reject'), demoChanges: () => this.demo('changes'),
      contact,
      rejAltLabel: o.kind === 'sell' ? 'Sell another mineral' : 'Find a similar lot', rejAltTap: () => { if (o.kind === 'sell') return this.jump('sellCats'); const m = (M.PRODUCTS.find((p?: any) => p.id === (o.items[0] || ({} as AnyObj)).pid) || ({} as AnyObj)).mineral || 'gold'; this.jump('lots', { mineral: m, fform: 'All', labOnly: false, search: '' }); },
      findSimilar: () => { const m = o.kind === 'buy' ? (M.PRODUCTS.find((p?: any) => p.id === (o.items[0] || ({} as AnyObj)).pid) || ({} as AnyObj)).mineral : 'gold'; this.jump('lots', { mineral: m, fform: 'All', labOnly: false, search: '' }); },
      q: o.quote ? { no: o.quote.no + (o.quote.rev ? ' · revision ' + o.quote.rev : ''), total: M.money(o.quote.total), valid: M.fmt(o.quote.valid), issued: M.fmt(o.quote.issued) } : { no: '', total: '', valid: '', issued: '' },
      qLines: o.kind === 'sell' && o.sell ? [{ n: o.sell.name, q: o.sell.qty + ' ' + o.sell.unit, a: amount }] : o.items.map((it?: any) => { const p = M.product(it.pid) || ({} as AnyObj); return { n: it.name || p.name || it.pid, q: it.qty + ' ' + M.unitOfItem(it), a: it.amount != null ? M.money(it.amount) : '' }; }),
            qNote: o.kind === 'sell' ? 'Price for the full quantity, subject to third-party inspection. Payment is released after the inspection is approved.' : 'Includes product, 1.2% verification and escrow fee, and insured transport. Final payment terms are set in the e-contract.',
      partyBuyer: o.kind === 'sell' ? 'Mineral Bridge Ltd' : u.business + ' (' + u.name + ')', partySeller: o.kind === 'sell' ? u.business + ' (' + u.name + ')' : 'Mineral Bridge Ltd',
      clauses: (() => { const ct = s.om[o.id] && s.om[o.id].contract; const rows: any[] = ct && ct.clauses && ct.clauses.length ? ct.clauses.map((x?: any) => [x.h, x.text]) : [['E-contract', 'Loading the contract text from Mineral Bridge…']]; if (ct && amount) rows.unshift(['Price', amount]); return rows.map(([k, v]: any) => ({ k, v })); })(),
      contractNo: s.om[o.id] && s.om[o.id].contract ? 'E-contract ' + s.om[o.id].contract.number : '',
            signRead: s.sign.read, signReadBg: s.sign.read ? '#121214' : '#fff', toggleRead: () => this.setState((x?: any) => ({ sign: Object.assign({}, x.sign, { read: !x.sign.read }), signErr: '' })),
      signName: s.sign.name, setSignName: (e?: any) => this.setState((x?: any) => ({ sign: Object.assign({}, x.sign, { name: e.target.value }), signErr: '' })), signErr: s.signErr, signAs: u.name,
      youSignedLabel: o.log.some((l?: any) => l.text === 'E-contract signed by you') ? 'Signed' : 'Pending', mbSignedLabel: o.log.some((l?: any) => l.text === 'E-contract countersigned') ? 'Signed' : 'Pending',
      payMethods: chips(PAY, pf.method, (v?: any) => setPf({ method: v })), payTerms: chips(TERMS, pf.terms, (v?: any) => setPf({ terms: v })),
      pfBill: [fld(pf, pe, setPf, 'billName', 'BILLING NAME'), fld(pf, pe, setPf, 'billAddr', 'BILLING ADDRESS')], pfInstr: pf.instr, setPfInstr: (e?: any) => setPf({ instr: e.target.value }),
      inspDays: chips(days, pf.date, (v?: any) => setPf({ date: v })), inspSlots: chips(SLOTS, pf.time, (v?: any) => setPf({ time: v })),
      pfInsp: [fld(pf, pe, setPf, 'address', 'STORAGE / INSPECTION ADDRESS'), fld(pf, pe, setPf, 'contact', 'CONTACT PERSON'), fld(pf, pe, setPf, 'mobile', 'CONTACT MOBILE')],
      pfAvailBg: pf.avail ? '#121214' : '#D5D3CC', pfAvailX: pf.avail ? '20px' : '2px', togglePfAvail: () => setPf({ avail: !pf.avail }), pfInspInstr: pf.inspInstr, setPfInspInstr: (e?: any) => setPf({ inspInstr: e.target.value }),
      pfC1Bg: pf.c1 ? '#121214' : '#fff', pfC2Bg: pf.c2 ? '#121214' : '#fff', togglePfC1: () => setPf({ c1: !pf.c1 }), togglePfC2: () => setPf({ c2: !pf.c2 }),
      pfErrList: Object.values(pe).filter(Boolean).join(' · '),
      scMethods: chips(SELLPAY, sc.method, (v?: any) => setSc({ method: v })), scFields: sc.method === 'UPI' ? [fld(sc, se, setSc, 'bank', 'ACCOUNT HOLDER NAME'), fld(sc, se, setSc, 'account', 'UPI ID (e.g. name@bank)')] : [fld(sc, se, setSc, 'bank', 'BANK OR WALLET NAME'), fld(sc, se, setSc, 'account', 'ACCOUNT / WALLET NUMBER')],
      scDays: chips(days, sc.date, (v?: any) => setSc({ date: v })), scSlots: chips(SLOTS, sc.time, (v?: any) => setSc({ time: v })), scAddr: [fld(sc, se, setSc, 'address', 'INSPECTION & PICKUP LOCATION')],
      scC1Bg: sc.c1 ? '#121214' : '#fff', toggleScC1: () => setSc({ c1: !sc.c1 }), scErrList: Object.values(se).filter(Boolean).join(' · '),
      hasReports: !!(o.company || o.sgs), noReports: !(o.company || o.sgs), hasCompany: !!o.company, hasSgs: !!o.sgs,
      company: o.company ? { by: o.company.by, at: M.fmt(o.company.at), result: o.company.result } : {}, sgs: o.sgs ? { no: o.sgs.no, at: M.fmt(o.sgs.at), result: o.sgs.result } : {},
      sgsRows: [...(o.kind === 'sell' && o.sell ? [['Net weight', o.sell.qty + ' ' + o.sell.unit], ['Grade', o.sell.grade]] : o.items.map((it?: any) => { const p = M.product(it.pid) || ({} as AnyObj); return [it.name || p.name || it.pid, it.qty + ' ' + M.unitOfItem(it) + (p.grade ? ' · ' + p.grade : '')]; })), ['Result', (o.sgs && o.sgs.result) || (o.company && o.company.result) || '—']].map(([k, v]: any) => ({ k, v })),
            repNote: s.repNote, setRepNote: (e?: any) => this.setState({ repNote: e.target.value, repErr: '' }), repErr: s.repErr,
      payAmount: amount, payRef: o.id, isBtc: pm === 'Bitcoin', btcAmt, btcLock: this.left(btcLeft).slice(3), btcExpired: !!btc && btcLeft <= 0, btcTx: s.btcTx || '', setBtcTx: (e?: any) => this.setState({ btcTx: e.target.value.trim(), payErr: '' }),
      hasBtcQuote: !!btc, getBtcQuote: () => { void this.task(this.remote.btcQuote(true)); },
      copyBtc: () => { if (!btc) return this.flash('Get a Bitcoin quote first'); if (navigator.clipboard) navigator.clipboard.writeText(btc.address).then(() => this.flash('Address copied'), () => this.flash('Copy failed. Select the address and copy it.')); else this.flash('Copy is not available in this browser'); },
      needsRef: paymentNeedsReference(pm), payRefVal: s.payRef || '', setPayRef: (e?: any) => this.setState({ payRef: e.target.value, payErr: '' }), payRefLabel: pm === 'UPI' ? 'UPI TRANSACTION REFERENCE' : 'PAYMENT REFERENCE',
      quickPays: [['UPI', 'UPI', 'Google Pay, PhonePe, Paytm or any UPI app', 'M7 3h10v18H7zM11 18h2'], ['Net banking', 'Net banking', 'Pay from your bank account online', 'M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-7 10 7z'], ['Bank transfer', 'Bank transfer', 'NEFT, RTGS or SWIFT · upload the receipt', 'M4 7h16v12H4zM4 11h16M8 15h3'], ['Bitcoin', 'Bitcoin', 'On-chain BTC · rate locked for 15 minutes', 'M9 4v16M13 4v3M13 17v3M7 7h7a3 3 0 0 1 0 6H7M7 13h8a3 3 0 0 1 0 6H7']].map(([id, label, sub, icon]: any) => { const on = pm === id; return { label, sub, icon, border: on ? '#121214' : '#E4E2DB', sh: on ? '0 6px 18px rgba(18,18,20,.10)' : 'none', radio: on ? '7px solid #121214' : '1.5px solid #C8C6BF', iconBg: on ? '#121214' : '#F1EFE9', iconFg: on ? '#D9B456' : '#121214', tap: () => { this.setState({ pmethod: id, payErr: '', payRef: '' }); if (id === 'Bitcoin') void this.task(this.remote.btcQuote()); } }; }),
      isBankPay: pm !== 'Bitcoin' && pm !== 'UPI' && pm !== 'Net banking', paying: !!s.paying, payingText: 'Submitting your payment details…',
      payHead: pm === 'Bitcoin' ? 'SEND BITCOIN TO' : pm === 'Bank transfer' ? 'TRANSFER TO' : pm === 'Net banking' ? 'PAY FROM YOUR ONLINE BANKING TO' : 'UPI DETAILS',
      askOtherPay: () => { this.setState(() => ({ msg: 'Hi, I would like to pay ' + o.id + ' (' + amount + ') by letter of credit or another method. Please advise.' })); this.go('chat'); },
      payBank: payRows.map(([k, v]: any) => ({ k, v })),
            proof: s.proof, noProof: !s.proof, proofBg: s.proof ? '#E2F2E9' : '#fff', proofBorder: s.proof ? '#B7DFC8' : '#D5D3CC', proofLabel: s.uploads.proof.length ? s.uploads.proof.map((x?: any) => x.name).join(', ') + ' added ✓' : '', toggleProof: () => { if (s.uploads.proof.length) this.remote.removeUpload('proof', s.uploads.proof.length - 1); else this.remote.pickFiles('proof', 'payment_proof', { limit: 3, max: 3 }); this.setState({ payErr: '' }); }, payErr: s.payErr,
      rcExpected: o.kind === 'buy' ? o.items.map((it?: any) => it.qty + ' ' + M.unitOfItem(it)).join(' + ') : '',
      rcQty: s.rc.qty, setRcQty: (e?: any) => this.setState((x?: any) => ({ rc: Object.assign({}, x.rc, { qty: e.target.value }), rcErr: '' })),
      rcConds: chips(['Good', 'Minor damage', 'Damaged'], s.rc.cond, (v?: any) => this.setState((x?: any) => ({ rc: Object.assign({}, x.rc, { cond: v }) }))),
      rcPhotos: String(s.uploads.receipt.length), addRcPhoto: () => { this.remote.pickFiles('receipt', 'delivery_photo', { limit: 6, max: 6 }); this.setState({ rcErr: '' }); },
      rcNote: s.rc.note, setRcNote: (e?: any) => this.setState((x?: any) => ({ rc: Object.assign({}, x.rc, { note: e.target.value }), rcErr: '' })), rcErr: s.rcErr,
      chatMsgs: chat, msg: s.msg, setMsg: (e?: any) => this.setState({ msg: e.target.value }),
      chatActions: [
        ...(this.refundable(o) ? [{ l: 'Request a refund', tap: () => this.chatRefund(o) }] : []),
        ...(o.refund && !['declined', 'refunded'].includes(o.refund.status) ? [{ l: 'Refund status', tap: () => this.chatSay(o, 'What is the status of my refund ' + o.refund.ref + '?', 'Refund ' + o.refund.ref + ' for ' + M.money(o.refund.amount) + ' is ' + (({ requested: 'received and waiting for review', review: 'under review by our finance team', approved: 'approved and about to be sent', processing: 'being processed by the bank' } as AnyObj)[o.refund.status] || o.refund.status) + '. Refunds reach you 3–7 working days after approval.', 'trackRefund') }] : []),
        ...(o.hold === 'discrepancy' ? [{ l: 'Refund the difference', tap: () => this.chatRefund(o, true) }] : []),
        { l: 'Where is my order?', tap: () => this.chatSay(o, 'Where is my order?', o.id + ' is at: ' + this.view(o).headline + '. ' + this.view(o).next) },
        { l: 'Talk to a person', tap: () => this.sendChat(o, 'I would like to talk to a person about ' + o.id + '.') }
      ].map((q?: any) => Object.assign({ bg: '#fff', fg: '#121214', border: '#E4E2DB' }, q)),
      sendMsg: () => { const t = s.msg.trim(); if (!t) return; this.sendChat(o, t); if (/refund|money back|reimburs/i.test(t)) this.chatRefund(o, false, t, false); },
      chatRef: o.id + ' · ' + M.titleOf(o)
    });
  }
  prefillForms(o?: any): any {
    const s = this.state, u = s.user || EMPTY_USER, f = o.form || ({} as AnyObj);
    if (!s.pf.billName) this.setState((x?: any) => ({ pf: Object.assign({}, x.pf, { billName: u.business === 'Individual' ? u.name : u.business, billAddr: o.addr ? o.addr.street + ', ' + o.addr.city : '', address: f.address || '', contact: u.name, mobile: u.phone || '' }) }));
  }
  submitSell(): any {
    const s = this.state, d = s.draft, e: AnyObj = {};
    if (s.placing) return;
    if (!d.mineral) e.mineral = 'Choose a mineral';
    if (s.uploads.sellPhotos.length < 3) e.photos = 'Add at least 3 photos (' + s.uploads.sellPhotos.length + ' added)';
    if (!(parseFloat(d.qty) > 0)) e.qty = 'Enter the quantity';
    if (!d.grade.trim()) e.grade = 'Enter the quality or grade';
    if (d.details.trim().length < 10) e.details = 'Describe the mineral in a sentence or two';
    if (Object.keys(e).length) return this.err('draftErr', e);
    if (!this.gate('sellForm')) { this.setState({ hasDraft: true }); return; }
    void this.task(this.remote.submitSell());
  }
  sellVals(): any {
    const s = this.state, M = X(), d = s.draft, de = s.draftErr || ({} as AnyObj), setD = (p?: any) => this.setState((x?: any) => ({ draft: Object.assign({}, x.draft, p), draftErr: {} }));
    const q = s.search.trim().toLowerCase();
    const chips = (list?: any, val?: any, set?: any) => list.map((v?: any) => ({ label: v, bg: val === v ? '#121214' : '#fff', fg: val === v ? '#F4F2ED' : '#121214', border: val === v ? '#121214' : '#E4E2DB', tap: () => set(v) }));
    const DOCS = ['Test / assay report', 'Certificate of origin', 'Mining licence or permit'];
    const so = s.orders.find((o?: any) => o.id === s.oid);
    return {
      buyerOnly: !!s.user && s.user.role === 'buyer',
      sellGroups: M.CATS.map((c?: any) => ({ name: c.name, items: c.minerals.filter(([, n]: any) => !q || n.toLowerCase().includes(q)).map(([id, n]: any) => ({ n, tap: () => { setD({ mineral: id }); this.go('sellForm'); } })) })).filter((g?: any) => g.items.length),
      sellNone: !!q && !M.CATS.some((c?: any) => c.minerals.some(([, n]: any) => n.toLowerCase().includes(q))),
      hasDraft: s.hasDraft && !!d.mineral, draftLine: M.mineralName(d.mineral || 'gold') + ' · ' + d.photos + (d.photos === 1 ? ' photo' : ' photos') + (d.qty ? ' · ' + d.qty + ' ' + d.unit : ''),
      resumeDraft: () => this.go('sellForm'), discardDraft: () => this.setState({ sheet: 'discardDraft' }),
      dMineral: M.mineralName(d.mineral || 'gold'), dCat: (M.catOf(d.mineral || 'gold') || ({} as AnyObj)).name,
      // BUG-011: empty slots stay blank (no catalogue placeholder); only real upload URIs preview.
      dPhotos: Array.from({ length: Math.max(3, s.uploads.sellPhotos.length) }, (_?: any, i?: any) => { const up = s.uploads.sellPhotos[i]; return { has: !!up, empty: !up, img: up && up.uri ? "url('" + up.uri + "')" : 'none' }; }),
      dPhotoCount: d.photos + ' of 3 minimum', addPhoto: () => { this.remote.pickFiles('sellPhotos', 'sell_photo', { limit: 10, max: 10 }); this.setState({ draftErr: {} }); }, removePhoto: () => this.remote.removeUpload('sellPhotos', s.uploads.sellPhotos.length - 1),
            dPhotoErr: de.photos || '', dPhotoBorder: de.photos ? '#B42318' : '#D5D3CC',
      dQty: d.qty, setDQty: (e?: any) => setD({ qty: e.target.value.replace(/[^\d.]/g, '') }), dQtyErr: de.qty || '', dQtyBorder: de.qty ? '#B42318' : '#E4E2DB',
      dUnits: chips(['g', 'kg', 't', 'ct'], d.unit, (v?: any) => setD({ unit: v })),
      dGrade: d.grade, setDGrade: (e?: any) => setD({ grade: e.target.value }), dGradeErr: de.grade || '', dGradeBorder: de.grade ? '#B42318' : '#E4E2DB',
      dForms: chips(['Raw', 'Semi-finished', 'Finished'], d.form, (v?: any) => setD({ form: v })),
      dDetails: d.details, setDDetails: (e?: any) => setD({ details: e.target.value }), dDetailsErr: de.details || '', dDetailsBorder: de.details ? '#B42318' : '#E4E2DB',
      dDocs: DOCS.map((n?: any) => { const on = s.uploads.sellDocs.some((x?: any) => x.label === n); return { n, on, off: !on, bg: on ? '#E2F2E9' : '#fff', border: on ? '#B7DFC8' : '#D5D3CC', tap: () => { if (s.uploading) return; if (on) this.remote.removeUpload('sellDocs', n); else this.remote.pickFiles('sellDocs', 'sell_document', { label: n, limit: 1 }); } }; }),
            sellRef: so ? so.id : '', sellSummary: so && so.kind === 'sell' ? so.sell.qty + ' ' + so.sell.unit + ' of ' + so.sell.name + ' · ' + so.sell.photos + ' photos' : '',
      sellNext: [['Review and price', 'Our operations team checks your request and contacts you to agree a price.'], ['E-contract', 'Both sides accept the price, then sign the e-contract.'], ['Inspection and payment', 'Mineral Bridge inspects the product at your site, SGS tests it, then payment is released before pickup.']].map(([t, b]: any, i?: any) => ({ n: String(i + 1), t, b }))
    };
  }
  saveProfile(): any {
    const s = this.state, f = s.edit || ({} as AnyObj), e: AnyObj = {};
    if ((f.name || '').trim().length < 2) e.name = 'Enter your full name';
    if ((f.business || '').trim().length < 2 && this.bizDocNeeded()) e.business = 'Enter your business name';
    if (f.country && f.country.trim() && !resolveCountryCode(f.country)) e.country = 'Enter a full country name';
    // Phone and email are not part of PATCH /me: they change only through startContactChange (OTP-verified).
    if (Object.keys(e).length) return this.err('editErr', e);
    void this.task(this.remote.saveProfile(f));
  }
  /** Start a phone/email change: validates the new value, then asks the server to send a code to it. */
  startContactChange(field: 'phone' | 'email', channel: OtpChannel, raw: string): any {
    const s = this.state, u = s.user;
    if (s.contactBusy) return;
    const v = String(raw || '').trim();
    if (field === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return this.err('editErr', { email: 'Enter a valid email address' });
      if (u && v.toLowerCase() === (u.email || '').toLowerCase()) return this.err('editErr', { email: 'That is already your email' });
    } else {
      const id = contactIdentifier(channel, v, s.auth.cc);
      const n = id.replace(/\D/g, '').length;
      if (n < 9 || n > 15) return this.err('editErr', { phone: 'Enter a valid number (9–15 digits, with the country code if it is not ' + (s.auth.cc || '+234') + ')' });
      if (u && id === u.phone) return this.err('editErr', { phone: 'That is already your number' });
    }
    this.setState({ editErr: {} });
    void this.task(this.remote.startContactChange(channel, contactIdentifier(channel, v, s.auth.cc)));
  }
  /** Open one support conversation (`ref === ''` starts a new one). */
  openSupport(ref: string): any { this.go('supportThread', { supRef: ref, supThread: null, supMsg: '', supErr: '' }); }
  sendSupport(): any {
    const s = this.state, t = String(s.supMsg || '').trim();
    if (s.supBusy || !t) return;
    void this.task(s.supRef ? this.remote.sendSupportMessage(s.supRef, t) : this.remote.createSupportThread(t));
  }
  contactVals(): any {
    const s = this.state, ch = s.contact, code = String(s.contactCode || '');
    const WHERE: AnyObj = { whatsapp: 'WhatsApp', sms: 'SMS', email: 'email' };
    const wait = ch ? Math.max(0, Math.ceil((ch.resendAt - Date.now()) / 1000)) : 0;
    const off = !!s.contactBusy || wait > 0;
    return {
      contactBusy: !!s.contactBusy, editCc: s.auth.cc || '+234',
      clearEditErr: () => { if (Object.keys(this.state.editErr || {}).length) this.setState({ editErr: {} }); },
      startContactChange: (field: 'phone' | 'email', channel: OtpChannel, raw: string) => this.startContactChange(field, channel, raw),
      ct: ch ? {
        active: true, via: WHERE[ch.channel] || ch.channel, noun: ch.field === 'email' ? 'email' : 'number', to: ch.masked || ch.identifier,
        code, boxes: [0, 1, 2, 3].map(i => ({ v: code[i] || '', border: code.length === i ? '#121214' : '#E4E2DB' })),
        setCode: (e?: any) => this.setState({ contactCode: String(e.target.value).replace(/\D/g, '').slice(0, 4), contactErr: '' }),
        err: s.contactErr, devOtp: IS_DEV ? ch.devOtp : '',
        resendOff: off, resendFg: wait > 0 || s.contactBusy ? '#8B8A90' : '#8A6A1C', resendLabel: wait > 0 ? 'Resend code in ' + wait + 's' : 'Resend code',
        resend: () => { if (off) return; void this.task(this.remote.resendContactChange()); }
      } : { active: false }
    };
  }
  supportVals(): any {
    const s = this.state, M = X(), list = s.supThreads as any[] | null;
    const isNew = !s.supRef, th = s.supThread && s.supThread.ref === s.supRef ? s.supThread : null;
    const tone = th ? statusTone(th.status) : null;
    const msgs = th ? th.messages : [];
    return {
      sup: {
        loaded: !!list, loading: !!s.supLoading, err: s.supErr,
        refresh: () => { void this.task(this.remote.loadSupportThreads()); },
        threads: (list || []).map((t?: any) => {
          const sub = t.subject && t.subject !== t.topic ? t.subject : '', [pill, pillBg, pillFg] = statusTone(t.status);
          return { ref: t.ref, title: sub || topicLabel(t.topic), sub: t.ref + ' · ' + topicLabel(t.topic) + ' · ' + M.fmt(Date.parse(t.updatedAt) || Date.now()), pill, pillBg, pillFg, tap: () => this.openSupport(t.ref) };
        })
      },
      th: {
        isNew, head: isNew ? 'New conversation with Mineral Bridge support' : s.supRef + ' · ' + topicLabel(th ? th.topic : 'general'),
        pill: tone ? tone[0] : '', pillBg: tone ? tone[1] : '', pillFg: tone ? tone[2] : '',
        loading: !isNew && !th && !!s.supThreadLoading, resolved: !!th && th.status === 'resolved', err: s.supErr,
        msgs: msgs.map((m?: any) => ({ id: m.id, me: m.me, system: m.system, who: m.who, text: m.text, at: M.fmt(m.at) })),
        msg: s.supMsg, busy: !!s.supBusy, sendOpacity: s.supBusy || !String(s.supMsg || '').trim() ? 0.55 : 1,
        setMsg: (e?: any) => this.setState({ supMsg: String(e.target.value).slice(0, 4000), supErr: '' }),
        send: () => this.sendSupport()
      }
    };
  }
  saveBizType(): any {
    const r = this.state.reg;
    if (!r.role) return this.setState({ regErr: 'Choose buyer, seller or both' });
    if (r.role !== 'seller' && !r.buyerType) return this.setState({ regErr: 'Choose your buyer type' });
    if (r.role !== 'buyer' && !r.sellerType) return this.setState({ regErr: 'Choose your seller type' });
    void this.task(this.remote.saveBizType());
  }
  accountVals(): any {
    const s = this.state, M = X(), u = s.user, go = (x?: any, e?: any) => () => this.go(x, e);
    const bt = u && u.buyerType ? (M.BUYER_TYPES.find((b?: any) => b[0] === u.buyerType) || [])[1] : '', stp = u && u.sellerType ? (M.SELLER_TYPES.find((b?: any) => b[0] === u.sellerType) || [])[1] : '';
    const kycTone = !u ? ['', ''] : u.kyc === 'verified' ? ['#E2F2E9', '#17704C'] : u.kyc === 'pending' ? ['#FBF3E4', '#A1620B'] : ['#FDECEA', '#B42318'];
    const kycWord = !u ? '' : ({ verified: 'KYC verified', pending: 'KYC under review', rejected: 'KYC needs action', none: 'KYC not started' } as AnyObj)[u.kyc];
    const ed = s.edit || ({} as AnyObj), ee = s.editErr || ({} as AnyObj), setE = (p?: any) => this.setState((x?: any) => ({ edit: Object.assign({}, x.edit, p), editErr: {} }));
    return {
      pName: u ? u.name : 'Guest', pBiz: u ? u.business : 'Browsing as guest', pIni: u ? u.name.split(' ').map((w?: any) => w[0]).slice(0, 2).join('') : 'G',
      pTags: [bt ? 'Buyer · ' + bt : '', stp ? 'Seller · ' + stp : ''].filter(Boolean).map((t?: any) => ({ t })),
      pContact: u ? [u.phone, u.email].filter(Boolean).join(' · ') : '', kycWord, kycBg: kycTone[0], kycFg: kycTone[1], signedIn: !!u, guest: !u,
      menu: u ? [['ACCOUNT', [['Edit profile', 'Name, business, contact', 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z', () => { this.setState({ edit: { name: u.name, business: u.business, email: u.email || '', phone: u.phone || '', country: u.country || '' }, editErr: {} }); this.go('editProfile'); }], ['Buyer / seller type', [bt, stp].filter(Boolean).join(' + '), 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9', () => { this.setState({ reg: Object.assign({}, s.reg, { role: u.role, buyerType: u.buyerType || '', sellerType: u.sellerType || '' }), regErr: '' }); this.go('bizType'); }], ['KYC & documents', kycWord, 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', go('kycStatus')]]],
        ['ACTIVITY', [['Auctions', (s.auctions || []).filter((a?: any) => a.status === 'live').length + ' live · ' + (s.auctions || []).filter((a?: any) => (a.mine || a.bids.some((b?: any) => b.who === 'You')) && a.status !== 'ended').length + ' with your bids', 'M14 3.5 20.5 10 17 13.5 10.5 7zM10.5 7 4 13.5 7.5 17 14 10.5M3 21h9', () => this.go('auctions', { atab: 'live' })], ['Refunds', (() => { const n = s.orders.filter((x?: any) => x.refund && !['refunded', 'declined'].includes(x.refund.status)).length; return n ? n + ' in progress' : 'Request and track refunds'; })(), 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5', () => this.go('refunds')], ['Orders & sell requests', s.orders.length + ' in your history', 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 12h6M9 16h4', () => this.jump('orders')], ['Notifications', (s.unread || s.notifs.filter((n?: any) => !n.read).length) + ' unread', 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0', go('notifs')], ['Notification channels', ['email', 'sms', 'whatsapp', 'push'].filter((k?: any) => s.prefs[k]).length + ' of 4 on', 'M4 4h16v12H5.2L4 17.2z', go('prefs')]]],
        ['HELP', [['Help & support', 'Phone, SMS, email, WhatsApp, chat', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01', go('help')]]]].map(([h, rows]: any) => ({ h, rows: rows.map(([l, sub, icon, tap]: any, i?: any) => ({ l, sub, icon, tap, line: i === rows.length - 1 ? 'transparent' : '#EFEDE7' })) })) : [],
      logout: () => this.setState({ sheet: 'logout' }),
      editFields: [['name', 'FULL NAME'], ['business', 'BUSINESS NAME'], ['phone', 'MOBILE'], ['email', 'EMAIL'], ['country', 'COUNTRY']].map(([k, l]: any) => ({ k, l, contact: k === 'phone' || k === 'email', v: ed[k] || '', err: ee[k] || '', border: ee[k] ? '#B42318' : '#E4E2DB', set: (e?: any) => setE({ [k]: e.target.value }) })),
      showTypePicker: s.screen === 'regType' || s.screen === 'bizType', typeTitle: s.screen === 'bizType' ? 'Update your account type' : 'How will you use Mineral Bridge?',
      kycStatusWord: kycWord, kycIsPending: !!u && u.kyc === 'pending', kycIsRejected: !!u && u.kyc === 'rejected', kycIsVerified: !!u && u.kyc === 'verified', kycIsNone: !!u && u.kyc === 'none',
      kycReason: u ? u.kycReason || '' : '', kycSubmitted: u && u.kycAt ? M.fmt(u.kycAt) : '—', kycStatusRef: u ? u.kycRef || '—' : '',
      kycList: this.kycListVals(),
      notifs: s.notifs.map((n?: any) => ({ title: n.title, note: n.note, via: 'Sent by ' + (['email', 'sms', 'whatsapp', 'push'].filter((k?: any) => s.prefs[k]).map((k?: any) => ({ email: 'Email', sms: 'SMS', whatsapp: 'WhatsApp', push: 'app' } as AnyObj)[k]).join(' · ') || 'app'), at: M.fmt(n.at), dot: n.read ? 'transparent' : '#D9B456', tap: () => { void this.task(this.remote.readNotif(n)); if (n.oid) this.go('order', { oid: n.oid }); else if (n.to) this.go(n.to); } })),
      noNotifs: !s.notifs.length, readAll: () => { void this.task(this.remote.readAll()); },
            prefRows: [['email', 'Email', (u || ({} as AnyObj)).email || 'Add an email in Edit profile'], ['sms', 'SMS', (u || ({} as AnyObj)).phone || 'Add a mobile number'], ['whatsapp', 'WhatsApp', (u || ({} as AnyObj)).phone || 'Add a mobile number'], ['push', 'App notifications', 'On this device']].map(([k, l, sub]: any) => ({ l, sub, bg: s.prefs[k] ? '#121214' : '#D5D3CC', x: s.prefs[k] ? '20px' : '2px', tap: () => { const on = ['email', 'sms', 'whatsapp', 'push'].filter((q?: any) => s.prefs[q]); if (s.prefs[k] && on.length <= 1) return this.flash('Keep at least one channel on'); void this.task(this.remote.togglePref(k)); } })),
            helpChannels: ((ct?: any) => [['Phone', ct ? ct.phone : 'Loading…', ct ? 'tel:' + ct.phone : '', 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z'], ['SMS', ct ? ct.phone : 'Loading…', ct ? 'sms:' + ct.phone : '', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'], ['Email', ct ? ct.email : 'Loading…', ct ? 'mailto:' + ct.email : '', 'M4 4h16v16H4zM22 6l-10 7L2 6'], ['WhatsApp', ct ? ct.whatsapp : 'Loading…', ct && ct.whatsapp ? 'https://wa.me/' + String(ct.whatsapp).replace(/\D/g, '') : '', 'M3 21l1.6-5A9 9 0 1 1 8 19.4z']].map(([l, v, href, icon]: any) => ({ l, v, icon, tap: () => { if (!href) { this.flash('Contact details are loading. Try again in a moment.'); void this.task(this.remote.loadFaqs()); return; } window.open(href, l === 'WhatsApp' ? '_blank' : '_self'); } })))(s.contacts),
            goSupportChat: () => { if (!s.user) return this.flash('Sign in to message Mineral Bridge support. You can also use phone, email or WhatsApp.'); this.go('support'); }, goKycFix: () => this.go('kyc'),
      faqs: (s.faqs || []).map(({ q: qq, a }: any, i?: any) => ({ qq, a, open: s.faq === i, sign: s.faq === i ? '−' : '+', tap: () => this.setState({ faq: s.faq === i ? -1 : i }) }))
    };
  }
  readKycFile(file?: any): any {
    const s = this.state, id = s.kycDocId, size = fmtBytes(file.size);
    if (s.kycUploading) return;
    if (file.size > 10 * 1048576) return this.setState({ kycDocErr: 'File is larger than 10 MB. Choose a smaller file.' });
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdf && !/^image\//.test(file.type)) return this.setState({ kycDocErr: 'Use a JPG, PNG or PDF file.' });
    if (isPdf && id === 'selfie') return this.setState({ kycDocErr: 'A selfie must be a photo.' });
    const old = s.kyc[id]; if (old && old.src && old.src.startsWith('blob:')) URL.revokeObjectURL(old.src);
    if (isPdf) return void this.task(this.remote.uploadKycDoc(id, file, { kind: 'pdf', src: '', name: file.name, size, at: Date.now() }));
    void this.task(compressImage(file, 1600, 0.82).then((body?: any) => this.remote.uploadKycDoc(id, body, { kind: 'img', src: URL.createObjectURL(body), name: file.name || id + '.jpg', size: fmtBytes(body.size), at: Date.now() })));
  }
  nextKycDoc(): any {
    const s = this.state, k = s.kyc, ids = kycRequiredDocIds(s.kycReq, k.idType, this.bizDocNeeded());
    const nxt = ids.find((id?: any) => !k[id] && id !== s.kycDocId);
    if (nxt) { this.setState({ kycDocId: nxt, kycDocErr: '' }); this.top(); } else this.back();
  }
  isBusiness(r?: any): any {
    const NON: AnyObj = { investor: 1, asm: 1, scrap: 1 };
    const types = [r.role !== 'seller' ? r.buyerType : '', r.role !== 'buyer' ? r.sellerType : ''].filter(Boolean);
    return types.some((t?: any) => !NON[t]);
  }
  aucOf(id?: any): any { return (this.state.auctions || []).find((a?: any) => a.id === (id || this.state.aid)); }
  aucCur(a?: any): any { return a.bids.length ? a.bids[a.bids.length - 1].amt : a.start; }
  aucInc(a?: any): any { return a.inc && a.inc > 0 ? a.inc : 500; }
  aucMin(a?: any): any { if (a.minNext && a.minNext > 0) return a.minNext; return a.bids.length ? this.aucCur(a) + this.aucInc(a) : a.start; }
  patchAuc(id?: any, fn?: any): any { this.setState((x?: any) => ({ auctions: x.auctions.map((a?: any) => a.id === id ? fn(JSON.parse(JSON.stringify(a))) : a) })); }
  left(ms?: any): any { if (ms <= 0) return '00:00:00'; const h = Math.floor(ms / 36e5), mi = Math.floor(ms % 36e5 / 6e4), se = Math.floor(ms % 6e4 / 1e3), p = (n?: any) => String(n).padStart(2, '0'); return h >= 24 ? Math.floor(h / 24) + 'd ' + p(h % 24) + 'h' : p(h) + ':' + p(mi) + ':' + p(se); }
  aucCta(): any {
    const a = this.aucOf(); if (!a) return {};
    const M = X();
    if (a.status === 'live') return { cta: 'Place bid · ' + M.money(parseFloat(this.state.bidAmt) || this.aucMin(a)) };
    if (a.status === 'upcoming') return { cta: this.state.reminders[a.id] ? 'Reminder on · tap to cancel' : 'Remind me when it opens' };
    if (a.result === 'won') return { cta: this.aucUnpaid(a) ? 'Pay now · ' + M.money(this.aucCur(a)) : 'Track order ' + (a.orderId || '') };
    return { cta: 'Browse similar lots' };
  }
  openAuction(id?: any): any {
    const a = this.aucOf(id);
    // BUG-017: restore server auto-bid ceiling instead of always clearing the toggle.
    const max = a && a.autoMax > 0 ? String(a.autoMax) : '';
    this.go('auction', { aid: id, bidAmt: a ? String(this.aucMin(a)) : '', bidErr: '', autoOn: !!max, autoMax: max });
  }
  auctionPrimary(): any {
    const s = this.state, a = this.aucOf(), M = X(); if (!a) return;
    if (a.status === 'upcoming') { if (!this.gate('auction')) return; void this.task(this.remote.toggleReminder(a, !s.reminders[a.id])); return; }
    if (a.status === 'ended') {
      if (a.result === 'won') return this.aucUnpaid(a) ? this.auctionToOrder(a.id, true) : this.go('order', { oid: a.orderId });
      const p = (a.pid && M.product(a.pid)) || ({} as AnyObj);
      return this.jump('lots', { mineral: p.mineral || 'gold', fform: 'All', labOnly: false, search: '' });
    }
    if (!this.gate('auction')) return;
    const amt = Math.round(parseFloat(String(s.bidAmt).replace(/[^\d.]/g, ''))), min = this.aucMin(a), inc = this.aucInc(a);
    if (!(amt > 0)) return this.setState({ bidErr: 'Enter your bid amount' });
    if (amt < min) return this.setState({ bidErr: 'Minimum bid is ' + M.money(min) });
    if (amt % inc) return this.setState({ bidErr: 'Bids go up in steps of ' + M.money(inc) });
    let max = 0;
    if (s.autoOn) { max = Math.round(parseFloat(String(s.autoMax).replace(/[^\d.]/g, ''))); if (!(max >= amt)) { max = 0; this.setState({ autoOn: false, autoMax: '' }); setTimeout(() => this.flash('Bid placed · auto-bid turned off because its limit was below this bid'), 0); } }
    void this.task(this.remote.placeBid(a, amt, max));
  }
  /** DEVELOPMENT ONLY: a fake competing bid for UI testing. Never sent to the server. */
  simOutbid(): any {
    if (!DEV_TOOLS) return;
    const a = this.aucOf(); if (!a || a.status !== 'live') return;
    const other = this.aucCur(a) + this.aucInc(a) * (1 + Math.floor(Math.random() * 3));
    this.patchAuc(a.id, (c?: any) => {
      c.bids.push({ who: 'Bidder ' + (1000 + Math.floor(Math.random() * 9000)), amt: other, at: Date.now() });
      if (c.mine) { c.outbid = true; c.leading = false; }
      return c;
    });
    this.setState({ bidAmt: String(this.aucMin(this.aucOf(a.id))) });
  }
  /** DEVELOPMENT ONLY: end the auction locally. The server decides real outcomes. */
  endAuction(id?: any, silent?: any): any {
    if (!DEV_TOOLS) return;
    const a = this.aucOf(id); if (!a || a.status !== 'live') return;
    const last = a.bids[a.bids.length - 1], won = !!last && last.who === 'You', mine = a.bids.some((b?: any) => b.who === 'You');
    this.patchAuc(a.id, (c?: any) => { c.status = 'ended'; c.endsAt = Math.min(c.endsAt, Date.now()); c.result = won ? 'won' : mine ? 'lost' : 'closed'; c.outbid = false; return c; });
    if (won) { if (this.state.screen === 'auction' && this.state.aid === id) this.go('auctionWon'); } else if (!silent || mine) this.flash(mine ? 'Auction ended · another bidder won' : 'Auction ended');
  }
  aucUnpaid(a?: any): any { if (!a || a.result !== 'won') return false; const o = a.orderId && this.state.orders.find((x?: any) => x.id === a.orderId); if (!o) return true; return o.idx < X().stages('buy').findIndex((x?: any) => x.key === 'paid') && !o.rejected; }
  aucWonCta(): any { const a = this.aucOf(); return a && this.aucUnpaid(a) ? 'Pay now · ' + X().money(this.aucCur(a)) : 'Track order'; }
  auctionToOrder(id?: any, toPay?: any): any {
    const a = this.aucOf(id); if (!a || a.result !== 'won') return;
    if (a.orderId) { if (toPay && this.aucUnpaid(a)) { this.setState({ stack: ['orders', 'order'], screen: 'pay', oid: a.orderId, payErr: '' }); this.top(); return; } return this.go('order', { oid: a.orderId }); }
    void this.task(this.remote.auctionToOrder(a, toPay));
  }
  auctionVals(): any {
    const s = this.state, M = X(), now = Date.now(), A = s.auctions || [];
    const prod = (a?: any) => (a.pid && M.product(a.pid)) || ({} as AnyObj);
    const nameOf = (a?: any) => a.name || prod(a).name || a.id, unitOf = (a?: any) => a.unit || prod(a).unit || '', imgOf = (a?: any) => IMG(a.imageUrl || prod(a).img || 'cat-precious');
    const qtyOf = (a?: any) => (a.qty ? a.qty + ' ' + unitOf(a) : '');
    const mineOf = (a?: any) => !!a.mine || a.bids.some((b?: any) => b.who === 'You');
    const leadOf = (a?: any) => a.leading !== undefined ? !!a.leading : !!(a.bids.length && a.bids[a.bids.length - 1].who === 'You');
    const card = (a?: any) => { const live = a.status === 'live', up = a.status === 'upcoming', mine = mineOf(a), lead = leadOf(a);
      return { id: a.id, name: nameOf(a), qty: qtyOf(a), img: imgOf(a), live, pill: live ? 'LIVE' : up ? 'UPCOMING' : 'ENDED', pillBg: live ? '#C2412D' : up ? '#D9B456' : '#121214', pillFg: live || !up ? '#fff' : '#121214',
        priceLabel: live ? 'Current bid' : up ? 'Starting bid' : 'Sold for', price: M.money(up ? a.start : this.aucCur(a)),
        timeLabel: live ? 'Ends in' : up ? 'Opens in' : 'Ended', time: live ? this.left(a.endsAt - now) : up ? this.left((a.startsAt || now) - now) : M.fmt(a.endsAt), timeFg: live && a.endsAt - now < 36e5 ? '#C2412D' : '#121214',
        myTag: a.result === 'won' ? 'You won' : a.result === 'lost' ? 'Outbid · ended' : live && mine ? (lead ? 'You are leading' : 'You are outbid') : up && s.reminders[a.id] ? 'Reminder on' : '',
        myBg: a.result === 'won' || (live && lead) ? '#E2F2E9' : (live && mine) || a.result === 'lost' ? '#FDECEA' : '#F1EFE9', myFg: a.result === 'won' || (live && lead) ? '#17704C' : (live && mine) || a.result === 'lost' ? '#B42318' : '#3A3940',
        tap: () => this.openAuction(a.id) }; };
    const TABS: any[] = [['live', 'Live', (a?: any) => a.status === 'live'], ['upcoming', 'Upcoming', (a?: any) => a.status === 'upcoming'], ['ended', 'Ended', (a?: any) => a.status === 'ended'], ['mine', 'My bids', (a?: any) => mineOf(a) || s.reminders[a.id]]];
    const tab = TABS.find((t?: any) => t[0] === s.atab) || TABS[0], list = A.filter(tab[2]);
    const a = this.aucOf(), p = a ? prod(a) : ({} as AnyObj), inc = a ? this.aucInc(a) : 500;
    const au = !a ? {} : (() => { const live = a.status === 'live', up = a.status === 'upcoming', lead = leadOf(a), mine = mineOf(a), c = card(a);
      return Object.assign(c, { form: p.form || '', live, upcoming: up, canBid: live, leading: live && lead, outbid: live && !!a.outbid && !lead, won: a.result === 'won', lost: a.status === 'ended' && a.result !== 'won',
        lostNote: mine ? 'Another bidder placed a higher bid. Turn on reminders for upcoming lots so you do not miss the next one.' : 'Bidding has closed for this lot.',
        bidCount: (a.count != null ? a.count : a.bids.length) + ((a.count != null ? a.count : a.bids.length) === 1 ? ' bid' : ' bids') + ' · step ' + M.money(inc), timeSub: live ? 'until bidding closes' : up ? 'until bidding opens' : 'bidding closed',
        min: M.money(this.aucMin(a)), opens: up && a.startsAt ? M.fmt(a.startsAt) : '', startBid: M.money(a.start), autoNote: a.autoMax ? ' · auto-bid up to ' + M.money(a.autoMax) : '',
        rows: [['Lot', p.id || a.id], ['Quantity', qtyOf(a) || '—'], ['Purity', a.grade || (p.lab ? p.grade : 'Report on request')], ['Testing company', p.lab || '—'], ['Origin', p.origin || '—']].map(([k, v]: any, i?: any, arr?: any) => ({ k, v, line: i === arr.length - 1 ? 'transparent' : '#EFEDE7' })),
        hasBids: a.bids.length > 0, bids: [...a.bids].reverse().map((b?: any, i?: any, arr?: any) => ({ who: b.who === 'You' ? (b.auto ? 'You (auto-bid)' : 'You') : b.who, ini: b.who === 'You' ? 'YOU' : 'B' + b.who.slice(-2), amt: M.money(b.amt), at: M.fmt(b.at), bg: b.who === 'You' ? '#121214' : i === 0 ? '#FBF3E4' : '#F1EFE9', fg: b.who === 'You' ? '#D9B456' : '#3A3940', line: i === arr.length - 1 ? 'transparent' : '#EFEDE7' })) }); })();
    const amt = () => Math.round(parseFloat(String(s.bidAmt).replace(/[^\d.]/g, ''))) || (a ? this.aucMin(a) : 0);
    const won = A.find((x?: any) => x.id === s.aid && x.result === 'won');
    return {
      aucTabs: TABS.map(([id, label, f]: any) => { const n = A.filter(f).length; return { label, n: n ? String(n) : '', bg: s.atab === id ? '#121214' : 'transparent', fg: s.atab === id ? '#F4F2ED' : '#6B6A70', tap: () => this.setState({ atab: id }) }; }),
      aucList: list.map(card), aucEmpty: !list.length, aucEmptyText: s.auctionsLoading && !A.length ? 'Loading auctions…' : s.atab === 'mine' ? 'You have not bid on any auction yet' : 'No ' + tab[1].toLowerCase() + ' auctions right now',
      au, bidAmt: s.bidAmt, setBidAmt: (e?: any) => this.setState({ bidAmt: e.target.value.replace(/[^\d]/g, ''), bidErr: '' }), bidErr: s.bidErr,
      bidUp: () => this.setState({ bidAmt: String(amt() + inc), bidErr: '' }), bidDown: () => a && this.setState({ bidAmt: String(Math.max(this.aucMin(a), amt() - inc)), bidErr: '' }),
      bidQuick: [1, 2, 5].map((k?: any) => ({ label: '+' + M.money(inc * k), tap: () => a && this.setState({ bidAmt: String(this.aucCur(a) + inc * k), bidErr: '' }) })),
      bidAgain: () => a && this.setState((x?: any) => { const min = this.aucMin(a), mx = parseFloat(x.autoMax) || 0; return { bidAmt: String(min), bidErr: '', autoMax: x.autoOn && mx < min ? String(min + 10 * inc) : x.autoMax }; }),
      autoOn: s.autoOn, autoBg: s.autoOn ? '#121214' : '#D5D3CC', autoX: s.autoOn ? '20px' : '2px',
      // BUG-017: register / clear auto-bid with the server when the toggle changes.
      toggleAuto: () => {
        if (!a) return;
        const next = !s.autoOn;
        const maxStr = s.autoMax || String(amt() + 10 * inc);
        this.setState({ autoOn: next, autoMax: maxStr });
        void this.task(this.remote.syncAutoBid(a, next, Math.round(parseFloat(maxStr) || 0)));
      },
      autoMax: s.autoMax, setAutoMax: (e?: any) => this.setState({ autoMax: e.target.value.replace(/[^\d]/g, ''), bidErr: '' }),
      commitAutoMax: () => { if (!a || !s.autoOn) return; const max = Math.round(parseFloat(String(s.autoMax)) || 0); if (max > 0) void this.task(this.remote.syncAutoBid(a, true, max)); },
      simOutbid: () => this.simOutbid(), simEnd: () => a && this.endAuction(a.id),
      browseSimilar: () => this.jump('lots', { mineral: p.mineral || 'gold', fform: 'All', labOnly: false, search: '' }),
      wonLine: won ? (nameOf(won) + ' · ' + qtyOf(won) + ' · auction ' + won.id) : '', wonPrice: won ? M.money(this.aucCur(won)) : ''
    };
  }
  refundable(o?: any): any {
    if (!o || o.kind !== 'buy' || o.rejected || o.cancelled || o.refunded) return false;
    const st = X().stages('buy'), pi = st.findIndex((x?: any) => x.key === 'paid');
    if (o.idx < pi || !st[o.idx + 1]) return false;
    if (o.refund && !['declined', 'refunded'].includes(o.refund.status)) return false;
    if (o.refund && o.refund.status === 'refunded' && o.refund.type === 'full') return false;
    return !o.hold || o.hold === 'discrepancy';
  }
  /** A client-side helper exchange in the chat (guidance toward the refund form). Never sent to the server. */
  chatSay(o?: any, mine?: any, reply?: any, action?: any, ctx?: any, echo = true): any {
    const now = Date.now();
    this.setState((x?: any) => ({ msg: '', chat: Object.assign({}, x.chat, { [o.id]: [...(x.chat[o.id] || []), ...(echo ? [{ me: true, text: mine, at: now, local: true }] : []), { me: false, text: reply, at: now + 1, action: action || '', ctx: ctx || '', local: true }] }) }));
  }
  chatRefund(o?: any, disc?: any, typed?: any, echo = true): any {
    const M = X(), mine = typed || (disc ? 'I would like a refund for the difference in my delivery.' : 'I would like to request a refund for ' + o.id + '.');
    if (!this.refundable(o)) {
      const st = M.stages('buy'), pi = st.findIndex((x?: any) => x.key === 'paid');
      const inProg = !!o.refund && !['declined', 'refunded'].includes(o.refund.status);
      const why = o.kind !== 'buy' ? 'Sell requests are paid to you, so there is nothing to refund. If a payment to you is wrong, tell us here and we will check it.' : o.idx < pi ? 'Nothing has been paid on ' + o.id + ' yet, so there is nothing to refund. You can decline the quotation or cancel before paying.' : inProg ? 'Refund ' + o.refund.ref + ' is already in progress. I will update you here.' : !st[o.idx + 1] ? o.id + ' is completed, so refunds are closed. If something is wrong, describe it here and our team will review it.' : 'A refund cannot be requested on ' + o.id + ' at this stage. Our team will help you here.';
      return this.chatSay(o, mine, why, inProg ? 'trackRefund' : '', undefined, echo);
    }
    const paid = (o.quote ? o.quote.total : 0) - (o.refundedSoFar || 0);
    this.chatSay(o, mine, 'You can request ' + (disc ? 'a partial refund for the missing or damaged quantity' : 'a full or partial refund of up to ' + M.money(paid)) + ' on ' + o.id + '. Fill in the refund form and we will review it within 2 working days. The order is paused while we review.', 'refund', disc ? 'Delivery discrepancy: ' + ((o.disc || ({} as AnyObj)).note || '') : (typed || ''), echo);
  }
  cancelInfo(o?: any): any {
    if (!o || o.rejected || o.cancelled || this.view(o).done) return { mode: 'none' };
    const srv = this.state.om[o.id] && this.state.om[o.id].cancelInfo;
    if (srv && srv.mode) return { mode: srv.mode };
    const st = X().stages(o.kind), at = (k?: any) => st.findIndex((x?: any) => x.key === k);
    if (o.hold && !['changes', 'quoteDeclined', 'clarify'].includes(o.hold)) return { mode: 'none' };
    if (o.kind === 'sell') return o.idx < at('schedule') ? { mode: 'free' } : { mode: 'none' };
    if (o.auction) return { mode: 'none' };
    if (o.idx < at('paid')) return { mode: 'free' };
    if (o.idx < at('picked') && this.refundable(o)) return { mode: 'refund' };
    return { mode: 'none' };
  }
  cancelMeta(): any {
    const o = this.order(), ci = this.cancelInfo(o), sell = o && o.kind === 'sell';
    return { header: 1, canBack: 1, title: sell ? 'Cancel sell request' : 'Cancel order', cta: ci.mode === 'refund' ? 'Cancel and continue to refund' : sell ? 'Cancel sell request' : 'Cancel order', cta2: sell ? 'Keep sell request' : 'Keep order' };
  }
  openCancel(o?: any): any {
    const ci = this.cancelInfo(o);
    if (ci.mode === 'none') return this.flash('This order can no longer be cancelled. Contact support for help.');
    this.setState({ cx: { reason: '', note: '', agree: false }, cxErr: '' }); this.go('cancel', { oid: o.id });
  }
  submitCancel(): any {
    const s = this.state, o = this.order(), ci = this.cancelInfo(o), c = s.cx || ({} as AnyObj);
    if (!o || ci.mode === 'none') return this.flash('This order can no longer be cancelled');
    if (!c.reason) return this.setState({ cxErr: 'Choose a reason' });
    if (c.reason === 'Other' && (c.note || '').trim().length < 10) return this.setState({ cxErr: 'Tell us why in at least 10 characters' });
    if (!c.agree) return this.setState({ cxErr: 'Tick the box to confirm' });
    const why = c.reason + ((c.note || '').trim() ? ': ' + c.note.trim() : '');
    if (ci.mode === 'refund') {
      const rr = REFUND_REASONS.find((x?: any) => /longer|cancel/i.test(x)) || REFUND_REASONS[REFUND_REASONS.length - 1];
      this.openRefund(o, { reason: rr, note: 'Cancel before dispatch · ' + why, type: 'full' });
      this.setState((x?: any) => ({ stack: x.stack.filter((k?: any) => k !== 'cancel'), cancelRefund: o.id }));
      return this.flash('Your order is cancelled once the full refund is approved');
    }
    void this.task(this.remote.cancelOrder(c.reason, (c.note || '').trim()));
  }
  cancelVals(o?: any): any {
    const s = this.state, c = s.cx || ({} as AnyObj), ci = this.cancelInfo(o), sell = !!o && o.kind === 'sell', M = X();
    const setC = (p?: any) => this.setState((x?: any) => ({ cx: Object.assign({}, x.cx, p), cxErr: '' }));
    const R = sell ? ['Sold elsewhere', 'Price too low', 'Changed my mind', 'Cannot meet inspection dates', 'Other'] : ['Ordered by mistake', 'Found another supplier', 'No longer needed', 'Delivery time too long', 'Other'];
    const paid = o && o.quote ? M.money(o.quote.total - (o.refundedSoFar || 0)) : '';
    const pts = ci.mode === 'refund' ? ['You have paid ' + paid + '. Cancelling needs a full refund, which you request on the next screen.', 'The order is paused while Mineral Bridge reviews the refund, usually within 2 working days.', 'Once the refund is completed the order closes as Cancelled and refunded. Dispatch will not go ahead.']
      : sell ? ['Nothing has been inspected or paid, so there is no charge.', 'Any agreed price and signed e-contract are withdrawn.', 'You can submit a new sell request for this mineral at any time.']
      : ['Nothing has been paid, so there is no charge.', 'Any quotation or e-contract on this order is withdrawn.', 'The reserved quantity goes back to the marketplace.'];
    return {
      cxCan: ci.mode !== 'none' && !!o, cxBtn: ci.mode === 'refund' ? 'Cancel order and get a refund' : sell ? 'Cancel sell request' : 'Cancel order', goCancel: () => this.openCancel(o),
      cxHead: ci.mode === 'refund' ? 'Cancelling after payment' : 'Cancel before ' + (sell ? 'inspection' : 'payment'),
      cxBoxBg: ci.mode === 'refund' ? '#FBF3E4' : '#F1EFE9', cxBoxBorder: ci.mode === 'refund' ? '#EFDDB8' : '#E4E2DB', cxBoxFg: ci.mode === 'refund' ? '#7A4A08' : '#121214',
      cxPoints: pts.map((t?: any) => ({ t })),
      cxReasons: R.map((v?: any) => ({ label: v, bg: c.reason === v ? '#121214' : '#fff', fg: c.reason === v ? '#F4F2ED' : '#121214', border: c.reason === v ? '#121214' : '#E4E2DB', tap: () => setC({ reason: v }) })),
      cxNoteLabel: c.reason === 'Other' ? 'TELL US WHY' : 'NOTE (OPTIONAL)', cxNote: c.note || '', setCxNote: (e?: any) => setC({ note: e.target.value }),
      cxAgree: !!c.agree, cxAgreeBg: c.agree ? '#121214' : '#fff', toggleCxAgree: () => setC({ agree: !c.agree }),
      cxAgreeText: ci.mode === 'refund' ? 'I want to cancel this order and request a full refund.' : sell ? 'I understand this sell request will be closed and cannot be reopened.' : 'I understand this order will be closed and cannot be reopened.',
      cxErr: s.cxErr || ''
    };
  }
  openRefund(o?: any, pre?: any): any {
    if (!o) return;
    if (!this.refundable(o)) { const st = X().stages('buy'), pi = st.findIndex((x?: any) => x.key === 'paid'); return this.flash(o.kind !== 'buy' ? 'Sell requests are paid to you, so they cannot be refunded' : o.idx < pi ? 'Nothing has been paid on ' + o.id + ' yet' : o.refund && !['declined', 'refunded'].includes(o.refund.status) ? 'Refund ' + o.refund.ref + ' is already in progress' : 'A refund cannot be requested on ' + o.id + ' now'); }
    this.setState((x?: any) => ({ oid: o.id, rfErr: '', rf: Object.assign(emptyRefund(), pre || ({} as AnyObj)), rfFieldErr: {}, cancelRefund: '', uploads: { ...x.uploads, refund: [] } }));
    this.go('refund', { oid: o.id });
  }
  submitRefund(): any {
    const s = this.state, o = this.order(), r = s.rf, M = X();
    if (!o || !this.refundable(o)) return this.flash('A refund can’t be requested on this order right now');
    const paid = (o.quote ? o.quote.total : 0) - (o.refundedSoFar || 0);
    if (!r.reason) return this.setState({ rfErr: 'Choose a reason' });
    if (r.note.trim().length < 10) return this.setState({ rfErr: 'Describe what happened in at least 10 characters' });
    if (r.type === 'partial') { const amount = parseFloat(String(r.amount).replace(/[^\d.]/g, '')); if (!(amount > 0)) return this.setState({ rfErr: 'Enter the amount to refund' }); if (paid > 0 && amount >= paid) return this.setState({ rfErr: 'A partial refund must be less than ' + M.money(paid) + '. Choose full refund instead.' }); }
    const fe: AnyObj = {}, v = (k?: any) => String(r[k] || '').trim();
    if (r.dest === 'bank') { if (v('holder').length < 2) fe.holder = 'Enter the account holder name'; if (v('bank').length < 2) fe.bank = 'Enter the bank name'; if (!/^\d{6,18}$/.test(v('account').replace(/\s/g, ''))) fe.account = 'Enter a 6–18 digit account number'; if (v('account2').replace(/\s/g, '') !== v('account').replace(/\s/g, '')) fe.account2 = 'Account numbers do not match'; if (!/^[A-Za-z0-9]{6,11}$/.test(v('code'))) fe.code = 'Enter a valid IFSC (11), SWIFT (8 or 11) or sort code'; if (v('country').length < 2) fe.country = 'Enter the bank country'; }
    if (r.dest === 'upi') { if (!/^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(v('upi'))) fe.upi = 'Enter a valid UPI ID, like name@bank'; if (v('upiName').length < 2) fe.upiName = 'Enter the name on the UPI account'; }
    if (r.dest === 'btc') { if (!/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(v('addr'))) fe.addr = 'Enter a valid Bitcoin address (starts with bc1, 1 or 3)'; if (v('addr2') !== v('addr')) fe.addr2 = 'Addresses do not match'; }
    if (Object.keys(fe).length) return this.setState({ rfFieldErr: fe, rfErr: 'Check the ' + (({ bank: 'bank account', upi: 'UPI', btc: 'wallet', original: '' } as AnyObj)[r.dest]) + ' details' });
    if (!r.agree) return this.setState({ rfErr: 'Tick the confirmation to submit' });
    this.setState({ rfErr: '', rfFieldErr: {} });
    void this.task(this.remote.createRefund(o));
  }
  refundVals(o?: any): any {
    const s = this.state, M = X(), r = s.rf, setR = (p?: any) => this.setState((x?: any) => ({ rf: Object.assign({}, x.rf, p), rfErr: '' }));
    const chips = (list?: any, val?: any, set?: any) => list.map(([v, l]: any) => ({ label: l, bg: val === v ? '#121214' : '#fff', fg: val === v ? '#F4F2ED' : '#121214', border: val === v ? '#121214' : '#E4E2DB', tap: () => set(v) }));
    const tone = (st?: any) => (({ requested: ['#FBF3E4', '#A1620B', 'Requested'], review: ['#FBF3E4', '#A1620B', 'Under review'], approved: ['#E8EEF9', '#2B4C8C', 'Approved'], processing: ['#E8EEF9', '#2B4C8C', 'Processing'], refunded: ['#E2F2E9', '#17704C', 'Refunded'], declined: ['#FDECEA', '#B42318', 'Declined'] } as AnyObj)[st] || ['#F1EFE9', '#3A3940', st]);
    const rfo = o && o.refund, ti = rfo ? RF_STEPS.findIndex((x?: any) => x[0] === rfo.status) : -1;
    const method = o ? ((o.form || ({} as AnyObj)).method || 'Bank transfer') : '';
    const list = s.orders.filter((x?: any) => x.refund).sort((a?: any, b?: any) => b.refund.at - a.refund.at);
    return {
      canRefund: this.refundable(o), canRefundBtn: this.refundable(o) && !(o && o.hold === 'discrepancy'), goRefund: () => this.openRefund(o),
      hasDisc: !!(o && o.hold === 'discrepancy' && o.disc), disc: o && o.disc ? { status: 'Under review', line: o.disc.qty + ' received · condition ' + o.disc.cond.toLowerCase() + ' · ' + o.disc.photos + (o.disc.photos === 1 ? ' photo' : ' photos'), note: o.disc.note } : {},
      discRefund: () => this.openRefund(o, { reason: 'Quantity or quality issue', note: 'Delivery discrepancy: ' + ((o && o.disc) || ({} as AnyObj)).note, type: 'partial' }), demoRefundDecline: () => this.demo('refundDecline'),
      hasRefund: !!rfo, rf: rfo ? { ref: rfo.ref, amount: M.money(rfo.amount), typeLabel: rfo.type === 'full' ? 'Full refund' : 'Partial refund', reason: rfo.reason, to: rfo.to, statusLabel: tone(rfo.status)[2], pillBg: tone(rfo.status)[0], pillFg: tone(rfo.status)[1], declined: rfo.status === 'declined', declineReason: rfo.reason2 || '', showSteps: rfo.status !== 'declined', bankRef: rfo.bankRef || '',
        steps: RF_STEPS.map(([, l]: any, i?: any) => ({ l, bar: i <= ti ? (rfo.status === 'refunded' ? '#17704C' : '#121214') : '#E4E2DB', fg: i <= ti ? '#121214' : '#8B8A90', w: i === ti ? 600 : 400 })) } : {},
      rfPaid: o && o.quote ? M.money(o.quote.total - (o.refundedSoFar || 0)) : '', rfPaidVia: method + (o && o.refundedSoFar ? ' · ' + M.money(o.refundedSoFar) + ' already refunded' : ''),
      rfReasons: chips(REFUND_REASONS.map((x?: any) => [x, x]), r.reason, (v?: any) => setR({ reason: v })),
      rfNote: r.note, setRfNote: (e?: any) => setR({ note: e.target.value }),
      rfTypes: [['full', 'Full refund'], ['partial', 'Partial refund']].map(([v, l]: any) => ({ label: l, bg: r.type === v ? '#121214' : 'transparent', fg: r.type === v ? '#F4F2ED' : '#6B6A70', tap: () => setR({ type: v }) })),
      rfPartial: r.type === 'partial', rfFull: r.type === 'full', rfAmt: r.amount, setRfAmt: (e?: any) => setR({ amount: e.target.value.replace(/[^\d.]/g, '') }),
      rfDest: RF_DEST(method).map(([v, name, sub, icon]: any) => { const on = r.dest === v; return { name, sub, icon, border: on ? '#121214' : '#E4E2DB', shadow: on ? '0 6px 18px rgba(18,18,20,.10)' : 'none', radio: on ? '7px solid #121214' : '1.5px solid #C8C6BF', tap: () => setR({ dest: v }) }; }),
      rfHasFields: (RF_FIELDS[r.dest] || []).length > 0, rfFieldsTitle: ({ bank: 'BANK ACCOUNT DETAILS', upi: 'UPI DETAILS', btc: 'BITCOIN WALLET' } as AnyObj)[r.dest] || '',
      rfFieldsNote: ({ bank: 'The account must be in your name or your business’s name. We verify it before sending the refund.', upi: 'We send a ₹1 test credit to confirm the UPI ID before the refund.', btc: 'The USD amount is fixed. We convert at the rate on the day of payout and send to this address on the Bitcoin network.' } as AnyObj)[r.dest] || '',
      rfAcct: (RF_FIELDS[r.dest] || []).map(([k, l, ph, mode]: any) => { const er = (s.rfFieldErr || ({} as AnyObj))[k] || ''; return { l, ph, mode: mode || 'text', v: r[k] || '', err: er, border: er ? '#B42318' : '#E4E2DB', ff: /account|code|upi|addr/.test(k) ? "'Geist Mono', monospace" : 'inherit', set: (e?: any) => { this.setState((x?: any) => ({ rf: Object.assign({}, x.rf, { [k]: e.target.value }), rfErr: '', rfFieldErr: Object.assign({}, x.rfFieldErr, { [k]: '' }) })); } }; }),
      rfFiles: String(r.files), addRfPhoto: () => { this.remote.pickFiles('refund', 'refund_evidence', { limit: 5, max: 5 }); },
      rfAgreeBg: r.agree ? '#121214' : '#fff', toggleRfAgree: () => setR({ agree: !r.agree }), rfErr: s.rfErr,
      refundList: list.map((x?: any) => { const t = tone(x.refund.status); return { ref: x.refund.ref, oid: x.id, title: M.titleOf(x), amount: M.money(x.refund.amount), reason: x.refund.reason, at: M.fmt(x.refund.at), status: t[2], pillBg: t[0], pillFg: t[1], tap: () => this.go('order', { oid: x.id }) }; }),
      noRefunds: !list.length
    };
  }
  myAucs(): any { const s = this.state; return (s.auctions || []).filter((a?: any) => a.mine || a.bids.some((b?: any) => b.who === 'You') || s.reminders[a.id]).sort((a?: any, b?: any) => (Number(b.result === 'won') - Number(a.result === 'won')) || (Number(b.status === 'live') - Number(a.status === 'live'))); }
  aucOrderCard(a?: any): any {
    const s = this.state, M = X(), p = (a.pid && M.product(a.pid)) || ({} as AnyObj), o = a.orderId && s.orders.find((x?: any) => x.id === a.orderId);
    const lead = a.leading !== undefined ? !!a.leading : !!(a.bids.length && a.bids[a.bids.length - 1].who === 'You');
    const base = { id: a.id, title: a.name || p.name || a.id, qtyLine: a.qty ? a.qty + ' ' + (a.unit || p.unit || '') : '', img: IMG(a.imageUrl || p.img || 'cat-precious'), tap: () => this.openAuction(a.id) };
    if (o) { const v = this.view(o); return Object.assign(base, { id: a.id + ' · ' + o.id, status: v.status, pillBg: v.pillBg, pillFg: v.pillFg, value: M.money(this.aucCur(a)), pct: v.pct, next: v.next, tap: () => this.go('order', { oid: o.id }) }); }
    if (a.result === 'won') return Object.assign(base, { status: 'Won · pay now', pillBg: '#E2F2E9', pillFg: '#17704C', value: 'Winning bid ' + M.money(this.aucCur(a)), pct: '20%', next: 'Pay the winning bid to release the lot for dispatch.', tap: () => this.go('auctionWon', { aid: a.id }) });
    if (a.status === 'live') return Object.assign(base, { status: lead ? 'Leading' : 'Outbid', pillBg: lead ? '#E2F2E9' : '#FDECEA', pillFg: lead ? '#17704C' : '#B42318', value: 'Current ' + M.money(this.aucCur(a)), pct: '10%', next: (lead ? 'You are the highest bidder' : 'Another bidder is ahead. Bid again') + ' · ends in ' + this.left(a.endsAt - Date.now()) });
    if (a.status === 'upcoming') return Object.assign(base, { status: 'Reminder on', pillBg: '#FBF3E4', pillFg: '#A1620B', value: 'Starts at ' + M.money(a.start), pct: '0%', next: 'Bidding opens ' + (a.startsAt ? M.fmt(a.startsAt) : 'soon') });
    return Object.assign(base, { status: 'Not won', pillBg: '#F1EFE9', pillFg: '#3A3940', value: 'Sold for ' + M.money(this.aucCur(a)), pct: '100%', next: 'Another bidder won this lot.' });
  }
  openDoc(spec?: any): any { this.go('doc', { doc: spec }); }
  /** Maps a rendered API document (GET /documents/:number) into the screen shape. */
  apiDocData(j: Record<string, unknown>, num: string): any {
    const M = X();
    const val = (v: unknown): string => {
      if (v == null || v === '') return '—';
      if (typeof v === 'object') { const m = v as any; if (m.amountMinor != null || (m.amount != null && m.currency)) return M.money(m.amountMinor != null ? Number(m.amountMinor) / 100 : Number(m.amount)); return JSON.stringify(v); }
      return String(v);
    };
    const rec = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
    const parties = Object.entries(rec(j.parties)).filter(([k, v]) => v != null && v !== '' && k !== 'userId').map(([k, v]) => [k.replace(/([A-Z])/g, ' $1').toUpperCase(), val(v)]);
    const secs: any[] = Array.isArray(j.sections) ? (j.sections as any[]) : [];
    const issued = j.issuedAt ? Date.parse(String(j.issuedAt)) : NaN;
    return {
      title: String(j.title || 'Document'), no: String(j.number || num), date: Number.isFinite(issued) ? M.fmt(issued) : '—', status: String(j.status || '').toUpperCase(),
      issuer: 'MINERAL BRIDGE LTD', signer: 'Mineral Bridge Operations', signerRole: 'AUTHORISED SIGNATORY', note: '', parties,
      sections: secs.map((sec?: any) => ({ h: String(sec.heading || '').toUpperCase(), rows: (sec.rows || []).map((r?: any) => ({ k: String(r.label || ''), v: val(r.value), w: 500, mono: false, ff: 'inherit' })) }))
    };
  }
  docData(spec?: any): any {
    const s = this.state, M = X(), u = s.user || EMPTY_USER, sp = spec || ({} as AnyObj);
    if (sp.num && s.docs[sp.num]) return s.docs[sp.num];
    const o = sp.oid && s.orders.find((x?: any) => x.id === sp.oid), p = sp.pid ? M.product(sp.pid) : null;
    const R = (k?: any, v?: any, strong?: any) => ({ k, v: String(v == null || v === '' ? '—' : v), w: strong ? 700 : 500, mono: !!strong, ff: strong ? "'Geist Mono', monospace" : 'inherit' });
    const items = o && o.kind === 'buy' ? o.items.map((it?: any) => [M.product(it.pid) || ({} as AnyObj), it]) : [];
    const pp = o && o.kind === 'sell' ? [['SELLER', u.name + ' · ' + u.business], ['BUYER', 'Mineral Bridge Ltd']] : [['BUYER', u.name + ' · ' + u.business], ['SELLER', 'Mineral Bridge Ltd']];
    const lines = o ? (o.kind === 'sell' && o.sell ? [R(o.sell.name, o.sell.qty + ' ' + o.sell.unit + (o.sell.grade ? ' · ' + o.sell.grade : ''))] : items.map(([x, it]: any) => R(it.name || x.name || it.pid, (it.uIn && it.uIn !== M.unitOfItem(it) ? it.qIn + ' ' + it.uIn : it.qty + ' ' + M.unitOfItem(it)) + (x.lab ? ' · ' + x.grade : '')))) : [];
    // Only documents built from real order / product fields live here. Everything issued by the platform (quotation, e-contract,
    // receipts, invoices, reports, PODs...) is rendered by the API (sp.num).
    const D: AnyObj = {
      refund: () => { const r = [...(o.history || []), o.refund].find((x?: any) => x && x.ref === sp.ref) || o.refund; return { title: 'Refund receipt', no: r.ref, date: M.fmt(r.at_refunded || r.at), status: String(r.status).toUpperCase(), parties: [['REFUNDED TO', u.name + ' · ' + r.to], ['FROM', 'Mineral Bridge Ltd']], sections: [{ h: 'REFUND', rows: [R('Order', o.id), R('Type', r.type === 'full' ? 'Full refund' : 'Partial refund'), R('Reason', r.reason), R('Bank reference', r.bankRef), R('Amount', M.money(r.amount), true)] }] }; },
      cancel: () => ({ title: 'Cancellation confirmation', no: 'CX-' + o.id.slice(-5), date: M.fmt(o.cancelled.at), status: 'CANCELLED', parties: pp, sections: [{ h: o.kind === 'sell' ? 'SELL REQUEST' : 'ORDER', rows: lines.concat([R('Reference', o.id), R('Cancelled by', u.name), R('Reason', o.cancelled.reason + (o.cancelled.note ? ' · ' + o.cancelled.note : ''))]) }], note: 'Any quotation and e-contract on this ' + (o.kind === 'sell' ? 'sell request' : 'order') + ' are withdrawn.' }),
      lotReport: () => ({ title: 'Test report', no: p.cert, date: '—', status: p.cert ? 'CERTIFIED' : '', issuer: String(p.lab || '').toUpperCase(), parties: [['LABORATORY', p.lab || '—'], ['LOT', p.name + ' · ' + p.id]], sections: [{ h: 'RESULTS', rows: [R('Form', p.form), R('Purity / grade', p.grade, true)] }], signer: p.lab, signerRole: 'AUTHORISED ANALYST' }),
      lotCoa: () => ({ title: 'Certificate of analysis', no: p.cert, date: '—', status: p.cert ? 'VALID' : '', issuer: String(p.lab || '').toUpperCase(), parties: [['ISSUED BY', p.lab || '—'], ['LOT', p.name + ' · ' + p.id]], sections: [{ h: 'CERTIFIED VALUES', rows: [R('Available quantity', p.avail + ' ' + p.unit), R('Origin', p.origin), R('Grade', p.grade, true)] }], signer: p.lab, signerRole: 'CERTIFYING OFFICER' }),
      lotOrigin: () => ({ title: 'Origin declaration', no: 'OD-' + p.id, date: '—', status: '', parties: [['ORIGIN', p.origin], ['LOT', p.name + ' · ' + p.id]], sections: [{ h: 'DECLARATION', rows: [R('Mine of origin', String(p.origin || '').split(' · ')[0])] }] })
    };
    const fn = D[sp.t];
    let d: any = null; try { d = fn && (o || p) ? fn() : null; } catch { d = null; }
    if (!d) return { title: sp.num && s.docLoading ? 'Loading document…' : 'Document unavailable', no: '', date: '—', status: '', parties: [], sections: [], issuer: '', signer: '', signerRole: '', note: sp.num && s.docLoading ? '' : 'This document is not available yet.' };
    return Object.assign({ issuer: 'MINERAL BRIDGE LTD', signer: 'Mineral Bridge Operations', signerRole: 'AUTHORISED SIGNATORY', note: '' }, d);
  }
  docFile(d?: any): any { return ((d.title + ' ' + (d.no || '')).trim().replace(/[^\w-]+/g, '-')) + '.html'; }
  docHtml(d?: any): any {
    const e = (v?: any) => String(v == null ? '' : v).replace(/[&<>]/g, (c?: any) => (({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as AnyObj)[c]));
    const tbl = (rows?: any) => '<table>' + rows.map(([k, v]: any) => '<tr><td>' + e(k) + '</td><td>' + e(v) + '</td></tr>').join('') + '</table>';
    return '<!doctype html><html><head><meta charset="utf-8"><title>' + e(d.title + ' ' + d.no) + '</title><style>body{font-family:Helvetica,Arial,sans-serif;color:#121214;max-width:720px;margin:40px auto;padding:0 24px}h1{font-family:Georgia,serif;font-weight:400;font-size:30px;margin:18px 0 4px}table{width:100%;border-collapse:collapse;margin:6px 0 18px}td{padding:7px 0;border-bottom:1px solid #e4e2db;font-size:13px}td:last-child{text-align:right;font-weight:600}h3{font-size:11px;letter-spacing:.08em;color:#8a6a1c;border-bottom:2px solid #121214;padding-bottom:5px;margin:22px 0 0}.top{display:flex;justify-content:space-between;background:#121214;color:#f4f2ed;padding:14px 18px;border-radius:6px}.m{color:#6b6a70;font-size:12px}@media print{.top{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>'
      + '<div class="top"><b>Mineral Bridge</b><span>' + e(d.issuer) + ' · ' + e(d.no) + '</span></div><h1>' + e(d.title) + '</h1><div class="m">Issued ' + e(d.date) + (d.status ? ' · ' + e(d.status) : '') + '</div>'
      + tbl(d.parties || []) + (d.sections || []).map((x?: any) => '<h3>' + e(x.h) + '</h3>' + tbl(x.rows.map((r?: any) => [r.k, r.v]))).join('')
      + (d.note ? '<p class="m">' + e(d.note) + '</p>' : '') + '<p style="margin-top:40px"><i>' + e(d.signer) + '</i><br><span class="m">' + e(d.signerRole) + '</span></p></body></html>';
  }
  downloadDoc(spec?: any): any {
    const sp = spec || this.state.doc;
    if (sp && sp.num && !this.state.docs[sp.num]) { void this.task(this.remote.loadDoc(sp.num).then(() => { if (this.state.docs[sp.num as string]) this.downloadDoc(sp); })); return; }
    const d = this.docData(sp);
    if (!d.no) return this.flash('This document is not available yet');
    const file = this.docFile(d);
    try { const url = URL.createObjectURL(new Blob([this.docHtml(d)], { type: 'text/html' })); const a = document.createElement('a'); a.href = url; a.download = file; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000); this.flash('Downloaded ' + file); }
    catch { this.flash('Download failed. Try again.'); }
  }
  docVals(): any {
    const s = this.state; if (s.screen !== 'doc' && s.screen !== 'auctionWon') return { dc: { parties: [], sections: [] }, openAucDoc: () => {} };
    const d = this.docData(s.doc), ok = ({ SIGNED: 1, PAID: 1, CONFIRMED: 1, COMPLETED: 1, COMPLIANT: 1, CERTIFIED: 1, VALID: 1, RELEASED: 1, DELIVERED: 1, REFUNDED: 1, WON: 1, DECLARED: 1 } as AnyObj)[d.status];
    return { dc: Object.assign({}, d, { hasParties: !!(d.parties || []).length, parties: (d.parties || []).map(([k, v]: any) => ({ k, v })), stBg: ok ? '#E2F2E9' : '#FBF3E4', stFg: ok ? '#17704C' : '#A1620B', file: this.docFile(d) }),
      openAucDoc: () => { const a = this.aucOf(), o = a && a.orderId ? s.orders.find((x?: any) => x.id === a.orderId) : null, d = o && (o.docs || []).find((x?: any) => /auction/i.test(x.type)); if (d) this.openDoc({ t: 'api', num: d.number, oid: o.id }); else this.flash('The auction result certificate is issued with your order'); } };
  }
  bizDocNeeded(): any { return this.isBusiness(this.state.user || ({} as AnyObj)); }
  kycFlag(id?: any): any { const u = this.state.user || ({} as AnyObj), fl = (u.kycFlags || ({} as AnyObj))[id], f = this.state.kyc[id]; if (!fl) return ''; return f && f.at > fl[1] ? '' : fl[0]; }
  kycListVals(): any {
    const s = this.state, u = s.user || ({} as AnyObj), k = s.kyc, ids = kycRequiredDocIds(s.kycReq, k.idType, this.bizDocNeeded());
    const editable = u.kyc === 'rejected' || u.kyc === 'none';
    const base = u.kyc === 'verified' ? 'Verified' : u.kyc === 'pending' ? 'Received' : '';
    return ids.map((id?: any) => { const f = k[id], fl = this.kycFlag(id), done = (u.kycFlags || ({} as AnyObj))[id] && !fl;
      const n = id === 'front' || id === 'back' ? kycDocLabel(id, k.idType) : KYC_INFO[id].title;
      return { n, v: fl ? 'Re-upload requested' : done ? 'Replaced · ready to resubmit' : f ? (base || 'Uploaded') + ' · ' + f.name : base || 'Not uploaded', fg: fl ? '#B42318' : done ? '#17704C' : base === 'Verified' ? '#17704C' : (f || base) ? '#121214' : '#8B8A90', flag: fl,
        canEdit: editable || !!fl, btn: fl ? 'Re-upload' : f ? 'Replace' : 'Upload', btnBg: fl ? '#121214' : '#fff', btnFg: fl ? '#F4F2ED' : '#121214', btnBorder: fl ? '#121214' : '#E4E2DB',
        tap: () => this.go('kycDoc', { kycDocId: id, kycDocErr: '' }) }; });
  }
  authVals(): any {
    const s = this.state, M = X(), a = s.auth.method === 'email' || s.auth.method === 'whatsapp' ? s.auth : Object.assign({}, s.auth, { method: 'whatsapp' }), set = (p?: any) => this.setState((x?: any) => ({ auth: Object.assign({}, x.auth, p), authErr: '' }));
    const sel = (on?: any) => ({ border: on ? '#121214' : '#E4E2DB', radio: on ? '7px solid #121214' : '1.5px solid #C8C6BF', shadow: on ? '0 6px 18px rgba(18,18,20,.10)' : 'none' });
    const r = s.reg, setR = (p?: any) => this.setState((x?: any) => ({ reg: Object.assign({}, x.reg, p), regErr: '' }));
    const k = s.kyc, setK = (p?: any) => this.setState((x?: any) => ({ kyc: Object.assign({}, x.kyc, p), kycErr: '' }));
    const boxes = Array.from({ length: 4 }, (_?: any, i?: any) => ({ v: s.otp[i] || '', border: s.otp.length === i ? '#121214' : '#E4E2DB' }));
    const idDocs = kycDocRows(s.kycReq, k.idType, this.bizDocNeeded());
    return {
      startSignup: () => { set({ mode: 'signup' }); this.go('auth'); }, startSignin: () => { set({ mode: 'signin' }); this.go('auth'); },
      browseGuest: () => this.jump('cats'),
      authModes: [['signup', 'Sign up'], ['signin', 'Sign in']].map(([id, label]: any) => ({ label, bg: a.mode === id ? '#121214' : 'transparent', fg: a.mode === id ? '#F4F2ED' : '#6B6A70', tap: () => set({ mode: id }) })),
      authMethods: [['whatsapp', 'WhatsApp', 'M3 21l1.6-5A9 9 0 1 1 8 19.4zM9 10c0 2.5 2.5 5 5 5l1.2-1.2 2 1-1 2c-4 0-8-4-8-8l2-1 1 2z'], ['email', 'Email', 'M4 4h16v16H4zM22 6l-10 7L2 6']].map(([id, label, icon]: any) => ({ label, icon, on: a.method === id, cardBg: a.method === id ? '#121214' : '#fff', border: a.method === id ? '#121214' : '#E4E2DB', iconBg: a.method === id ? 'rgba(217,180,86,.18)' : '#F1EFE9', iconFg: a.method === id ? '#D9B456' : '#121214', fg: a.method === id ? '#F4F2ED' : '#121214', sh: a.method === id ? '0 10px 22px rgba(18,18,20,.22)' : 'none', tap: () => set({ method: id, value: '' }) })),
      modeX: a.mode === 'signin' ? 'translateX(100%)' : 'translateX(0)',
      authKicker: a.mode === 'signin' ? 'WELCOME BACK' : 'VERIFIED MINERAL TRADING',
      authTitle: a.mode === 'signin' ? 'Sign in to Mineral Bridge' : 'Create your Mineral Bridge account',
      authSub: a.mode === 'signin' ? 'We send a 4-digit code to the WhatsApp number or email on your account.' : 'Sign up with WhatsApp or email. We send a 4-digit code to verify it is you.',
      authIcon: a.method === 'email' ? 'M4 4h16v16H4zM22 6l-10 7L2 6' : 'M3 21l1.6-5A9 9 0 1 1 8 19.4z',
      authValid: a.method === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.value.trim()) : ((n?: any) => n >= 7 && n <= 12)(a.value.replace(/\D/g, '').replace(/^0+/, '').length),
      switchText: a.mode === 'signin' ? 'New to Mineral Bridge?' : 'Already have an account?', switchLink: a.mode === 'signin' ? 'Create account' : 'Sign in',
      switchMode: () => set({ mode: a.mode === 'signin' ? 'signup' : 'signin' }),
      isSignup: a.mode === 'signup', authName: a.name, setAuthName: (e?: any) => set({ name: e.target.value }),
      authValue: a.value, setAuthValue: (e?: any) => set({ value: a.method === 'email' ? e.target.value : e.target.value.replace(/[^\d\s]/g, '') }), authErr: s.authErr,
      isPhone: a.method !== 'email', authPadL: a.method !== 'email' ? '120px' : '42px', authCc: a.cc || '+234', setAuthCc: (e?: any) => set({ cc: e.target.value }),
      ccList: CC.map(([c, n]: any) => ({ v: c, l: n + ' ' + c })),
      authLabel: a.method === 'email' ? 'EMAIL ADDRESS' : 'WHATSAPP NUMBER',
      authPh: a.method === 'email' ? 'you@company.com' : '803 000 0000', authType: a.method === 'email' ? 'email' : 'tel',
      keepOn: a.keep, keepBg: a.keep ? '#121214' : '#D5D3CC', keepX: a.keep ? '20px' : '2px', toggleKeep: () => set({ keep: !a.keep }),
      otpVia: a.method === 'email' ? 'email' : 'WhatsApp',
      otpTo:
        a.method === 'email'
          ? otpEmailForDisplay(a.value, s.maskedDest)
          : (s.maskedDest || ((a.cc || '+234') + ' ' + (a.value.trim().replace(/^0+/, '') || 'your number'))),
      otp: s.otp, setOtp: (e?: any) => this.setState({ otp: e.target.value.replace(/\D/g, '').slice(0, 4), otpErr: '' }), otpBoxes: boxes, otpErr: s.otpErr,
      resendOtp: () => { void this.task(this.remote.resendOtp()); },
      roleOpts: [['buyer', 'Buyer', 'Buy verified minerals'], ['seller', 'Seller', 'Sell minerals to Mineral Bridge'], ['both', 'Both', 'Buy and sell from one account']].map(([id, name, sub]: any) => Object.assign({ name, sub, tap: () => setR({ role: id }) }, sel(r.role === id))),
      showBuyer: r.role === 'buyer' || r.role === 'both', showSeller: r.role === 'seller' || r.role === 'both',
      buyerOpts: M.BUYER_TYPES.map(([id, name, sub]: any) => Object.assign({ name, sub, tap: () => setR({ buyerType: id }) }, sel(r.buyerType === id))),
      sellerOpts: M.SELLER_TYPES.map(([id, name, sub]: any) => Object.assign({ name, sub, tap: () => setR({ sellerType: id }) }, sel(r.sellerType === id))),
      regHeading: this.isBusiness(r) ? 'Your business details' : 'Your details', regBizLabel: this.isBusiness(r) ? 'BUSINESS OR TRADING NAME' : 'TRADING NAME (OPTIONAL)', regBizPh: this.isBusiness(r) ? 'Kestrel Metals Ltd' : 'Leave blank if you trade as an individual',
      regErr: s.regErr, regBusiness: r.business, setRegBusiness: (e?: any) => setR({ business: e.target.value }), regCountry: r.country, setRegCountry: (e?: any) => setR({ country: e.target.value }),
      regTermsBg: r.terms ? '#121214' : '#fff', regTerms: r.terms, toggleTerms: () => setR({ terms: !r.terms }),
      regContact: (a.method === 'email' ? 'Email · ' + (a.value || '—') : 'WhatsApp · ' + (a.cc || '+234') + ' ' + a.value.trim().replace(/^0+/, '')) + ' · verified',
      idTypes: ['National ID', 'Passport', "Driver's licence"].map((t?: any) => ({ label: t, bg: k.idType === t ? '#121214' : '#fff', fg: k.idType === t ? '#F4F2ED' : '#121214', tap: () => { void this.task(this.remote.setKycIdType(t)); } })),
      kycDocs: idDocs.map(([id, label]: any) => { const f = k[id], fl = this.kycFlag(id); return { label, icon: KYC_INFO[id].icon, done: !!f, doneOk: !!f && !fl, flagged: !!fl, todo: !f, hasImg: !!f && f.kind === 'img', isPdf: !!f && f.kind === 'pdf', isSample: !!f && f.kind === 'sample', bg: f && f.src ? "url('" + f.src + "')" : 'none', sub: fl ? 'Re-upload requested · ' + fl : f ? 'Uploaded · ' + f.name : KYC_INFO[id].short, subFg: fl ? '#B42318' : f ? '#17704C' : '#6B6A70', border: fl ? '#F2CFCB' : f ? '#B7DFC8' : '#E4E2DB', tap: () => this.go('kycDoc', { kycDocId: id, kycDocErr: '' }) }; }),
      kycCount: idDocs.filter(([id]: any) => k[id]).length + ' of ' + idDocs.length + ' uploaded', kycPct: Math.round(100 * idDocs.filter(([id]: any) => k[id]).length / idDocs.length) + '%',
      kd: (() => { const id = s.kycDocId || 'front', info = KYC_INFO[id], f = k[id], lab = (idDocs.find((d?: any) => d[0] === id) || [id, info.title])[1], pos = idDocs.findIndex((d?: any) => d[0] === id);
        return { label: lab, step: 'DOCUMENT ' + (pos + 1) + ' OF ' + idDocs.length, desc: info.desc, ratio: info.ratio, frameR: id === 'selfie' ? '50%' : '14px', frameHint: info.hint, capture: id === 'selfie' ? 'user' : 'environment', accept: id === 'selfie' ? 'image/*' : 'image/*,application/pdf',
          empty: !f, has: !!f, hasImg: !!f && f.kind === 'img', isPdf: !!f && f.kind === 'pdf', isSample: !!f && f.kind === 'sample', bg: f && f.src ? "url('" + f.src + "')" : 'none', name: f ? f.name : '', meta: f ? f.size + ' · added ' + M.fmt(f.at) : '',
          sampleHead: id === 'address' ? 'UTILITY BILL · OCT 2026' : id === 'biz' ? 'CERTIFICATE OF INCORPORATION' : id === 'selfie' ? 'SELFIE WITH ID' : (k.idType || 'NATIONAL ID').toUpperCase(), samplePhoto: id === 'front' || id === 'selfie', sampleMrz: id === 'front' ? 'IDNGA<<OKAFOR<<ADAEZE<<<<<<<<<<<' : id === 'back' ? '<<<<<<<<<<<<<<<<<<<<A0482216<<<' : '',
          err: s.kycDocErr, flag: this.kycFlag(id), tips: info.tips.map((t?: any, i?: any, a?: any) => ({ t, line: i === a.length - 1 ? 'transparent' : '#EFEDE7' })) }; })(),
      onKycFile: (e?: any) => { const file = e.target.files && e.target.files[0]; e.target.value = ''; if (file) this.readKycFile(file); },
      useKycSample: () => { if (!DEV_TOOLS) return; const id = s.kycDocId; setK({ [id]: { kind: 'sample', src: '', name: 'sample-' + id + '.jpg', size: '1.2 MB', at: Date.now() } }); this.setState({ kycDocErr: '' }); },
      removeKycDoc: () => { const old = k[s.kycDocId]; if (old && old.src && old.src.startsWith('blob:')) URL.revokeObjectURL(old.src); void this.task(this.remote.removeKycDoc(s.kycDocId)); },
      kycConsent: k.consent, kycConsentBg: k.consent ? '#121214' : '#fff', toggleConsent: () => { void this.task(this.remote.setKycConsent(!k.consent)); }, kycErr: s.kycErr,
      kycRef: (s.user || ({} as AnyObj)).kycRef || '', kycReturnNote: s.returnTo ? 'When approved, you can continue where you left off.' : 'We will notify you by email, SMS and WhatsApp when it is approved.',
      simApproveKyc: () => { if (!DEV_TOOLS) return; this.setState((x?: any) => ({ user: Object.assign({}, x.user, { kyc: 'verified' }) })); this.flash('Demo: KYC approved'); },
      simRejectKyc: () => { if (!DEV_TOOLS) return; const now = Date.now(); this.setState((x?: any) => ({ user: Object.assign({}, x.user, { kyc: 'rejected', kycReason: 'Compliance asked you to re-upload 2 documents. Replace them and resubmit.', kycFlags: { address: ['Proof of address is older than 3 months. Upload one dated within the last 3 months.', now], selfie: ['Your face is partly hidden. Take a new selfie in good light holding your ID.', now] } }), kyc: Object.assign({}, x.kyc, { consent: false }) })); this.notify(null, 'KYC: documents need re-upload', 'Replace your proof of address and selfie, then resubmit.'); this.flash('Demo: compliance asked for re-upload'); }
    };
  }
}


