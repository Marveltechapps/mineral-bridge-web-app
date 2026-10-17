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
import { http } from '@/lib/api/client';
import type { Paginated, QueryParams } from '@/lib/api/types';
import type { Product, SellerType, SortKey } from '@/types';

export interface CatalogCategory {
  key: string;
  name: string;
  shortName?: string;
  subCategories?: string[];
  imageUrl?: string | null;
  lotCount?: number;
}

export interface CatalogMineral {
  id: string;
  name: string;
  categoryKey: string;
  categoryName: string;
  defaultUnit?: string;
}

export interface MarketStats {
  activeLots: number;
  orders30d: number;
  originCountries: number;
  mineralTypes?: number;
}

/**
 * Filters for a catalog listing. Mirrors the filter rail: a category, a grade,
 * a seller type, a free-text search and a sort, all optional.
 *
 * `category: 'all'` is the rail's "no category chosen" value and is not sent.
 */
export interface LotQuery {
  category?: string;
  subcategory?: string;
  mineralType?: string;
  productForm?: string;
  grade?: string;
  sellerType?: SellerType;
  query?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

/** Keys the API expects. Named here so a rename shows up as a type error. */
function toQueryParams(q: LotQuery): QueryParams {
  const sort = q.sort === 'low' ? 'price_asc' : q.sort === 'high' ? 'price_desc' : q.sort === 'name' ? 'name' : q.sort ? 'newest' : undefined;
  return {
    category: q.category === 'all' ? undefined : q.category,
    subcategory: q.subcategory || undefined,
    type: q.mineralType || undefined,
    productForm: q.productForm || undefined,
    grade: q.grade,
    sellerType: q.sellerType,
    q: q.query,
    sort,
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
interface WebLot {
  id: string;
  title?: string;
  grade?: string | null;
  mineral?: { category?: string; subcategory?: string | null; type?: string; productForm?: string | null };
  subcategorySlug?: string | null;
  mineralTypeName?: string | null;
  mineralTypeSlug?: string | null;
  productFormName?: string | null;
  productFormSlug?: string | null;
  imageName?: string | null;
  seller?: { name?: string };
  origin?: { region?: string | null; country?: string };
  unitPrice?: { price?: { amount?: number; currency?: string } };
  available?: { value?: number; unit?: string };
  imageUrl?: string | null;
  listPrice?: number | null;
  priceUnit?: string | null;
  categoryName?: string | null;
  subcategoryName?: string | null;
}

function categoryKey(slug: string | undefined): Product['catKey'] {
  return (slug || 'unspecified') as Product['catKey'];
}

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif)$/i;

/** CloudFront returns 403 for sheet paths that omit the file extension. */
export function displayImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const hashAt = url.indexOf('#');
  const withoutHash = hashAt === -1 ? url : url.slice(0, hashAt);
  const fragment = hashAt === -1 ? '' : url.slice(hashAt);
  const queryAt = withoutHash.indexOf('?');
  const path = queryAt === -1 ? withoutHash : withoutHash.slice(0, queryAt);
  const query = queryAt === -1 ? '' : withoutHash.slice(queryAt);
  if (IMAGE_EXT.test(path)) return url;
  return `${path}.png${query}${fragment}`;
}

/** Maps the web lot contract onto the design's product card. */
export function lotToProduct(lot: WebLot): Product {
  const amount = lot.unitPrice?.price?.amount;
  const sheetPrice = typeof lot.listPrice === 'number'
    ? lot.listPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : null;
  const price = sheetPrice ?? (typeof amount === 'number' ? (amount / 100).toLocaleString('en-US', { style: 'currency', currency: lot.unitPrice?.price?.currency || 'USD' }) : '—');
  const imageUrl = displayImageUrl(lot.imageUrl);
  const image = imageUrl ? `url("${imageUrl}") center / contain no-repeat, ` : '';
  const categoryName = lot.categoryName || lot.mineral?.category || '';
  return {
    id: lot.id,
    name: lot.title || 'Mineral',
    category: categoryName,
    catKey: categoryKey(lot.mineral?.category || categoryName),
    subCategory: lot.subcategoryName || lot.mineral?.subcategory || lot.mineral?.type || '',
    subcategorySlug: lot.subcategorySlug || lot.mineral?.subcategory || '',
    mineralType: lot.mineralTypeName || '',
    mineralTypeSlug: lot.mineralTypeSlug || lot.mineral?.type || '',
    productForm: lot.productFormName || '',
    productFormSlug: lot.productFormSlug || lot.mineral?.productForm || '',
    imageUrl,
    seller: lot.seller?.name || 'Mineral Bridge',
    sellerType: 'Trader',
    grade: lot.grade || '',
    region: lot.origin?.region || (lot.origin?.country && lot.origin.country !== 'unspecified' ? lot.origin.country : ''),
    price,
    unit: lot.priceUnit || 'g',
    stock:
      lot.available && (lot.available.value ?? 0) > 0
        ? `${lot.available.value} ${lot.available.unit ?? ''}`.trim()
        : lot.priceUnit
          ? `per ${lot.priceUnit}`
          : '—',
    grad: image ? `${image}#eef1f6` : 'linear-gradient(140deg,#1e2a5a,#141a2e)',
  };
}

interface LotDetail extends WebLot {
  description?: string | null;
}

function isAlreadyProduct(lot: WebLot | Product): lot is Product {
  const row = lot as Product & WebLot;
  return typeof row.name === 'string' && typeof row.catKey === 'string' && row.unitPrice == null && row.title == null;
}

export function asProduct(lot: WebLot | Product): Product & { description?: string } {
  if (isAlreadyProduct(lot)) return lot;
  const product = lotToProduct(lot);
  const detail = lot as LotDetail;
  return { ...product, description: detail.description ?? undefined };
}

export const getLots = async (query: LotQuery = {}, signal?: AbortSignal) => {
  const first = await http.get<Paginated<WebLot | Product>>('/lots', { query: toQueryParams(query), signal });
  const mapPage = (page: Paginated<WebLot | Product>) => page.items.map(asProduct);
  let items = mapPage(first);
  const pageSize = first.perPage || query.perPage || items.length || 1;
  const pages = pageSize > 0 ? Math.ceil((first.total || items.length) / pageSize) : 1;
  if (query.page == null && pages > 1) {
    const rest = await Promise.all(
      Array.from({ length: pages - 1 }, (_, index) =>
        http.get<Paginated<WebLot | Product>>('/lots', {
          query: toQueryParams({ ...query, page: index + 2, perPage: pageSize }),
          signal,
        }),
      ),
    );
    items = items.concat(...rest.map(mapPage));
  }
  return { ...first, items };
};

/** A single lot. Rejects with a `404` `ApiError` when the lot does not exist. */
export const getLot = async (id: string, signal?: AbortSignal) =>
  asProduct(await http.get<WebLot | Product>(`/lots/${encodeURIComponent(id)}`, { signal }));

export const getCategories = async (signal?: AbortSignal) =>
  (await http.get<{ items: CatalogCategory[] }>('/reference/categories', { signal })).items ?? [];

export const getMinerals = async (signal?: AbortSignal) =>
  (await http.get<{ items: CatalogMineral[] }>('/reference/minerals', { signal })).items ?? [];

export const getMarketStats = (signal?: AbortSignal) => http.get<MarketStats>('/market/stats', { signal });

export interface HierarchyForm {
  slug: string;
  name: string;
  imageUrl?: string | null;
  imageName?: string | null;
}
export interface HierarchyType {
  slug: string;
  name: string;
  imageUrl?: string | null;
  productForms: HierarchyForm[];
}
export interface HierarchySubcategory {
  slug: string;
  name: string;
  imageUrl?: string | null;
  mineralTypes: HierarchyType[];
}
export interface HierarchyCategory {
  slug: string;
  name: string;
  imageUrl?: string | null;
  subcategories: HierarchySubcategory[];
}

export const getHierarchy = async (signal?: AbortSignal) =>
  (await http.get<{ categories: HierarchyCategory[] }>('/reference/hierarchy', { signal })).categories ?? [];

/**
 * Query keys for the calls above — hierarchical, and including every parameter
 * that changes the result, or a filter change would serve the previous catalog
 * (§5.2).
 */
export const catalogKeys = {
  lots: (query: LotQuery = {}) => ['lots', query] as const,
  lot: (id: string) => ['lots', id] as const,
};
