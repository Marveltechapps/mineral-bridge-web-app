import { api } from '../api';
import type { ReferenceList } from '../api';

/**
 * GET /reference/:list (public, cached 1h). Known lists: countries, country-codes, buyer-types,
 * seller-types, id-types, payment-methods, payout-methods, payment-terms, payment-instructions,
 * refund-reasons, cancel-reasons-buy, cancel-reasons-sell, units, inspection-slots, sell-forms,
 * sell-document-types.
 */
export const getReference = <T = unknown>(list: string, signal?: AbortSignal): Promise<T> =>
  api.get<ReferenceList<T>>(`/reference/${encodeURIComponent(list)}`, { signal }).then(r => r.items);
