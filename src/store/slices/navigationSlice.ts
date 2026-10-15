import type { RouteKey } from '@/types';

/**
 * The current screen.
 *
 * Its own slice because it changes on every navigation and the shell (Header,
 * TradeNav, KycBanner) reads it, while `modal` in the UI slice changes
 * independently — keeping them apart stops opening a modal re-rendering the
 * whole shell.
 *
 * `AppStateProvider` keeps this in sync with the URL in both directions;
 * `ROUTE_PATHS` in `@/constants/routes` is the only place a path is written.
 */
export interface NavigationSlice {
  route: RouteKey;
}

export const navigationInitial: NavigationSlice = {
  route: 'home',
};

export const NAVIGATION_KEYS = ['route'] as const satisfies readonly (keyof NavigationSlice)[];
