import { api } from '../api';
import type {
  BtcQuote,
  BuyerFormBody,
  CancelOrderBody,
  CancellationInfo,
  ChatMessage,
  Contract,
  CreateBuyOrderBody,
  CreateSellOrderBody,
  DisputeReceiptBody,
  ListOrdersQuery,
  MessagesPage,
  OrderCard,
  OrderDetail,
  OrderDocumentSummary,
  Page,
  QuotationDecisionBody,
  ReceiptBody,
  SellerFormBody,
  SendMessageBody,
  Shipment,
  SignContractBody,
  SubmitChangesBody,
  SubmitPaymentBody,
  VariationDecisionBody,
} from '../api';

/**
 * Orders (buy + sell). Every state-changing call (accept/sign/pay/...) must send the order's current
 * `version` (from `OrderDetail.version`); a stale value yields 409 `step/version` - refetch and retry.
 *
 * `idempotencyKey` params: pass a stable key per user action (e.g. kept in component state) so a
 * network retry of the same tap cannot create a duplicate. When omitted a fresh UUID is generated.
 */
type Key = string | undefined;
const key = (k: Key): string | true => k ?? true;

/** POST /orders {kind:'buy'} (201). Use `fromCart: true` or explicit `items`. */
export const createBuyOrder = (body: Omit<CreateBuyOrderBody, 'kind'> & { kind?: 'buy' }, idempotencyKey?: Key): Promise<OrderDetail> =>
  api.post<OrderDetail>('/orders', { ...body, kind: 'buy' }, { idempotencyKey: key(idempotencyKey) });

/** POST /orders {kind:'sell'} (201). `photoFileIds` needs 3-20 uploaded `sell_photo` files. */
export const createSellOrder = (sell: CreateSellOrderBody['sell'], idempotencyKey?: Key): Promise<OrderDetail> =>
  api.post<OrderDetail>('/orders', { kind: 'sell', sell }, { idempotencyKey: key(idempotencyKey) });

/** GET /orders. */
export const listOrders = (query: ListOrdersQuery = {}, signal?: AbortSignal): Promise<Page<OrderCard>> =>
  api.get<Page<OrderCard>>('/orders', {
    query: {
      kind: query.kind,
      state: query.state,
      actionNeeded: query.actionNeeded === undefined ? undefined : String(query.actionNeeded),
      limit: query.limit,
      cursor: query.cursor,
    },
    signal,
  });

const base = (ref: string) => `/orders/${encodeURIComponent(ref)}`;

/** GET /orders/:ref. */
export const getOrder = (ref: string, signal?: AbortSignal): Promise<OrderDetail> => api.get<OrderDetail>(base(ref), { signal });

/** POST /orders/:ref/quotation/accept. */
export const acceptQuote = (ref: string, body: QuotationDecisionBody): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/quotation/accept`, { quotationNumber: body.quotationNumber, version: body.version });

/** POST /orders/:ref/quotation/decline. */
export const declineQuote = (ref: string, body: QuotationDecisionBody): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/quotation/decline`, body);

/** GET /orders/:ref/contract (creates the contract on first read). */
export const getContract = (ref: string, signal?: AbortSignal): Promise<Contract> =>
  api.get<Contract>(`${base(ref)}/contract`, { signal });

/** POST /orders/:ref/contract/sign. `documentHash` comes from `getContract`. */
export const signContract = (ref: string, body: SignContractBody): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/contract/sign`, body);

/** POST /orders/:ref/buyer-form (buy: payment method, terms, billing). */
export const submitBuyerForm = (ref: string, body: BuyerFormBody): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/buyer-form`, body);

/** POST /orders/:ref/payments/btc-quote (201). */
export const btcQuote = (ref: string, idempotencyKey?: Key): Promise<BtcQuote> =>
  api.post<BtcQuote>(`${base(ref)}/payments/btc-quote`, undefined, { idempotencyKey: key(idempotencyKey) });

/** POST /orders/:ref/payments (201) - money operation, idempotent. */
export const submitPayment = (ref: string, body: SubmitPaymentBody, idempotencyKey?: Key): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/payments`, body, { idempotencyKey: key(idempotencyKey) });

/** POST /orders/:ref/seller-form (sell: payout + inspection slot). */
export const submitSellerForm = (ref: string, body: SellerFormBody): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/seller-form`, body);

/** POST /orders/:ref/inspection-reports/accept. */
export const acceptInspection = (ref: string, version: number): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/inspection-reports/accept`, { version });

/** POST /orders/:ref/inspection-reports/query (`note` 5-2000 chars). */
export const queryInspection = (ref: string, note: string, version: number): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/inspection-reports/query`, { note, version });

/** POST /orders/:ref/receipt - confirm delivery. */
export const confirmReceipt = (ref: string, body: ReceiptBody): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/receipt`, body);

/** POST /orders/:ref/receipt/dispute. */
export const disputeReceipt = (ref: string, body: DisputeReceiptBody): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/receipt/dispute`, body);

/** GET /orders/:ref/cancellation - `mode`: free | refund | none. */
export const getCancellation = (ref: string, signal?: AbortSignal): Promise<CancellationInfo> =>
  api.get<CancellationInfo>(`${base(ref)}/cancellation`, { signal });

/** POST /orders/:ref/cancel (only when `mode === 'free'`; paid orders need a refund request). */
export const cancelOrder = (ref: string, body: CancelOrderBody): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/cancel`, body);

/** GET /orders/:ref/shipment (404 `shipment/not-assigned` until logistics assigns one). */
export const getShipment = (ref: string, signal?: AbortSignal): Promise<Shipment> =>
  api.get<Shipment>(`${base(ref)}/shipment`, { signal });

/** GET /orders/:ref/documents. Open one with `getDocument(number)` (see documents.service). */
export const listDocuments = (ref: string, signal?: AbortSignal): Promise<OrderDocumentSummary[]> =>
  api.get<{ items: OrderDocumentSummary[] }>(`${base(ref)}/documents`, { signal }).then(r => r.items);

/** GET /orders/:ref/messages (order chat). */
export const listMessages = (ref: string, cursor?: string, signal?: AbortSignal): Promise<MessagesPage> =>
  api.get<MessagesPage>(`${base(ref)}/messages`, { query: { cursor }, signal });

/** POST /orders/:ref/messages (201). Backend: `body` and/or `offerMinor`. */
export const sendMessage = (ref: string, body: SendMessageBody): Promise<ChatMessage | { ok: true; offerMinor?: number }> =>
  api.post<ChatMessage | { ok: true; offerMinor?: number }>(`${base(ref)}/messages`, body);

/** POST /orders/:ref/changes - resubmit after the team requests changes (sell). */
export const submitChanges = (ref: string, body: SubmitChangesBody): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/changes`, body);

/** POST /orders/:ref/price-variations/:variationId. */
export const decideVariation = (ref: string, variationId: string, body: VariationDecisionBody): Promise<OrderDetail> =>
  api.post<OrderDetail>(`${base(ref)}/price-variations/${encodeURIComponent(variationId)}`, body);
