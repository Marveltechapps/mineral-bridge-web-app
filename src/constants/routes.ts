import type { RouteKey } from '@/types';

/**
 * The design drives every screen from a single `route` state key. The web
 * application gives each of those screens a real URL so deep links, the
 * browser's back button and shareable addresses all work, while `route`
 * remains the single source of truth inside the view models.
 */
export const ROUTE_PATHS: Record<RouteKey, string> = {
  home: '/',
  buy: '/buy',
  product: '/product',
  sell: '/sell',
  mining: '/mining',
  orders: '/orders',
  orderDetail: '/orders/detail',
  account: '/account',
  accEdit: '/account/edit',
  auth: '/auth',
  auctions: '/auctions',
  auctionDetail: '/auctions/detail',
  academy: '/academy',
  course: '/academy/course',
  howItWorks: '/how-it-works',
  kyc: '/kyc',
  negotiation: '/trade/negotiation',
  contract: '/trade/contract',
  lc: '/trade/letter-of-credit',
  bank: '/trade/bank',
  shipment: '/trade/shipment',
  asm: '/mining/register',
};

const PATH_TO_ROUTE = new Map<string, RouteKey>(
  (Object.entries(ROUTE_PATHS) as [RouteKey, string][]).map(([key, path]) => [path, key]),
);

/** Resolve a URL pathname back to the design's route key. */
export const routeFromPath = (pathname: string): RouteKey => {
  const normalised =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return PATH_TO_ROUTE.get(normalised) ?? 'home';
};
