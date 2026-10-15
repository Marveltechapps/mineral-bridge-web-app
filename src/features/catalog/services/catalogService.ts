/**
 * Catalog HTTP calls — the pattern every other feature service copies
 * (ARCHITECTURE.md §5.1).
 *
 * One function per endpoint, typed both ways, no React: a service knows about
 * `lib/api` and `types`, and nothing above it. The view model decides when to
 * call it; the page never does.
 *
 * `useCatalogViewModel` still reads `constants/catalog.ts`. Switching it over is
 * the next step (§5.3) and waits on a backend; until then this file is the
 * contract that backend has to meet.
 */
import { http } from '@/lib/api/httpClient';
import type { Paginated, QueryParams } from '@/lib/api/types';
import type { CategoryKey, Product, SellerType, SortKey } from '@/types';

/**
 * Filters for a catalog listing. Mirrors the filter rail: a category, a grade,
 * a seller type, a free-text search and a sort, all optional.
 *
 * `category: 'all'` is the rail's "no category chosen" value and is not sent.
 */
export interface LotQuery {
  category?: CategoryKey | 'all';
  grade?: string;
  sellerType?: SellerType;
  query?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

/** Keys the API expects. Named here so a rename shows up as a type error. */
function toQueryParams(q: LotQuery): QueryParams {
  return {
    category: q.category === 'all' ? undefined : q.category,
    grade: q.grade,
    sellerType: q.sellerType,
    q: q.query,
    sort: q.sort,
    page: q.page,
    perPage: q.perPage,
  };
}

/**
 * A page of lots matching `query`.
 *
 * `signal` is the one TanStack Query passes to its query function, so a filter
 * change cancels the request it superseded.
 */
export const getLots = (query: LotQuery = {}, signal?: AbortSignal) =>
  http.get<Paginated<Product>>('/lots', { query: toQueryParams(query), signal });

/** A single lot. Rejects with a `404` `ApiError` when the lot does not exist. */
export const getLot = (id: string, signal?: AbortSignal) =>
  http.get<Product>(`/lots/${encodeURIComponent(id)}`, { signal });

/**
 * Query keys for the calls above — hierarchical, and including every parameter
 * that changes the result, or a filter change would serve the previous catalog
 * (§5.2).
 */
export const catalogKeys = {
  lots: (query: LotQuery = {}) => ['lots', query] as const,
  lot: (id: string) => ['lots', id] as const,
};
