// Platform state shape + defaults. A brand-new state is signed out and holds NO orders, auctions, cart,
// notifications or catalogue: all of that comes from the /v2 API after sign-in (see ./remote.ts).
import type { CancellationInfo, Contract, Faq, HomeSummary, KycDocKindWire, OtpChannel, SupportThreadSummary } from '../../api/types';
import type { Address, Auction, ChatMsg, DocSpec, KycDocId, KycFile, Notif, Order, OrderItem, Role, User } from '../../types/mineralBridge';

export type AppScreen = string;
export type Errs = Record<string, string>;

/** Rendered document shown on the `doc` screen. */
export interface DocData {
  title: string; no: string; date: string; status: string; issuer: string; signer: string; signerRole: string; note: string;
  parties: [string, string][]; sections: { h: string; rows: { k: string; v: string; w: 500 | 700; mono: boolean }[] }[];
}

export interface Draft {
  mineral: string;
  photos: number;
  qty: string;
  unit: string;
  grade: string;
  form: string;
  details: string;
  docs: string[];
}

export interface RefundForm {
  reason: string;
  note: string;
  type: 'full' | 'partial';
  amount: string;
  dest: 'original' | 'bank' | 'upi' | 'btc';
  holder: string;
  bank: string;
  account: string;
  account2: string;
  code: string;
  country: string;
  upi: string;
  upiName: string;
  addr: string;
  addr2: string;
  files: number;
  agree: boolean;
}

export type KycState = { idType: string; consent: boolean } & Record<KycDocId, KycFile | false>;

/** Per-order data that is not part of the `Order` UI shape (fetched on demand). */
export interface OrderMeta {
  contract?: Contract | null;
  btc?: { address: string; amountSats: number; rateMinorPerBtc: number; lockExpiresAt: number; amountUsd: number } | null;
  cancelInfo?: CancellationInfo | null;
  loadedAt?: number;
  shipLoaded?: boolean;
  /** Index into the quotation-number candidates already tried (Q-xxxxx, -R2, -R3 ...). */
  qTry?: number;
}

/** A phone/email change in progress (`POST /me/contact-change`), waiting for its verification code. */
export interface ContactChange {
  field: 'phone' | 'email';
  channel: OtpChannel;
  /** The wire identifier (E.164 for phone channels, lower-case email). */
  identifier: string;
  challengeId: string;
  masked: string;
  resendAt: number;
  /** Non-production backends return the code; only ever shown in __DEV__. */
  devOtp: string;
}

/** One message in a support thread. */
export interface SupportMsg { id: string; me: boolean; system: boolean; who: string; text: string; at: number }

/** An opened support thread (`GET /support/threads/:ref`). */
export interface SupportThreadView { ref: string; topic: string; subject: string; status: string; messages: SupportMsg[] }

export interface PaymentInstructions { beneficiary: string; bank: string; account: string; swift: string; upiId: string | null }

/** A file picked by the user and already uploaded (`POST /files`). */
export interface UploadRef { fileId: string; name: string; uri: string; type: string; label?: string }

export type UploadBucket = 'sellPhotos' | 'sellDocs' | 'receipt' | 'refund' | 'proof';

export interface AppState {
  ready: boolean;
  /** True while the stored session is being restored at cold start. */
  booting: boolean;
  /** True while the post-sign-in data sync is running. */
  syncing: boolean;
  screen: AppScreen;
  stack: AppScreen[];
  toast: string;
  sheet: string;
  user: User | null;
  auth: { mode: 'signup' | 'signin'; method: 'whatsapp' | 'email'; cc: string; value: string; name: string; keep: boolean };
  authErr: string;
  authBusy: boolean;
  challengeId: string;
  registrationToken: string;
  maskedDest: string;
  /** Non-production backends return the OTP; only ever shown in __DEV__. */
  devOtp: string;
  resendAt: number;
  otp: string;
  otpErr: string;
  reg: { role: Role; buyerType: string; sellerType: string; business: string; country: string; other: string; terms: boolean };
  regErr: string;
  kyc: KycState;
  kycErr: string;
  kycDocId: KycDocId;
  kycDocErr: string;
  kycReq: KycDocKindWire[];
  kycUploading: boolean;
  kycBusy: boolean;
  returnTo: string;
  cat: string;
  mineral: string;
  pid: string;
  qty: string;
  qtyErr: string;
  search: string;
  sort: string;
  sortOpen?: boolean;
  cols?: number;
  fform: string;
  labOnly: boolean;
  /** Catalogue cache bookkeeping (the products themselves live in the `mb4` registries). */
  catalogueLoading: boolean;
  catalogueLoaded: boolean;
  catalogueErr: string;
  catVersion: number;
  productsByMineral: Record<string, string[]>;
  cart: OrderItem[];
  cartVersion: number;
  orders: Order[];
  ordersLoading: boolean;
  oid: string;
  otab: 'buy' | 'sell' | 'auction';
  om: Record<string, OrderMeta>;
  notifs: Notif[];
  unread: number;
  summary: HomeSummary | null;
  placing: boolean;
  ship: Address;
  shipErr: Errs;
  pf: { method: string; terms: string; billName: string; billAddr: string; instr: string; date: string; time: string; address: string; contact: string; mobile: string; avail: boolean; inspInstr: string; c1: boolean; c2: boolean };
  pfErr: Errs;
  sc: { method: string; bank: string; account: string; date: string; time: string; address: string; pickup: string; logistics: string; other: string; c1: boolean };
  scErr: Errs;
  sign: { read: boolean; name: string };
  signErr: string;
  repNote: string;
  repErr: string;
  proof: boolean;
  payErr: string;
  pmethod?: string;
  paying?: boolean;
  btcTx?: string;
  btcLockAt?: number;
  /** UPI / net-banking payment reference entered by the buyer. */
  payRef?: string;
  /** Order id whose cancellation continues into a refund request. */
  cancelRefund?: string;
  instr: PaymentInstructions | null;
  rc: { qty: string; cond: string; photos: number; note: string };
  rcErr: string;
  draft: Draft;
  draftErr: Errs;
  hasDraft: boolean;
  uploads: Record<UploadBucket, UploadRef[]>;
  uploading: boolean;
  chat: Record<string, ChatMsg[]>;
  msg: string;
  prefs: { email: boolean; sms: boolean; whatsapp: boolean; push: boolean };
  faq: number;
  faqs: Faq[] | null;
  contacts: { phone: string; whatsapp: string; email: string } | null;
  edit: { name: string; business: string; email: string; phone: string; country: string } | null;
  editErr: Errs;
  rf: RefundForm;
  rfFieldErr: Errs;
  rfErr: string;
  qu: { pid: string; u: string } | null;
  auctions: Auction[];
  auctionsLoading: boolean;
  atab: string;
  aid: string;
  bidAmt: string;
  bidErr: string;
  autoOn: boolean;
  autoMax: string;
  reminders: Record<string, boolean>;
  tick: number;
  doc?: DocSpec;
  /** Rendered issued documents by number. */
  docs: Record<string, DocData>;
  docLoading: boolean;
  cx?: { reason: string; note: string; agree: boolean };
  cxErr?: string;
  /** Increments whenever a screen asks to scroll back to the top. */
  scrollSeq: number;
  /** Contact (phone/email) change flow. */
  contact: ContactChange | null;
  contactCode: string;
  contactErr: string;
  contactBusy: boolean;
  /** Price-variation decision (`priceVar` screen). */
  varNote: string;
  varErr: string;
  varBusy: boolean;
  /** Support inbox + thread. `supRef === ''` on the thread screen means "new conversation". */
  supThreads: SupportThreadSummary[] | null;
  supLoading: boolean;
  supErr: string;
  supRef: string;
  supThread: SupportThreadView | null;
  supThreadLoading: boolean;
  supMsg: string;
  supBusy: boolean;
}

export const emptyDraft = (): Draft => ({ mineral: '', photos: 0, qty: '', unit: 'kg', grade: '', form: 'Raw', details: '', docs: [] });
export const emptyRefund = (): RefundForm => ({ reason: '', note: '', type: 'full', amount: '', dest: 'original', holder: '', bank: '', account: '', account2: '', code: '', country: '', upi: '', upiName: '', addr: '', addr2: '', files: 0, agree: false });
export const emptyUploads = (): Record<UploadBucket, UploadRef[]> => ({ sellPhotos: [], sellDocs: [], receipt: [], refund: [], proof: [] });
export const EMPTY_USER: User = { name: '', business: '', country: '', phone: '', email: '', role: '', buyerType: '', sellerType: '', kyc: 'none', kycRef: '' };

/** A brand-new app state: signed out, with NO orders, auctions, cart, notifications or catalogue (all come from the API). */
export function fresh(): AppState {
  return {
    ready: true, booting: false, syncing: false, screen: 'welcome', stack: [], toast: '', sheet: '',
    user: null, auth: { mode: 'signup', method: 'whatsapp', cc: '+234', value: '', name: '', keep: true }, authErr: '', authBusy: false,
    challengeId: '', registrationToken: '', maskedDest: '', devOtp: '', resendAt: 0,
    otp: '', otpErr: '', reg: { role: '', buyerType: '', sellerType: '', business: '', country: 'Nigeria', other: '', terms: false }, regErr: '',
    kyc: { idType: 'National ID', front: false, back: false, selfie: false, address: false, biz: false, consent: false }, kycErr: '', kycDocId: 'front', kycDocErr: '', kycReq: [], kycUploading: false, kycBusy: false, returnTo: '',
    cat: '', mineral: '', pid: '', qty: '1', qtyErr: '', search: '', sort: 'featured', fform: 'All', labOnly: false,
    catalogueLoading: false, catalogueLoaded: false, catalogueErr: '', catVersion: 0, productsByMineral: {},
    cart: [], cartVersion: 0, orders: [], ordersLoading: false, oid: '', otab: 'buy', om: {}, notifs: [], unread: 0, summary: null, placing: false,
    ship: { org: '', street: '', city: '', country: '', contact: '', mobile: '' }, shipErr: {},
    pf: { method: '', terms: '', billName: '', billAddr: '', instr: '', date: '', time: '', address: '', contact: '', mobile: '', avail: true, inspInstr: '', c1: false, c2: false }, pfErr: {},
    sc: { method: '', bank: '', account: '', date: '', time: '', address: '', pickup: '', logistics: '', other: '', c1: false }, scErr: {},
    sign: { read: false, name: '' }, signErr: '', repNote: '', repErr: '', proof: false, payErr: '', instr: null,
    rc: { qty: '', cond: 'Good', photos: 0, note: '' }, rcErr: '',
    draft: emptyDraft(), draftErr: {}, hasDraft: false, uploads: emptyUploads(), uploading: false,
    chat: {}, msg: '',
    prefs: { email: true, sms: true, whatsapp: true, push: true }, faq: -1, faqs: null, contacts: null,
    edit: null, editErr: {},
    rf: emptyRefund(), rfFieldErr: {}, rfErr: '', qu: null, auctions: [], auctionsLoading: false, atab: 'live', aid: '', bidAmt: '', bidErr: '', autoOn: false, autoMax: '', reminders: {}, tick: 0,
    docs: {}, docLoading: false,
    scrollSeq: 0,
    contact: null, contactCode: '', contactErr: '', contactBusy: false, varNote: '', varErr: '', varBusy: false,
    supThreads: null, supLoading: false, supErr: '', supRef: '', supThread: null, supThreadLoading: false, supMsg: '', supBusy: false,
  };
}
