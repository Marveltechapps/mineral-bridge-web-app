import { api } from '../api';
import type {
  AuctionDetail,
  AuctionOrderRef,
  AuctionStatus,
  AuctionSummary,
  AutoBid,
  BidPlaced,
  BidsList,
  MyBidRow,
  Page,
} from '../api';

const base = (ref: string) => `/auctions/${encodeURIComponent(ref)}`;

/** GET /auctions?status=live|upcoming|ended (public). */
export const listAuctions = (
  query: { status?: AuctionStatus; cursor?: string; limit?: number } = {},
  signal?: AbortSignal,
): Promise<Page<AuctionSummary>> => api.get<Page<AuctionSummary>>('/auctions', { query, signal });

/** GET /auctions?status=mine - the signed-in user's bids (requires auth). */
export const listMyBids = (query: { cursor?: string; limit?: number } = {}, signal?: AbortSignal): Promise<Page<MyBidRow>> =>
  api.get<Page<MyBidRow>>('/auctions', { query: { ...query, status: 'mine' }, signal });

/** GET /auctions/:ref (id or reference). `version` is needed for `placeBid`. */
export const getAuction = (ref: string, signal?: AbortSignal): Promise<AuctionDetail> =>
  api.get<AuctionDetail>(base(ref), { signal });

/** GET /auctions/:ref/bids (latest 50). */
export const listBids = (ref: string, signal?: AbortSignal): Promise<BidsList> => api.get<BidsList>(`${base(ref)}/bids`, { signal });

/**
 * POST /auctions/:ref/bids (201). Requires verified KYC + buyer role. `version` = `AuctionDetail.version`
 * (409 on stale -> refetch). Backend REQUIRES `Idempotency-Key`; pass a stable key per tap.
 */
export const placeBid = (ref: string, amountMinor: number, version: number, idempotencyKey?: string): Promise<BidPlaced> =>
  api.post<BidPlaced>(`${base(ref)}/bids`, { amountMinor, version }, { idempotencyKey: idempotencyKey ?? true });

/** PUT /auctions/:ref/auto-bid. */
export const setAutoBid = (ref: string, maxMinor: number): Promise<AutoBid> => api.put<AutoBid>(`${base(ref)}/auto-bid`, { maxMinor });

/** DELETE /auctions/:ref/auto-bid (204). */
export const clearAutoBid = (ref: string): Promise<void> => api.delete<void>(`${base(ref)}/auto-bid`);

/** PUT /auctions/:ref/reminder. */
export const setReminder = (ref: string, channels: string[] = ['push']): Promise<{ ok: true }> =>
  api.put<{ ok: true }>(`${base(ref)}/reminder`, { channels });

/** DELETE /auctions/:ref/reminder (204). */
export const clearReminder = (ref: string): Promise<void> => api.delete<void>(`${base(ref)}/reminder`);

/** POST /auctions/:ref/order - winner creates/fetches the settlement order (201 or 200). */
export const createWinnerOrder = (ref: string): Promise<AuctionOrderRef> => api.post<AuctionOrderRef>(`${base(ref)}/order`);
