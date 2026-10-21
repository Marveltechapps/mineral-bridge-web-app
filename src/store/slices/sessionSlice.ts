import { isApiConfigured } from '@/lib/api/config';
import type { AuthMethod, AuthMode, AuthStage, RouteKey } from '@/types';

/** Who is signed in, and the state of the sign-in / sign-up overlay. */
export interface SessionSlice {
  /** False only while an API session restore is still in flight. */
  sessionReady: boolean;
  authed: boolean;
  authStage: AuthStage;
  authMethod: AuthMethod;
  authMode: AuthMode;
  authRole: string;
  authOpen: boolean;
  authVerifying: boolean;
  /** Screen to resume once authentication completes. */
  pendingResume: RouteKey | null;
}

export const sessionInitial: SessionSlice = {
  sessionReady: !isApiConfigured(),
  authed: false,
  authStage: 'form',
  authMethod: 'mobile',
  authMode: 'login',
  authRole: 'Buyer',
  authOpen: false,
  authVerifying: false,
  pendingResume: null,
};

export const SESSION_KEYS = [
  'sessionReady',
  'authed',
  'authStage',
  'authMethod',
  'authMode',
  'authRole',
  'authOpen',
  'authVerifying',
  'pendingResume',
] as const satisfies readonly (keyof SessionSlice)[];
