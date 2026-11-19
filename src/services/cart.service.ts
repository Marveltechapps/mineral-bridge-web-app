import { api } from '../api';
import type { Cart, QtyUnit } from '../api';

/** GET /cart. */
export const getCart = (signal?: AbortSignal): Promise<Cart> => api.get<Cart>('/cart', { signal });

/**
 * PUT /cart/items/:productRef - sets (replaces) the quantity for a product.
 * Units accepted by the backend: g, kg, t, ct, pc, bar.
 */
export const putItem = (
  productRef: string,
  qty: { value: number | string; unit: QtyUnit | string },
  version?: number,
): Promise<Cart> =>
  api.put<Cart>(`/cart/items/${encodeURIComponent(productRef)}`, {
    qty: { value: Number(qty.value), unit: qty.unit },
    ...(version !== undefined ? { version } : {}),
  });

/** DELETE /cart/items/:productRef - returns the updated cart. */
export const removeItem = (productRef: string): Promise<Cart> =>
  api.delete<Cart>(`/cart/items/${encodeURIComponent(productRef)}`);
