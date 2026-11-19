import { api } from '../api';
import type { CreateRefundBody, Page, Refund } from '../api';

/**
 * POST /orders/:ref/refunds (201) - idempotent (backend REQUIRES `Idempotency-Key`).
 * Pass a stable key per submit tap; a fresh UUID is generated when omitted.
 */
export const createRefund = (orderRef: string, body: CreateRefundBody, idempotencyKey?: string): Promise<Refund> =>
  api.post<Refund>(`/orders/${encodeURIComponent(orderRef)}/refunds`, body, { idempotencyKey: idempotencyKey ?? true });

/** GET /refunds. */
export const listRefunds = (
  query: { status?: string; cursor?: string; limit?: number } = {},
  signal?: AbortSignal,
): Promise<Page<Refund>> => api.get<Page<Refund>>('/refunds', { query, signal });

/** GET /refunds/:ref. */
export const getRefund = (ref: string, signal?: AbortSignal): Promise<Refund> =>
  api.get<Refund>(`/refunds/${encodeURIComponent(ref)}`, { signal });
