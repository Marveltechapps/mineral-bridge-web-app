import { api } from '../api';
import type { CatalogueCategory, ListProductsQuery, Page, ProductCard, ProductDetail, ProductDocument, ProductDocumentType } from '../api';

/** GET /catalogue/categories (public, cacheable). */
export const getCategories = (signal?: AbortSignal): Promise<CatalogueCategory[]> =>
  api.get<{ items: CatalogueCategory[] }>('/catalogue/categories', { signal }).then(r => r.items);

/** GET /catalogue/products (public). `cursor` is the previous page's `nextCursor`. */
export const listProducts = (query: ListProductsQuery = {}, signal?: AbortSignal): Promise<Page<ProductCard>> =>
  api.get<Page<ProductCard>>('/catalogue/products', {
    query: {
      mineral: query.mineral,
      category: query.category,
      form: query.form,
      labTested: query.labTested === undefined ? undefined : String(query.labTested),
      q: query.q,
      sort: query.sort,
      limit: query.limit,
      cursor: query.cursor,
    },
    signal,
  });

/** GET /catalogue/products/:ref (reference like `G-1041` or internal id). */
export const getProduct = (ref: string, signal?: AbortSignal): Promise<ProductDetail> =>
  api.get<ProductDetail>(`/catalogue/products/${encodeURIComponent(ref)}`, { signal });

/** GET /catalogue/products/:ref/documents/:type -> signed (or external) URL; 404 `document/not-available` when the lot has none. */
export const getProductDocument = (ref: string, type: ProductDocumentType, signal?: AbortSignal): Promise<ProductDocument> =>
  api.get<ProductDocument>(`/catalogue/products/${encodeURIComponent(ref)}/documents/${encodeURIComponent(type)}`, { signal });
