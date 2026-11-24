/**
 * Mappers from `/v2` DTOs to the existing UI shapes in `src/types/mineralBridge.ts`,
 * so MBStore/screens keep their current models while the API layer is live.
 * Everything here is pure (no network) and tolerant of missing fields.
 */
import type {
  AnyMoney,
  AuctionDetail,
  AuctionSummary,
  Bid as BidDto,
  CatalogueCategory,
  DeliveryAddress,
  Kyc,
  KycDocKindWire,
  Me,
  MyBidRow,
  Notification,
  OrderDetail,
  OrderDocumentSummary,
  PriceVariation as PriceVariationDto,
  ProductCard,
  ProductDetail,
  Qty,
  Refund as RefundDto,
  Shipment as ShipmentDto,
} from '../api/types';
import type {
  Address,
  Auction,
  Bid,
  Category,
  KycDocId,
  KycStatus,
  LogEntry,
  Notif,
  Order,
  OrderItem,
  Product,
  PriceVariation,
  Refund,
  Role,
  SellInfo,
  Shipment,
  User,
} from '../types/mineralBridge';
import { hasImage } from './images';
import { fmt, stages, WHO } from './platform/data';

/* ------------------------------ small helpers ------------------------------ */

const GRAMS_PER_UNIT: Record<string, number> = { g: 1, kg: 1_000, t: 1_000_000, mt: 1_000_000, ct: 0.2, oz: 31.1034768 };
export const gramsPer = (unit: string): number => GRAMS_PER_UNIT[unit.toLowerCase()] ?? 1;

const COUNTRIES: Record<string, string> = {
  NG: 'Nigeria', KE: 'Kenya', GH: 'Ghana', ZA: 'South Africa', AE: 'United Arab Emirates', GB: 'United Kingdom',
  US: 'United States', TZ: 'Tanzania', CD: 'DR Congo', ZM: 'Zambia', ZW: 'Zimbabwe', GN: 'Guinea', RW: 'Rwanda',
  MZ: 'Mozambique', IN: 'India', BW: 'Botswana', NA: 'Namibia', UG: 'Uganda', ET: 'Ethiopia', EG: 'Egypt',
  CI: "Cote d'Ivoire", PE: 'Peru', MX: 'Mexico', ID: 'Indonesia', MG: 'Madagascar', SL: 'Sierra Leone', ML: 'Mali',
  BF: 'Burkina Faso', SN: 'Senegal', CM: 'Cameroon', AO: 'Angola', MW: 'Malawi', TH: 'Thailand', CN: 'China',
  AU: 'Australia', CA: 'Canada', BR: 'Brazil', CL: 'Chile', AR: 'Argentina', DE: 'Germany', FR: 'France',
  CH: 'Switzerland', BE: 'Belgium', NL: 'Netherlands', TR: 'Turkey', SA: 'Saudi Arabia', SG: 'Singapore',
  HK: 'Hong Kong', JP: 'Japan', KR: 'South Korea', LR: 'Liberia', TG: 'Togo', BJ: 'Benin', NE: 'Niger', MA: 'Morocco',
};

const COUNTRY_ALIASES: Record<string, string> = {
  uk: 'GB', 'great britain': 'GB', england: 'GB', usa: 'US', 'u.s.a.': 'US', america: 'US', uae: 'AE', emirates: 'AE',
  drc: 'CD', 'dr congo': 'CD', 'congo (drc)': 'CD', 'democratic republic of the congo': 'CD', 'congo-kinshasa': 'CD',
  "côte d'ivoire": 'CI', 'ivory coast': 'CI', 'cote divoire': 'CI', 'south korea': 'KR', 'korea': 'KR',
};

/** ISO alpha-2 -> display name (falls back to the code). */
export const countryName = (code?: string | null): string => (code ? COUNTRIES[code.toUpperCase()] ?? code : '');

/**
 * Display name or code -> ISO alpha-2 upper-case. Returns '' when the value is not recognised
 * (use for validation). Two letters are accepted as an ISO code as typed.
 */
export function resolveCountryCode(nameOrCode?: string | null): string {
  const v = (nameOrCode ?? '').trim();
  if (!v) return '';
  if (/^[A-Za-z]{2}$/.test(v)) return v.toUpperCase();
  const low = v.toLowerCase();
  if (COUNTRY_ALIASES[low]) return COUNTRY_ALIASES[low];
  const hit = Object.entries(COUNTRIES).find(([, n]) => n.toLowerCase() === low);
  return hit ? hit[0] : '';
}

/** Like `resolveCountryCode` but falls back to the first two letters (legacy behaviour). */
export function countryCode(nameOrCode?: string | null): string {
  const v = (nameOrCode ?? '').trim();
  return resolveCountryCode(v) || v.slice(0, 2).toUpperCase();
}

/** Minor units from either money shape. */
export const moneyMinor = (m?: AnyMoney | null): number =>
  !m ? 0 : 'amountMinor' in m ? m.amountMinor : m.amount;

const SCALE: Record<string, number> = { BTC: 8 };
/** Major units (e.g. dollars) from either money shape. */
export function moneyMajor(m?: AnyMoney | null): number {
  if (!m) return 0;
  const scale = ('scale' in m && m.scale !== undefined ? m.scale : SCALE[m.currency]) ?? 2;
  return moneyMinor(m) / 10 ** scale;
}

export const ts = (iso?: string | null): number => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isFinite(t) ? t : Date.now();
};

/**
 * Human quantity for a sell line.
 * A stored `value` that equals the canonical gram count (1 kg saved as 1000) is converted back.
 * An explicit 0 with a positive gram count is a missing entered value, not a real zero (BUG-012 / BUG-013).
 */
export function qtyValue(
  q?: Qty | { value?: string | number; unit?: string; grams?: number; base?: number } | number | null,
): number {
  if (q == null) return 0;
  if (typeof q === 'number') return Number.isFinite(q) ? q : 0;
  const unit = String(q.unit || 'g');
  const grams = Number((q as { grams?: number; base?: number }).grams ?? (q as { base?: number }).base ?? 0);
  const per = gramsPer(unit);
  let entered: number | null = null;
  if (q.value !== undefined && q.value !== null && q.value !== '') {
    const n = Number(q.value);
    if (Number.isFinite(n)) entered = n;
  }
  const storedAsGrams = entered != null && grams > 0 && per > 1 && Math.abs(entered - grams) < 1e-6;
  if (storedAsGrams || ((entered == null || entered === 0) && grams > 0 && per > 0)) {
    return Number((grams / per).toFixed(6));
  }
  return entered ?? 0;
}

/** OTP screen: show the address the user just registered, never a masked fragment (BUG-003). */
export function otpEmailForDisplay(typed: string, _masked?: string): string {
  const value = typed.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return value;
  return 'your email';
}

/** Methods that show a payment-reference field (BUG-008). */
export function paymentNeedsReference(method: string): boolean {
  return method === 'UPI' || method === 'Net banking' || method === 'Bank transfer';
}

const PAY_REF_ERR = 'Enter the payment reference from your bank or UPI app (at least 6 characters)';

/**
 * UPI and net banking require a reference. Bank transfer keeps the receipt as the
 * required proof and sends a reference when the buyer typed one (BUG-008).
 */
export function paymentSubmitError(method: string, ref: string, hasProof: boolean): string | null {
  if (method === 'Bitcoin') return null;
  const value = (ref || '').trim();
  if (method === 'UPI' || method === 'Net banking') return value.length < 6 ? PAY_REF_ERR : null;
  if (!hasProof) return 'Upload the payment receipt first';
  if (method === 'Bank transfer' && value && value.length < 6) return PAY_REF_ERR;
  return null;
}

export function paymentWireSendsReference(wire: string): boolean {
  return wire === 'upi' || wire === 'net_banking' || wire === 'bank_transfer' || wire === 'neft' || wire === 'rtgs';
}

/** Prefer the quotation number the server issued over a guessed revision (BUG-009). */
export function quotationNumberToSubmit(quoteNo: string | undefined, fallback: string): string {
  const known = ((quoteNo || '').split('·')[0] ?? '').trim();
  return known || fallback;
}

/** Seller home, order list, and the open order refresh themselves (BUG-015). */
export function screenPollsOrders(screen: string): boolean {
  return screen === 'home' || screen === 'orders' || screen === 'order';
}

/** Own messages in the order/support thread (BUG-016). */
export function isOutgoingChatAuthor(author: unknown, myId?: string): boolean {
  if (typeof author === 'string') return author === 'user' || author === 'customer';
  if (!author || typeof author !== 'object') return false;
  const a = author as { kind?: string; id?: string; userId?: string; sender_role?: string };
  const senderId = a.id || a.userId;
  if (senderId && myId) return String(senderId) === String(myId);
  const role = String(a.sender_role || a.kind || '');
  return role === 'customer' || role === 'user' || role === 'buyer' || role === 'seller';
}

/* ------------------------------ Me -> User ------------------------------ */

const KYC_MAP: Record<string, KycStatus> = {
  none: 'none',
  draft: 'none',
  pending: 'pending',
  in_review: 'pending',
  review: 'pending',
  submitted: 'pending',
  verified: 'verified',
  approved: 'verified',
  rejected: 'rejected',
};
export const mapKycStatus = (s?: string | null): KycStatus => KYC_MAP[s ?? 'none'] ?? 'pending';

export function mapMeToUser(me: Me, prev?: Partial<User> | null): User {
  const role: Role = me.role === 'buyer' || me.role === 'seller' || me.role === 'both' ? me.role : '';
  const user: User = {
    id: me.id || prev?.id,
    name: me.fullName ?? prev?.name ?? '',
    business: me.business.isBusiness ? me.business.name ?? '' : me.business.name ?? 'Individual',
    country: countryName(me.countryCode),
    phone: me.phone ?? me.whatsapp ?? '',
    email: me.email ?? '',
    role,
    buyerType: me.business.buyerType ?? '',
    sellerType: me.business.sellerType ?? '',
    kyc: mapKycStatus(me.kyc.status),
    kycRef: me.kyc.reference ?? '',
    via: prev?.via ?? (me.email && !me.phone ? 'email' : 'whatsapp'),
  };
  if (prev?.kycAt !== undefined) user.kycAt = prev.kycAt;
  if (prev?.kycFlags) user.kycFlags = prev.kycFlags;
  if (me.kyc.status === 'rejected' && prev?.kycReason) user.kycReason = prev.kycReason;
  return user;
}

/** Overlay KYC detail (`GET /kyc`) onto a User (reason/ref/timestamp/flags). */
export function mapKycToUser(user: User, kyc: Kyc): User {
  const flags: NonNullable<User['kycFlags']> = {};
  (kyc.documents ?? []).forEach(d => {
    const id = KYC_KIND_TO_DOC[d.kind];
    if (id && d.flag) flags[id] = [d.flag.message, ts(d.flag.at)];
  });
  return {
    ...user,
    kyc: mapKycStatus(kyc.status),
    kycRef: kyc.reference ?? user.kycRef,
    kycAt: kyc.submittedAt ? ts(kyc.submittedAt) : user.kycAt,
    kycReason: kyc.rejection?.reason ?? user.kycReason,
    kycFlags: flags,
  };
}

/* ------------------------------ KYC ids ------------------------------ */

export const KYC_KIND_TO_DOC: Record<KycDocKindWire, KycDocId> = {
  id_front: 'front', id_back: 'back', selfie: 'selfie', proof_of_address: 'address', business_registration: 'biz',
};
export const KYC_DOC_TO_KIND: Record<KycDocId, KycDocKindWire> = {
  front: 'id_front', back: 'id_back', selfie: 'selfie', address: 'proof_of_address', biz: 'business_registration',
};

const KYC_DOC_ORDER: KycDocId[] = ['front', 'back', 'selfie', 'address', 'biz'];

export function maskEmailForDisplay(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf('@');
  if (at < 1) return '•••';
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at);
  if (local.length >= 3) return `${local.slice(0, 2)}•••${local.slice(-1)}${domain}`;
  return `${local[0] ?? ''}•••${domain}`;
}

export function kycDocLabel(id: KycDocId, idType: string): string {
  switch (id) {
    case 'front':
      return idType === 'Passport' ? 'Passport photo page' : `${idType} · front`;
    case 'back':
      return `${idType} · back`;
    case 'selfie':
      return 'Selfie holding your ID';
    case 'address':
      return 'Proof of address (utility bill, bank statement or lease)';
    case 'biz':
      return 'Business document (registration, licence or permit)';
    default:
      return id;
  }
}

/** When `kycReq` is set, trust the server; otherwise fall back to client heuristics. */
export function kycDocRows(kycReq: KycDocKindWire[], idType: string, bizHeuristic: boolean): [KycDocId, string][] {
  if (kycReq.length > 0) {
    return KYC_DOC_ORDER.filter((id) => kycReq.includes(KYC_DOC_TO_KIND[id])).map((id) => [id, kycDocLabel(id, idType)]);
  }
  const all: [KycDocId, string, boolean][] = [
    ['front', kycDocLabel('front', idType), true],
    ['back', kycDocLabel('back', idType), idType !== 'Passport'],
    ['selfie', kycDocLabel('selfie', idType), true],
    ['address', kycDocLabel('address', idType), true],
    ['biz', kycDocLabel('biz', idType), bizHeuristic],
  ];
  return all.filter((d) => d[2]).map(([id, label]) => [id, label]);
}

export function kycRequiredDocIds(kycReq: KycDocKindWire[], idType: string, bizHeuristic: boolean): KycDocId[] {
  return kycDocRows(kycReq, idType, bizHeuristic).map(([id]) => id);
}

export const ID_TYPE_LABELS: Record<string, string> = {
  national_id: 'National ID', passport: 'Passport', driving_licence: "Driver's licence", voter_card: "Voter's card",
};
export const ID_TYPE_WIRE: Record<string, 'national_id' | 'passport' | 'driving_licence' | 'voter_card'> = {
  'National ID': 'national_id', Passport: 'passport', "Driver's licence": 'driving_licence', "Voter's card": 'voter_card',
};

/* ------------------------------ Catalogue -> Product / Category ------------------------------ */

const num = (v: number) => v.toLocaleString('en-US');

export function productIsSoldOut(p: Pick<Product, 'soldOut'>): boolean {
  return p.soldOut === true;
}

export function productIsAvailableOnRequest(
  p: Pick<Product, 'availableOnRequest' | 'soldOut' | 'avail'> & { availableOnRequest?: boolean },
): boolean {
  if (productIsSoldOut(p)) return false;
  if (p.availableOnRequest === true) return true;
  return (p.avail ?? 0) <= 0;
}

export function lotAvailabilityLabel(p: Product): string {
  if (productIsSoldOut(p)) return 'Unavailable';
  if ((p.avail ?? 0) > 0) {
    const unit = p.unit === 'bar' && p.avail !== 1 ? 'bars' : p.unit;
    return `${num(p.avail)} ${unit} available`;
  }
  if (productIsAvailableOnRequest(p)) return 'Available on request';
  return 'Unavailable';
}

export function productHasLotDocuments(p: Pick<Product, 'lab' | 'hasDocs' | 'cert' | 'verified'>): boolean {
  return !!(p.hasDocs || p.lab || p.cert || p.verified);
}

export function mapProduct(p: ProductCard | ProductDetail): Product {
  const avail = p.availability.available;
  const unit = String(avail.unit || 'g');
  const per = gramsPer(unit);
  const minGrams = p.availability.minOrder.grams ?? qtyValue(p.availability.minOrder) * gramsPer(String(p.availability.minOrder.unit));
  const pricePerGramMajor = moneyMajor(p.pricePerGram);
  const attrs = ('attributes' in p ? p.attributes : undefined) ?? {};
  const str = (v: unknown): string => (typeof v === 'string' ? v : '');
  const country = p.origin?.country ? countryName(String(p.origin.country)) : '';
  const place = [p.origin?.site, p.origin?.region].filter(Boolean).join(', ');
  const img = hasImage(p.imageName) ? (p.imageName as string) : p.imageUrl || p.imageName || 'cat-precious';
  const apiLab = p.lab;
  const soldOut = p.soldOut ?? p.status === 'sold';
  const availableOnRequest = !soldOut && (p.availableOnRequest ?? (p.status === 'active' && qtyValue(avail) <= 0));
  const documents = 'documents' in p ? p.documents : [];
  return {
    id: p.productRef || p.reference || p.id,
    mineral: p.type.slug,
    name: p.name,
    form: p.productFormName ?? '',
    avail: qtyValue(avail),
    unit,
    min: per > 0 ? Number((minGrams / per).toFixed(6)) : 0,
    grade: p.grade ?? (p.purity !== null && p.purity !== undefined ? String(p.purity) : ''),
    lab: str(apiLab?.name) || str(attrs.labName) || str(attrs.lab) || '',
    cert: str(apiLab?.certificateNo) || str(attrs.certificate) || str(attrs.certificateNumber) || str(attrs.cert),
    origin: [place, country].filter(Boolean).join(' · '),
    img,
    ref: Number((pricePerGramMajor * per).toFixed(2)),
    soldOut,
    availableOnRequest,
    verified: p.verified,
    hasDocs: documents.length > 0,
  };
}

export const mapProducts = (items: (ProductCard | ProductDetail)[]): Product[] => items.map(mapProduct);

export function mapCategory(c: CatalogueCategory): Category {
  return {
    id: c.slug,
    name: c.name,
    img: hasImage(c.image?.name) ? (c.image?.name as string) : c.image?.url ?? 'cat-precious',
    minerals: c.minerals.map(m => [m.slug, m.name] as [string, string]),
  };
}

/* ------------------------------ Orders ------------------------------ */

const toAddress = (d: OrderDetail['delivery']): Address | undefined => {
  if (!d) return undefined;
  const x = d as Partial<DeliveryAddress>;
  return {
    org: x.org ?? '',
    street: x.street ?? '',
    city: x.city ?? '',
    country: x.country ? countryName(x.country) : '',
    contact: x.contact ?? '',
    mobile: x.mobile ?? '',
  };
};

function actorKey(a: { kind: string; role?: string }): 'you' | 'mb' | 'sgs' | 'lp' {
  if (a.kind === 'customer') return 'you';
  const role = (a.role ?? '').toLowerCase();
  if (role.includes('logistic')) return 'lp';
  if (role.includes('inspect')) return 'sgs';
  return 'mb';
}

/** Backend sell steps that differ from the UI sell stages. */
const SELL_STEP_ALIAS: Record<string, string> = { ship: 'picked', delivered: 'received' };

/**
 * Workflow step key -> UI stage index. The backend key is the step currently AWAITED while the UI `idx` is the
 * LAST COMPLETED stage, hence `index(key) - 1`. A completed order maps to the last stage.
 */
export function stageIndexOf(kind: 'buy' | 'sell', stepKey?: string | null, status?: string | null): number {
  const st = stages(kind);
  if (status === 'completed') return st.length - 1;
  if (!stepKey) return 0;
  const key = kind === 'sell' ? SELL_STEP_ALIAS[stepKey] ?? stepKey : stepKey;
  const i = st.findIndex(s => s.key === key);
  return i > 0 ? i - 1 : 0;
}

/** Backend hold type -> UI hold key (see `HOLD` in the store). */
const HOLD_KEYS: Record<string, string> = {
  declined: 'quoteDeclined', quote_declined: 'quoteDeclined', changes: 'changes', changes_requested: 'changes',
  clarify: 'clarify', clarification: 'clarify', discrepancy: 'discrepancy', refund: 'refund',
};
export const holdKey = (type?: string | null): string => (type ? HOLD_KEYS[type] ?? 'clarify' : '');

/** Quantity (value + unit) for an order line: the entered unit when present, else grams -> t / kg / g. */
export function lineQty(l: OrderDetail['lines'][number]): { qty: number; unit: string } {
  if (l.qty && Number(l.qty.value) > 0) return { qty: Number(l.qty.value), unit: String(l.qty.unit || 'g') };
  const g = Number(l.grams) || 0;
  if (g >= 1_000_000) return { qty: Number((g / 1_000_000).toFixed(6)), unit: 't' };
  if (g >= 1_000) return { qty: Number((g / 1_000).toFixed(6)), unit: 'kg' };
  return { qty: g, unit: 'g' };
}

/** Quotation number as issued by the back office: `Q-<last 5 digits of the reference>[-R<rev>]`. */
export function quotationNumber(reference: string, rev = 1): string {
  return `Q-${reference.replace(/\D/g, '').slice(-5)}${rev > 1 ? `-R${rev}` : ''}`;
}

/** A price variation DTO -> UI shape. Tolerates the raw backend `_id` as well as the mapped `id`. */
export function mapPriceVariation(v: PriceVariationDto & { _id?: string }): PriceVariation {
  return {
    id: v.id ?? v._id ?? '',
    from: moneyMajor(v.from),
    to: moneyMajor(v.to),
    currency: v.to?.currency ?? v.from?.currency ?? 'USD',
    reason: v.reason ?? 'other',
    note: v.note ?? '',
    status: v.status ?? '',
    at: ts(v.proposedAt),
    ...(v.decisionNote ? { decisionNote: v.decisionNote } : {}),
  };
}

/** The variation the seller still has to answer (`awaiting_seller`), if any. */
export const pendingVariation = (o?: Pick<Order, 'variations'> | null): PriceVariation | undefined =>
  o?.variations?.find(v => v.status === 'awaiting_seller');

export function mapOrderDetail(d: OrderDetail): Order {
  const kind = d.kind;
  const st = stages(kind);
  const log: LogEntry[] = (d.timeline ?? []).map(t => ({
    who: WHO[actorKey(t.actor)],
    text: t.label,
    note: t.note ?? '',
    at: ts(t.at),
  }));
  const items: OrderItem[] = (d.lines ?? []).map(l => {
    const q = lineQty(l);
    return { pid: l.productId ?? l.name, qty: q.qty, qIn: q.qty, uIn: q.unit, unit: q.unit, name: l.name, amount: (l.lineTotalMinor ?? 0) / 100 };
  });

  let sell: SellInfo | undefined;
  if (d.sell) {
    sell = {
      mineral: d.sell.mineralSlug,
      name: d.sell.name,
      qty: qtyValue(d.sell.qty),
      unit: String(d.sell.qty?.unit ?? 'kg'),
      grade: d.sell.grade ?? '',
      form: d.sell.form ?? '',
      details: d.sell.details ?? '',
      photos: d.sell.photoFileIds?.length ?? 0,
      docs: d.sell.documentFileIds ?? [],
      ref: d.sell.declaredValue ? moneyMajor(d.sell.declaredValue) / (qtyValue(d.sell.qty) || 1) : 0,
    };
  }

  const holdType = d.hold?.type;
  let idx = stageIndexOf(kind, d.workflow?.current.key, d.status);
  // "Changes requested": reopen the customer's previous step (mirrors the UI's hold = 'changes' semantics).
  if (holdType && holdKey(holdType) === 'changes' && st[idx + 1] && st[idx + 1]?.actor !== 'you' && idx > 0) idx -= 1;

  const order: Order = {
    id: d.reference,
    sid: d.id,
    ver: d.version,
    step: d.workflow?.current.key,
    kind,
    idx,
    created: ts(d.createdAt),
    log,
    items,
    sell,
    addr: toAddress(d.delivery),
    hold: holdType ? holdKey(holdType) : '',
  };
  if (d.priceVariations?.length) order.variations = d.priceVariations.map(mapPriceVariation);
  if (d.hold?.reason) order.holdNote = d.hold.reason;
  if (order.hold === 'discrepancy') order.disc = { qty: '', cond: '', note: d.hold?.reason ?? '', photos: 0, at: ts(d.hold?.openedAt ?? d.updatedAt) };
  if (d.status === 'cancelled' || d.status === 'rejected') {
    const last = log[log.length - 1];
    if (d.status === 'rejected') order.rejected = last?.note || 'Rejected';
    else order.cancelled = { reason: last?.text ?? 'Cancelled', note: last?.note ?? '', at: last?.at ?? ts(d.updatedAt) };
    order.hold = '';
  }

  // Prefer the quotation block returned by GET /orders/:ref; otherwise derive a fallback number.
  const qi = st.findIndex(s => s.key === 'quoteOk');
  if (!order.rejected && !order.cancelled && qi > 0 && idx + 1 >= qi) {
    const qd = d.quotation;
    const entry = [...(d.timeline ?? [])].reverse().find(t => t.stepKey === 'quote' || /quot|offer/i.test(t.label));
    const issued = qd?.issuedAt ? ts(qd.issuedAt) : entry ? ts(entry.at) : ts(d.updatedAt);
    order.quote = {
      no: qd?.number ?? quotationNumber(d.reference),
      total: moneyMajor(qd?.total ?? (kind === 'sell' && d.sell?.declaredValue ? d.sell.declaredValue : d.totals.total)),
      issued,
      valid: qd?.validUntil ? ts(qd.validUntil) : issued + 3 * 864e5,
      ...(qd?.rev && qd.rev > 1 ? { rev: qd.rev } : {}),
      ...(qd ? {} : { est: true }),
    };
  }
  return order;
}

/** Total in major units (what `orderValue()` returns for local demo orders). */
export const orderTotalMajor = (d: OrderDetail): number => moneyMajor(d.totals.total);

/* ------------------------------ Shipment ------------------------------ */

const SHIP_STATUS: Record<string, string> = {
  booked: 'Pickup scheduled', pickup_scheduled: 'Pickup scheduled', picked_up: 'Picked up', loaded: 'Picked up',
  in_transit: 'In transit', delayed: 'In transit', discharged: 'In transit', delivered: 'Delivered', received_at_vault: 'Delivered to vault',
};

const joinVals = (v: unknown): string => {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map(joinVals).filter(Boolean).join(', ');
  if (typeof v === 'object') return Object.values(v as Record<string, unknown>).map(x => (typeof x === 'string' || typeof x === 'number' ? String(x) : '')).filter(Boolean).join(' · ');
  return String(v);
};

/** Backend shipment doc -> UI Shipment (best effort; the doc is admin-managed). */
export function mapShipment(raw: ShipmentDto, o?: Order): Shipment {
  const r = raw as Record<string, unknown> & ShipmentDto;
  const route = (r.route ?? {}) as Record<string, string | undefined>;
  const pickup = (r.pickup ?? {}) as { scheduledAt?: string; address?: string };
  const pod = (r.pod ?? null) as { ref?: string; receivedBy?: string; at?: string } | null;
  const events = ((r.events as { title?: string; occurredAt?: string; projected?: boolean }[] | undefined) ?? [])
    .filter(e => !e.projected && e.occurredAt)
    .map(e => [String(e.title ?? ''), ts(e.occurredAt)] as [string, number]);
  const docs = ((r.documents as { name?: string; kind?: string }[] | undefined) ?? []).map(x => x.name || x.kind || '').filter(Boolean);
  const addr = o?.addr ? [o.addr.org, o.addr.street, o.addr.city, o.addr.country].filter(Boolean).join(', ') : '';
  const sell = o?.kind === 'sell';
  const eta = r.estimatedArrival ? fmt(ts(String(r.estimatedArrival))) : '';
  const sh: Shipment = {
    id: String(r.reference ?? r.id ?? ''),
    partner: String((r.partnerName as string | undefined) ?? 'Logistics partner'),
    contact: String(r.contact ?? ''),
    mode: joinVals(r.mode) || 'Road freight',
    from: [route.fromPort, route.fromCountry].filter(Boolean).join(', ') || (sell ? pickup.address ?? '' : 'Mineral Bridge vault'),
    to: [route.toPort, route.toCountry].filter(Boolean).join(', ') || (sell ? 'Mineral Bridge vault' : addr),
    pickup: pickup.scheduledAt ? fmt(ts(pickup.scheduledAt)) : '',
    status: SHIP_STATUS[String(r.status ?? '')] ?? String(r.status ?? ''),
    events,
    docs,
  };
  const vehicle = joinVals(r.vehicle); if (vehicle) sh.vehicle = vehicle;
  const driver = joinVals(r.driver); if (driver) sh.driver = driver;
  const seals = joinVals(r.seals); if (seals) sh.seals = seals;
  if (eta) sh.eta = eta;
  if (r.currentLocation) sh.location = String(r.currentLocation);
  if (pod && (pod.ref || pod.receivedBy)) {
    sh.pod = [pod.ref, pod.receivedBy ? 'received by ' + pod.receivedBy : ''].filter(Boolean).join(' · ');
    if (pod.at) sh.deliveredAt = ts(pod.at);
  }
  return sh;
}

/* ------------------------------ Refunds / Notifications ------------------------------ */

const REFUND_STATUS: Refund['status'][] = ['requested', 'review', 'approved', 'processing', 'refunded', 'declined'];

export function mapRefund(r: RefundDto): Refund {
  const status = (REFUND_STATUS as string[]).includes(r.status) ? (r.status as Refund['status']) : 'requested';
  const dest = r.destination?.method;
  return {
    ref: r.ref,
    amount: moneyMajor(r.amount),
    type: r.type,
    reason: r.reason,
    note: r.note,
    to: dest === 'bank' ? [r.destination.bankName ?? 'Bank account', r.destination.accountMasked].filter(Boolean).join(' ') : dest === 'upi' ? 'UPI ' + (r.destination.upiId ?? '') : dest === 'btc' ? 'Bitcoin wallet' : 'Original payment method',
    files: r.attachmentFileIds?.length ?? 0,
    status,
    at: ts(r.createdAt),
    fromDisc: r.fromDiscrepancy,
    bankRef: r.bankRef ?? undefined,
    ...(r.refundedAt ? { at_refunded: ts(r.refundedAt) } : {}),
  };
}

/** `refOf` resolves an internal order id (notification targets carry ids) to the order reference. */
export function mapNotification(n: Notification, refOf?: (id: string) => string | undefined): Notif {
  const t = (n.target ?? {}) as { type?: string; id?: string; ref?: string; orderRef?: string; screen?: string };
  let oid = t.ref ?? t.orderRef;
  if (!oid && t.type === 'order' && t.id) oid = refOf?.(t.id) ?? (/^MB-/.test(t.id) ? t.id : undefined);
  let to = t.screen;
  if (!oid && !to) to = t.type === 'kyc' ? 'kycStatus' : t.type === 'auction' ? 'auctions' : undefined;
  return { id: n.id, oid, to, title: n.title, note: n.body, at: ts(n.createdAt), read: n.readAt !== null };
}

/* ------------------------------ Auctions ------------------------------ */

const lotUnit = (q?: Qty) => String(q?.unit ?? 'kg');

export function mapAuctionSummary(a: AuctionSummary): Auction {
  const qty = qtyValue(a.lot.quantity);
  return {
    id: a.reference,
    sid: a.id,
    pid: '',
    name: a.name,
    unit: lotUnit(a.lot.quantity),
    grade: a.lot.grade ?? '',
    imageUrl: a.imageUrl ?? undefined,
    qty,
    status: a.status,
    start: moneyMajor(a.bid),
    endsAt: ts(a.closesAt),
    startsAt: ts(a.opensAt),
    bids: [],
    count: a.bidCount,
    reserveMet: a.reserveMet,
  };
}

export const mapBid = (b: BidDto): Bid => ({ who: b.isYou ? 'You' : b.bidderDisplayName, amt: moneyMajor(b.amount), at: ts(b.placedAt) });

export function mapAuctionDetail(d: AuctionDetail, bids: BidDto[] = [], prev?: Auction): Auction {
  const hi = d.bidding.highestBid ? moneyMajor(d.bidding.highestBid) : 0;
  const mapped = [...bids].map(mapBid).sort((x, y) => x.at - y.at);
  const a: Auction = {
    id: d.reference,
    sid: d.id,
    pid: '',
    name: d.name,
    unit: lotUnit(d.lot.quantity),
    grade: d.lot.grade ?? '',
    imageUrl: d.imageUrl ?? undefined,
    qty: qtyValue(d.lot.quantity),
    status: d.status,
    start: moneyMajor(d.bidding.startingBid),
    endsAt: ts(d.closesAt),
    startsAt: prev?.startsAt,
    bids: mapped.length ? mapped : prev?.bids ?? [],
    inc: moneyMajor(d.bidding.minimumIncrement) || 500,
    minNext: moneyMajor(d.bidding.nextValidBid),
    ver: d.version,
    count: d.bidding.bidCount,
    reserveMet: d.bidding.reserveMet,
    mine: d.bidding.yourBid !== null || !!prev?.mine,
    leading: d.bidding.youAreHighest,
    outbid: d.status === 'live' && d.bidding.yourBid !== null && !d.bidding.youAreHighest,
    orderId: prev?.orderId,
    autoMax: prev?.autoMax,
  };
  if (!mapped.length && hi && !a.bids.length) a.bids = [{ who: d.bidding.youAreHighest ? 'You' : 'Bidder', amt: hi, at: Date.now() }];
  // BUG-018: prefer server outcome.youWon over inferring from youAreHighest + reserveMet.
  if (d.status === 'ended') {
    if (d.outcome?.youWon) a.result = 'won';
    else if (d.outcome?.result === 'sold') a.result = d.bidding.yourBid !== null ? 'lost' : 'closed';
    else if (d.outcome && d.outcome.result !== 'sold') a.result = d.bidding.yourBid !== null ? 'lost' : 'closed';
    else a.result = d.bidding.youAreHighest && d.bidding.reserveMet ? 'won' : d.bidding.yourBid !== null ? 'lost' : 'closed';
  }
  return a;
}

/** Overlay a `status=mine` row onto an auction (ended -> won/lost). */
export function applyMyBid(a: Auction, r: MyBidRow): Auction {
  const ended = r.status === 'ended' || r.status === 'won' || r.status === 'lost' || a.status === 'ended';
  // BUG-018: only treat as won when the mine-row status is explicitly `won`.
  const won = r.status === 'won';
  return {
    ...a,
    mine: true,
    leading: r.youAreHighest,
    outbid: a.status === 'live' && !r.youAreHighest,
    ...(ended ? { result: won ? ('won' as const) : ('lost' as const), status: 'ended' as const } : {}),
  };
}

/* ------------------------------ Documents ------------------------------ */

export const DOC_LABELS: Record<string, string> = {
  quotation: 'Price quotation', e_contract: 'E-contract', sell_e_contract: 'E-contract', auction_terms: 'Auction terms',
  auction_result: 'Auction result certificate', payment_receipt: 'Payment receipt', tax_invoice: 'Tax invoice',
  inspection_report: 'Mineral Bridge inspection report', test_certificate: 'Third-party test report', payment_advice: 'Payment advice',
  consignment_note: 'Consignment note', proof_of_delivery: 'Proof of delivery', completion_certificate: 'Completion certificate',
  refund_receipt: 'Refund receipt', cancellation_confirmation: 'Cancellation confirmation',
};

export interface OrderDocRow { number: string; type: string; label: string; status: string; at: number }
export const mapDocumentRows = (docs: OrderDocumentSummary[]): OrderDocRow[] =>
  docs.map(d => ({ number: d.number, type: d.type, label: DOC_LABELS[d.type] ?? d.type.replace(/_/g, ' '), status: d.status, at: ts(d.issuedAt) }));
