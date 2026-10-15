/** Order list filtering and the order currently being tracked. */
export interface OrdersSlice {
  orderFilter: string;
  orderTab: 'active' | 'completed';
  trackId: string;
}

export const ordersInitial: OrdersSlice = {
  orderFilter: 'all',
  orderTab: 'active',
  trackId: 'MB-ORDER-33056',
};

export const ORDERS_KEYS = [
  'orderFilter',
  'orderTab',
  'trackId',
] as const satisfies readonly (keyof OrdersSlice)[];
