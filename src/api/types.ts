/**
 * Wire DTOs for the customer `/v2` API (docs 07 + backend route handlers).
 * Pragmatic: fields the app relies on are typed; free-form backend payloads use `unknown`/records.
 */

/* ----------------------------- primitives ----------------------------- */

export type Cursor = string | null;

/** Cursor page. `total` is present on most lists. */
export interface Page<T> {
  items: T[];
  nextCursor: Cursor;
  total?: number;
}

export type QtyUnit = 'g' | 'kg' | 't' | 'ct' | 'pc' | 'bar' | 'oz';

/** Request/response quantity. Backend echoes `grams` on catalogue/auction quantities. */
export interface Qty {
  value: number | string;
  unit: QtyUnit | string;
  grams?: number;
}

/** Customer money on the mobile wire (`mobileMoney`): integer minor units. */
export interface Money {
  amount: number;
  currency: string;
  scale?: number;
  display?: string;
}

/** Persisted money doc (orders totals, refunds, destinations): `{ amountMinor, currency }`. */
export interface MoneyDoc {
  amountMinor: number;
  currency: string;
  scale?: number;
}

export type AnyMoney = Money | MoneyDoc;

/* ----------------------------- auth ----------------------------- */

export type OtpChannel = 'whatsapp' | 'sms' | 'email';
export type OtpIntent = 'signup' | 'signin' | 'contact_change';
export type ApiRole = 'buyer' | 'seller' | 'both';
export type BuyerTypeId = 'refinery' | 'house' | 'industry' | 'jewel' | 'investor' | 'wholesale';
export type SellerTypeId = 'asm' | 'industrial' | 'coop' | 'dealer' | 'exporter' | 'form' | 'scrap';

export interface OtpRequestBody {
  intent: OtpIntent;
  channel: OtpChannel;
  /** E.164 for whatsapp/sms, email otherwise. */
  identifier: string;
  /** Required for `signup` (2-160 chars). */
  fullName?: string;
}

/** 202 response of /auth/otp/request and /auth/otp/resend. */
export interface OtpChallenge {
  challengeId: string;
  maskedDestination: string;
  codeLength: number;
  expiresAt: string;
  resendAvailableAt: string;
  /** Present only in non-production backends. */
  developmentOtp?: string;
}

export interface OtpVerifyBody {
  challengeId: string;
  /** Exactly 4 digits. */
  code: string;
  keepSignedIn?: boolean;
  device?: { id?: string; name?: string; platform?: string };
}

export interface NeedsRegistration {
  status: 'needs_registration';
  registrationToken: string;
  expiresIn: number;
}

export interface SignedIn {
  status: 'signed_in';
  accessToken: string;
  expiresIn: number;
  /** Mobile only. */
  refreshToken?: string;
  me: Me;
}

export type OtpVerifyResult = NeedsRegistration | SignedIn;

export interface RegisterBody {
  registrationToken: string;
  fullName: string;
  role: ApiRole;
  buyerType?: BuyerTypeId;
  sellerType?: SellerTypeId;
  businessName?: string;
  /** ISO-3166 alpha-2, upper case. */
  countryCode: string;
  acceptTerms: true;
  termsVersion: string;
}

export interface RefreshResult {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
}

export interface AuthSession {
  id: string;
  client: string;
  device: string;
  lastUsedAt: string;
  current: boolean;
}

/* ----------------------------- me ----------------------------- */

export type KycStatusWire = 'none' | 'draft' | 'pending' | 'in_review' | 'verified' | 'rejected' | string;

export interface NotificationPrefs {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  push: boolean;
}

export interface Me {
  id: string;
  customerNo: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  countryCode: string | null;
  role: ApiRole;
  business: {
    name: string | null;
    buyerType: string | null;
    sellerType: string | null;
    isBusiness: boolean;
  };
  kyc: { status: KycStatusWire; reference: string | null; flags: Record<string, string> };
  accountStatus: string;
  notificationPreferences: NotificationPrefs;
  createdAt: string;
}

export interface MePatchBody {
  fullName?: string;
  businessName?: string;
  countryCode?: string;
}

export interface ContactChangeBody {
  channel: OtpChannel;
  identifier: string;
}

export interface BusinessTypeBody {
  role: ApiRole;
  buyerType?: BuyerTypeId;
  sellerType?: SellerTypeId;
  businessName?: string;
}

export interface HomeSummary {
  actionNeeded: unknown[];
  counts: { activeOrders: number; sellRequests: number; actionNeeded: number };
  unreadNotifications: number;
  kyc: { status: KycStatusWire; reference: string | null };
}

/* ----------------------------- kyc / files ----------------------------- */

export type KycIdType = 'national_id' | 'passport' | 'driving_licence' | 'voter_card';
export type KycDocKindWire = 'id_front' | 'id_back' | 'selfie' | 'proof_of_address' | 'business_registration';

export interface KycDocument {
  kind: KycDocKindWire;
  fileId: string;
  name: string;
  size: number;
  uploadedAt: string;
  status: 'uploaded' | 'verified' | 'rejected';
  flag?: { message: string; at: string };
}

export interface Kyc {
  status: KycStatusWire;
  reference: string | null;
  idType: KycIdType | null;
  requiredKinds: KycDocKindWire[];
  documents: KycDocument[];
  consent: boolean;
  submittedAt: string | null;
  slaDueAt: string | null;
  rejection: { reason: string; retryAllowed: boolean } | null;
}

export interface KycPatchBody {
  idType?: KycIdType;
  consent?: boolean;
}

export interface KycDocumentPutResult {
  kind: KycDocKindWire;
  status: 'uploaded';
  quality?: unknown;
}

export interface KycSubmitResult {
  reference: string;
  status: 'pending';
  slaDueAt: string;
}

export type FilePurpose =
  | 'kyc'
  | 'sell_photo'
  | 'sell_document'
  | 'payment_proof'
  | 'refund_evidence'
  | 'delivery_photo'
  | 'support_attachment'
  | 'avatar';

export interface UploadedFile {
  fileId: string;
  name: string;
  contentType: string;
  bytes: number;
  scan: string;
}

export interface FileUrl {
  url: string;
  expiresAt: string;
}

/* ----------------------------- catalogue ----------------------------- */

export interface CatalogueMineral {
  slug: string;
  name: string;
  lotCount: number;
}

export interface CatalogueCategory {
  slug: string;
  name: string;
  image: { url: string; name: string | null } | null;
  minerals: CatalogueMineral[];
}

export interface ProductCard {
  id: string;
  reference: string;
  productRef: string;
  name: string;
  type: { slug: string; name: string };
  categorySlug: string;
  subcategorySlug: string | null;
  productFormSlug: string | null;
  productFormName: string | null;
  imageName: string | null;
  mineralCode: string;
  purity: string | number | null;
  grade: string | null;
  origin: { country?: string; region?: string | null; site?: string | null; [k: string]: unknown };
  seller: { name?: string; verified?: boolean; [k: string]: unknown };
  assured: boolean;
  verified: boolean;
  status: string;
  imageUrl: string | null;
  gradient: { from: string; to: string } | null;
  availability: { available: Qty; minOrder: Qty; step: Qty };
  pricePerGram: Money;
  createdAt: string;
  soldOut: boolean;
}

export interface ProductMedia {
  id: string;
  kind: string;
  url: string;
  thumbnailUrl: string | null;
}

export interface ProductDetail extends ProductCard {
  description: string | null;
  attributes: Record<string, unknown>;
  media: ProductMedia[];
  documents: { id: string; name: string; kind: string }[];
  passportId: string | null;
}

/** `GET /catalogue/products/:ref/documents/:type`. `url` is signed (5 min) for stored files or an external link. */
export type ProductDocumentType = 'lot_test_report' | 'certificate_of_analysis' | 'origin_declaration';

export interface ProductDocument {
  type: ProductDocumentType;
  number: string;
  name: string;
  contentType: string | null;
  available: true;
  url: string;
  expiresAt: string | null;
  bytes?: number;
}

export interface ListProductsQuery {
  mineral?: string;
  category?: string;
  form?: string;
  labTested?: boolean;
  q?: string;
  sort?: 'featured' | 'available_desc' | 'available_asc' | 'name';
  limit?: number;
  cursor?: string;
}

/* ----------------------------- cart ----------------------------- */

export interface CartItem {
  productRef: string | null;
  name: string | null;
  qty: Qty;
  entered: Qty;
  available: Qty | null;
  ok: boolean;
  issue: 'withdrawn' | 'insufficient' | string | null;
}

export interface Cart {
  items: CartItem[];
  count: number;
  version: number;
}

/* ----------------------------- orders ----------------------------- */

export interface DeliveryAddress {
  org: string;
  street: string;
  city: string;
  region?: string;
  /** ISO-3166 alpha-2 upper case. */
  country: string;
  contact: string;
  mobile: string;
}

export interface OrderQty {
  value: string | number;
  unit: 'g' | 'kg' | 't' | 'ct';
}

export type CreateBuyOrderBody =
  | { kind: 'buy'; fromCart: true; delivery: DeliveryAddress; items?: undefined }
  | { kind: 'buy'; fromCart?: false; items: { productRef: string; qty: OrderQty }[]; delivery: DeliveryAddress };

export interface CreateSellOrderBody {
  kind: 'sell';
  sell: {
    mineral: string;
    name?: string;
    qty: OrderQty;
    grade: string;
    form: 'Raw' | 'Semi-finished' | 'Finished';
    /** 10-2000 chars. */
    details: string;
    /** 3-20 file ids from POST /files (purpose sell_photo). */
    photoFileIds: string[];
    documentFileIds?: string[];
  };
}

export type OrderKindWire = 'buy' | 'sell';

export interface OrderCard {
  reference: string;
  kind: OrderKindWire;
  title: string;
  status: string;
  /** Current workflow step key (e.g. `quoteOk`, `contract`, `paid`). */
  step: string | null;
  actionNeeded: boolean;
  updatedAt: string;
}

export interface ListOrdersQuery {
  kind?: 'buy' | 'sell' | 'auction';
  state?: 'open' | 'done' | 'cancelled';
  actionNeeded?: boolean;
  limit?: number;
  cursor?: string;
}

export interface OrderLine {
  productId?: string;
  name: string;
  imageUrl?: string;
  grams: number;
  unitPriceMinorE4PerGram: number;
  lineTotalMinor: number;
  qty?: { value: string | number; unit: string };
  enteredAs?: string;
}

export interface OrderTimelineEntry {
  stepKey: string;
  label: string;
  actor: { kind: string; id?: string; name?: string; role?: string };
  note?: string;
  at: string;
  data?: Record<string, unknown>;
}

export interface OrderDetail {
  id: string;
  reference: string;
  kind: OrderKindWire;
  status: string;
  workflow: {
    definition: string;
    version: number;
    current: { key: string; owner: string; enteredAt: string };
  } | null;
  hold: { type: string; owner: string; role?: string; reason?: string; openedAt?: string } | null;
  lines: OrderLine[];
  sell: {
    mineralSlug: string;
    name: string;
    qty: { value: string | number; unit: string };
    grade?: string;
    form?: string;
    details?: string;
    photoFileIds?: string[];
    documentFileIds?: string[];
    declaredValue?: MoneyDoc;
  } | null;
  delivery: (Partial<DeliveryAddress> & Record<string, unknown>) | null;
  totals: { subtotal: MoneyDoc; platformFee: MoneyDoc; surcharge: MoneyDoc; total: MoneyDoc };
  timeline: OrderTimelineEntry[];
  createdAt: string;
  updatedAt: string;
  /** Optimistic-concurrency version; send back on every state-changing order call. */
  version: number;
  /** Current/latest quotation when one exists for the order. */
  quotation?: {
    number: string;
    rev?: number;
    status?: string;
    total: AnyMoney;
    validUntil?: string;
    issuedAt?: string;
    conditions?: string | null;
    lines?: unknown[];
    fee?: AnyMoney | null;
    transport?: AnyMoney | null;
  };
  /** Sell-side price variations proposed by trading (`GET /orders/:ref` maps the backend `_id` to `id`). */
  priceVariations?: PriceVariation[];
}

export interface PriceVariation {
  id: string;
  from: AnyMoney;
  to: AnyMoney;
  reason: string;
  note?: string;
  /** `awaiting_seller` | `accepted` | `rejected` | `withdrawn`. */
  status: string;
  proposedAt?: string | null;
  decidedAt?: string | null;
  decisionNote?: string | null;
}

export interface QuotationDecisionBody {
  quotationNumber: string;
  version: number;
  reason?: string;
}

export interface Contract {
  number: string;
  html: string;
  pdfUrl: string | null;
  documentHash: string;
  parties: { role: string; id: string }[];
  clauses: { h: string; text: string }[];
  signatures: {
    customer?: { nameTyped: string; at: string } | null;
    platform?: { nameTyped?: string; at: string } | null;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export interface SignContractBody {
  documentHash: string;
  nameTyped: string;
  readConfirmed: true;
  version: number;
}

export type PaymentTerms = 'advance_100' | 'advance_30_70' | 'lc_at_sight';

export interface BuyerFormBody {
  method: string;
  terms: PaymentTerms;
  billing: { name: string; address: string };
  instructions?: string;
  confirmed: true;
  version: number;
}

export type PaymentMethod = 'bank_transfer' | 'neft' | 'rtgs' | 'upi' | 'net_banking' | 'btc' | 'lc' | 'other';

export interface BtcQuote {
  [k: string]: unknown;
}

export interface SubmitPaymentBody {
  method: PaymentMethod;
  proofFileIds?: string[];
  btcTxid?: string;
  reference?: string;
  terms?: string;
  billing?: { name: string; address: string };
  version: number;
}

export interface SellerFormBody {
  payout: Record<string, unknown>;
  inspectionSlot: { date: string; time: string; address: string };
  confirmed: true;
  version: number;
}

export interface ReceiptBody {
  qtyReceived: OrderQty;
  condition: 'good' | 'minor_damage' | 'damaged';
  /** At least 1. */
  photoFileIds: string[];
  note?: string;
  version: number;
}

export interface DisputeReceiptBody {
  qtyReceived: OrderQty;
  condition: string;
  photoFileIds: string[];
  /** 5-2000 chars. */
  note: string;
  version: number;
}

export interface CancellationInfo {
  mode: 'free' | 'refund' | 'none';
  reasons: string[];
  message: string;
  paid: AnyMoney | null;
}

export interface CancelOrderBody {
  reason: string;
  note?: string;
  agree: true;
  version: number;
}

export interface ShipmentEvent {
  [k: string]: unknown;
}

/** Shipment doc as persisted by the backend (admin-managed); fields are best-effort. */
export interface Shipment {
  _id?: string;
  id?: string;
  reference?: string;
  status?: string;
  partner?: string;
  events?: ShipmentEvent[];
  [k: string]: unknown;
}

export interface OrderDocumentSummary {
  number: string;
  type: string;
  version: number;
  status: string;
  issuedAt: string;
  entity: { type: string; id: string };
}

export interface ChatMessage {
  id: string;
  body: string;
  author: { kind?: string; id?: string; name?: string; [k: string]: unknown } | string;
  attachmentIds: string[];
  at: string;
  readAt: string | null;
}

export interface MessagesPage extends Page<ChatMessage> {
  thread: string;
  suggestions: { label: string; action: string }[];
}

export interface SendMessageBody {
  body?: string;
  attachmentFileIds?: string[];
  /** Counter-offer in minor units (negotiation). Requires `body` OR `offerMinor`. */
  offerMinor?: number;
}

export interface SubmitChangesBody {
  photoFileIds?: string[];
  documentFileIds?: string[];
  replaceFiles?: Record<string, string>;
  note: string;
  version: number;
  sellerForm?: Record<string, unknown>;
}

export interface VariationDecisionBody {
  decision: 'accept' | 'reject';
  note?: string;
  version: number;
}

/* ----------------------------- refunds ----------------------------- */

export type RefundReasonWire =
  | 'delivery_delayed'
  | 'quantity_quality'
  | 'damaged'
  | 'damaged_in_transit'
  | 'paid_twice'
  | 'no_longer_needed'
  | 'other';

export interface RefundDestination {
  method: 'original' | 'bank' | 'upi' | 'btc';
  holder?: string;
  bankName?: string;
  accountMasked?: string;
  accountEnc?: string;
  swiftOrIfsc?: string;
  country?: string;
  upiId?: string;
  btcAddress?: string;
  label?: string;
}

export interface CreateRefundBody {
  type: 'full' | 'partial';
  /** Required for partial. */
  amountMinor?: number;
  reason: RefundReasonWire;
  /** 10-2000 chars. */
  note: string;
  destination: RefundDestination;
  attachmentFileIds?: string[];
  cancelOrder?: boolean;
  agree: true;
}

export type RefundStatusWire = 'requested' | 'review' | 'approved' | 'processing' | 'refunded' | 'declined';

export interface Refund {
  ref: string;
  id: string;
  orderId: string;
  type: 'full' | 'partial';
  amount: AnyMoney;
  reason: string;
  note: string;
  status: RefundStatusWire | string;
  destination: Partial<RefundDestination>;
  attachmentFileIds: string[];
  cancelOrderOnApproval?: boolean;
  fromDiscrepancy?: boolean;
  approvals?: unknown[];
  decisions?: unknown[];
  bankRef?: string | null;
  refundedAt: string | null;
  dueBy: string;
  createdAt: string;
  overdue: boolean;
}

/* ----------------------------- auctions ----------------------------- */

export type AuctionStatus = 'live' | 'upcoming' | 'ended';

export interface AuctionSummary {
  id: string;
  reference: string;
  name: string;
  lot: { quantity: Qty; grade: string | null; display: string };
  status: AuctionStatus;
  bid: Money;
  bidLabel: string;
  closesAt: string;
  opensAt: string;
  countdownDisplay: string;
  bidCount: number;
  reserveMet: boolean;
  assured: boolean;
  imageUrl: string | null;
}

/** Row of `GET /auctions?status=mine`. */
export interface MyBidRow {
  auctionId: string;
  auctionName: string;
  imageUrl: string | null;
  yourBid: Money;
  highestBid: Money;
  youAreHighest: boolean;
  status: string;
  closesAt: string;
}

export interface AuctionDetail {
  id: string;
  reference: string;
  name: string;
  status: AuctionStatus;
  lot: { quantity: Qty; grade: string | null; display: string };
  description: string | null;
  badges: string[];
  sampling: { by: string; at: string | null; moisturePercent: number | null } | null;
  bidding: {
    startingBid: Money;
    highestBid: Money | null;
    minimumIncrement: Money;
    nextValidBid: Money;
    quickIncrements: number[];
    bidCount: number;
    reserveMet: boolean;
    yourBid: Money | null;
    youAreHighest: boolean;
  };
  closesAt: string;
  antiSniping: { enabled: boolean; extendByMinutes: number; withinMinutes: number };
  bindingNote: string;
  imageUrl: string | null;
  mediaCount: number;
  /** Send as `version` when bidding (optimistic concurrency). */
  version: number;
}

export interface Bid {
  id: string;
  bidderDisplayName: string;
  initials: string;
  amount: Money;
  placedAt: string;
  agoDisplay: string;
  leading: boolean;
  isYou: boolean;
}

export interface BidsList {
  items: Bid[];
  total: number;
}

export interface BidPlaced {
  bid: { id: string; amount: Money; placedAt: string; leading: boolean };
  /**
   * NOTE: backend returns the raw service shape here (`highestMinor`, `currency`), not `highestBid: Money`
   * (see v2.auctions.routes.ts). Use `highestMinor` + `currency`.
   */
  auction: { highestMinor: number; bidCount: number; closesAt: string; version: number; currency: string };
}

export interface AutoBid {
  autoBid: { max: { amountMinor: number; currency: string }; active: boolean };
}

export interface AuctionOrderRef {
  orderRef: string;
}

/** Mobile WS frames (`{ event, at, data }`). */
export type AuctionWsEvent =
  | { event: 'bid.placed'; at: string; data: { bid: { id: string; bidderLabel: string; amount: Money; placedAt: string; isYours: boolean }; highestBid: Money; bidCount: number; reserveMet: boolean; version: number } }
  | { event: 'bidder.outbid'; at: string; data: { auctionId: string; auctionName: string; newHighestBid: Money; closesAt: string; yourBid: Money } }
  | { event: 'auction.extended'; at: string; data: { closesAt: string; reason: string } }
  | { event: 'auction.closed'; at: string; data: { outcome: 'won' | 'lost' | 'reserve_not_met'; winningBid: Money | null; yourBid: Money | null } }
  | { event: 'pong'; at: string }
  | { event: 'error'; at?: string; data?: { code?: string; message?: string } };

/* ----------------------------- notifications ----------------------------- */

export interface Notification {
  id: string;
  event: string;
  title: string;
  body: string;
  /** Deep-link target, e.g. `{ type: 'order', ref: 'MB-...' }`. */
  target: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsPage extends Page<Notification> {
  unreadCount: number;
}

export interface RegisterDeviceBody {
  /** Push token (FCM/APNs), min 10 chars. */
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceId?: string;
  appVersion?: string;
}

/** Server-sent event parsed from `/notifications/stream`. */
export interface NotificationStreamEvent {
  id?: string;
  event: string;
  data: Record<string, unknown>;
}

/* ----------------------------- support ----------------------------- */

export interface Faq {
  q: string;
  a: string;
}

export interface FaqsResponse {
  items: Faq[];
  contacts: { phone: string; whatsapp: string; email: string };
}

export type SupportTopic = 'general' | 'other_payment_method' | 'order' | 'sell';

export interface SupportThreadSummary {
  ref: string;
  topic: string;
  subject: string;
  status: string;
  updatedAt: string;
}

export interface SupportMessage {
  _id?: string;
  id?: string;
  body: string;
  author?: unknown;
  at?: string;
  attachmentIds?: string[];
  [k: string]: unknown;
}

export interface SupportThread {
  ref?: string;
  reference?: string;
  topic: string;
  status: string;
  messages: SupportMessage[];
  [k: string]: unknown;
}

export interface CreateThreadBody {
  topic: SupportTopic;
  orderRef?: string;
  body: string;
  attachmentFileIds?: string[];
}

/* ----------------------------- reference ----------------------------- */

export interface ReferenceList<T = unknown> {
  list: string;
  items: T;
}
