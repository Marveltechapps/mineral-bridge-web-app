/**
 * Domain types for the Mineral Bridge web application.
 *
 * These mirror the data shapes declared in the source design
 * (`design-source/Mineral Bridge Web v2.dc.html`) one-for-one.
 */

export type IconName = 'shield' | 'flask' | 'truck' | 'chain';

export type RouteKey =
  | 'home'
  | 'buy'
  | 'product'
  | 'sell'
  | 'mining'
  | 'orders'
  | 'orderDetail'
  | 'account'
  | 'accEdit'
  | 'auth'
  | 'auctions'
  | 'auctionDetail'
  | 'academy'
  | 'course'
  | 'howItWorks'
  | 'kyc'
  | 'negotiation'
  | 'contract'
  | 'lc'
  | 'bank'
  | 'shipment'
  | 'asm';

export type CategoryKey = string;

export interface Category {
  key: CategoryKey;
  name: string;
  sub: string[];
  grad: string;
  types: string[];
}

export type SellerType = 'Refinery' | 'Cooperative' | 'Artisanal' | 'Trader';

export interface Product {
  id: string;
  name: string;
  category: string;
  catKey: CategoryKey;
  subCategory: string;
  subcategorySlug?: string;
  mineralType?: string;
  mineralTypeSlug?: string;
  productForm?: string;
  productFormSlug?: string;
  imageUrl?: string;
  seller: string;
  sellerType: SellerType;
  grade: string;
  region: string;
  price: string;
  unit: string;
  stock: string;
  grad: string;
}

export interface PipelineStage {
  title: string;
  sub: string;
}

export type OrderSide = 'BUY' | 'SELL';

export interface Order {
  id: string;
  /** Server id used for follow-up calls. `id` stays the human reference. */
  recordId?: string;
  mineral: string;
  side: OrderSide;
  qty: string;
  date: string;
  stage?: string;
  progress: string;
  status: string;
  rejected?: boolean;
  reason?: string;
  region?: string;
  sc: string;
  sbg: string;
  grad: string;
}

export type AuctionState = 'live' | 'upcoming' | 'ended';

export interface Auction {
  id: string;
  name: string;
  state: AuctionState;
  qty: string;
  grade: string;
  origin: string;
  bidNum: number;
  yourBidNum: number;
  unit: string;
  increment: string;
  timeLabel: string;
  grad: string;
}

export type CourseTrack = 'asm' | 'platform';

export interface Course {
  id: string;
  track: CourseTrack;
  title: string;
  sub: string;
  level: string;
  lessons: number;
  duration: string;
  done: number;
  certified: boolean;
  ic: IconName;
  grad: string;
}

export interface Chapter {
  t: string;
  cap: string;
  grad: string;
}

export interface SellPhoto {
  id: string;
  name: string;
  /** Local object URL shown in the photo card. */
  previewUrl: string;
  /** Set after the file is stored by the API. */
  fileId?: string;
}

export interface SellForm {
  mineral: string;
  customMineral: string;
  category: string;
  qty: string;
  unit: string;
  form: string;
  slot: string;
  payout: string;
  city: string;
  country: string;
  photos: SellPhoto[];
}

export interface AccountForm {
  name: string;
  email: string;
  mobile: string;
  country: string;
  company: string;
  role: string;
  docRef: string;
  docExp: string;
  payAccount: string;
  payBank: string;
  paySwift: string;
  payDefault: boolean;
  pw: string;
}

export interface AsmForm {
  site: string;
  country: string;
  region: string;
  workers: number;
}

export interface ContractTerms {
  seller: string;
  lot: string;
  incoterm: string;
  port: string;
  price: string;
  qty: string;
  unit: string;
  from: string;
  to: string;
  lcType: string;
  tenor: string;
  bank: string;
  presentation: string;
}

export interface ModalSpec {
  title: string;
  body: string;
  confirmLabel: string;
  confirm: () => void;
  hasSecondary?: boolean;
  secondaryLabel?: string;
  secondary?: () => void;
  /** When set, the confirm button stays disabled until the field matches this text. */
  promptLabel?: string;
  promptPlaceholder?: string;
  promptMatch?: string;
}

export type KycStage = 'why' | 'type' | 'capture' | 'live' | 'review' | 'pending';
export type KycStatus = 'unverified' | 'pending' | 'verified';
export type AsmStep = 'elig' | 'site' | 'gps' | 'docs' | 'done';
export type AuthStage = 'form' | 'verify-method' | 'otp';
export type AuthMode = 'login' | 'signup';
export type AuthMethod = 'mobile' | 'email' | 'whatsapp';
export type SortKey = 'featured' | 'low' | 'high' | 'name';

/** A negotiation message: free text, a structured offer, or a system note. */
export interface NegotiationOffer {
  k: 'offer';
  who: 'me' | 'them';
  id: string;
  price: number;
  unit: string;
  qty: number;
  inc: string;
  win: string;
  from: string;
  to: string;
  time: string;
  open?: boolean;
  closed?: string;
}

export interface NegotiationText {
  k: 'text';
  who: 'me' | 'them';
  text: string;
  time: string;
}

export interface NegotiationSystem {
  k: 'system';
  text: string;
}

export type NegotiationMessage = NegotiationOffer | NegotiationText | NegotiationSystem;

export interface Conversation {
  id: string;
  party: string;
  initials: string;
  lot: string;
  grade: string;
}

export interface PayoutMethod {
  type: string;
  ref: string;
  def: boolean;
}
