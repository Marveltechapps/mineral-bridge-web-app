import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initialState, type AppState } from '@/store/appState';
import { ROUTE_PATHS, routeFromPath } from '@/constants/routes';
import type { RouteKey } from '@/types';

type StatePatch = Partial<AppState> | ((prev: AppState) => Partial<AppState>);

export interface AppStateContextValue {
  state: AppState;
  /** Shallow-merging updater with the same semantics as the design's `setState`. */
  setState: (patch: StatePatch) => void;
  /** Navigate to a screen and scroll back to the top, as the design's `go` does. */
  go: (route: RouteKey) => void;
}

export const AppStateContext = createContext<AppStateContextValue | null>(null);

const scrollToTop = () => {
  requestAnimationFrame(() => window.scrollTo({ top: 0 }));
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setRawState] = useState<AppState>(() => ({
    ...initialState,
    route: routeFromPath(window.location.pathname),
  }));

  // `go` and route-bearing `setState` calls drive the URL; this ref stops the
  // location listener from echoing that same change back into state.
  const intendedRoute = useRef<RouteKey>(state.route);

  const setState = useCallback(
    (patch: StatePatch) => {
      setRawState((prev) => {
        const next = typeof patch === 'function' ? patch(prev) : patch;
        if (next.route && next.route !== prev.route) {
          intendedRoute.current = next.route;
          navigate(ROUTE_PATHS[next.route]);
        }
        return { ...prev, ...next };
      });
    },
    [navigate],
  );

  const go = useCallback(
    (route: RouteKey) => {
      intendedRoute.current = route;
      setRawState((prev) => (prev.route === route ? prev : { ...prev, route }));
      navigate(ROUTE_PATHS[route]);
      scrollToTop();
    },
    [navigate],
  );

  // Keep `route` aligned when the user navigates with the browser itself
  // (back/forward buttons, deep links, a pasted URL).
  useEffect(() => {
    const fromUrl = routeFromPath(location.pathname);
    if (fromUrl === intendedRoute.current) return;
    intendedRoute.current = fromUrl;
    setRawState((prev) => (prev.route === fromUrl ? prev : { ...prev, route: fromUrl }));
  }, [location.pathname]);

  const value = useMemo<AppStateContextValue>(
    () => ({ state, setState, go }),
    [state, setState, go],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
