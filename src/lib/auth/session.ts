/**
 * Signing in, signing out, and refreshing — ARCHITECTURE.md §8.
 *
 * This is the only module that changes the session. The HTTP client reads the
 * token from here (`getAccessToken`) and calls `refreshSession()` when a request
 * comes back 401; nothing else may do either.
 *
 * The refresh request deliberately goes through a **second** HTTP client with no
 * auth hooks of its own. Giving it the application's client would mean a failed
 * refresh returning 401 triggered another refresh, forever; and routing it
 * around `httpClient` entirely would put a second `fetch` call site in the
 * codebase. A separate hook-free client avoids both.
 */
import { createHttpClient } from '@/lib/api/httpClient';
import { ApiError } from '@/lib/api/ApiError';
import {
  ANONYMOUS,
  getAccessToken,
  getSession,
  isSignedIn,
  setSession,
  subscribe,
  type Session,
  type SessionEndReason,
} from '@/lib/auth/sessionStore';

export { getAccessToken, getSession, isSignedIn, subscribe };
export type { Session, SessionEndReason, SessionStatus } from '@/lib/auth/sessionStore';

/** What the server returns from `POST /auth/refresh` and the OTP endpoints. */
export interface TokenResponse {
  accessToken: string;
  /** Seconds until the access token expires, as OAuth spells it. */
  expiresIn?: number;
}

/** No auth hooks: a 401 from the refresh endpoint must not trigger a refresh. */
const authClient = createHttpClient();

const sessionFrom = (token: TokenResponse): Session => ({
  status: 'authenticated',
  accessToken: token.accessToken,
  expiresAt: typeof token.expiresIn === 'number' ? Date.now() + token.expiresIn * 1000 : null,
  endedBy: null,
});

/**
 * Begin a session.
 *
 * With a `TokenResponse` the session is `authenticated` and the token is sent
 * on every subsequent request. Called with nothing it is a `demo` session: the
 * interface treats the person as signed in but there is no credential to send,
 * which is exactly the state the click-through flow produces while there is no
 * backend. See `SessionStatus`.
 */
export function signIn(token?: TokenResponse): Session {
  const next: Session = token
    ? sessionFrom(token)
    : { status: 'demo', accessToken: null, expiresAt: null, endedBy: null };
  setSession(next);
  return next;
}

/**
 * End the session. Safe to call when already anonymous.
 *
 * The reason reaches the interface through `Session.endedBy`: `expired` re-opens
 * the login overlay so the person can resume, `signed-out` does not.
 */
export function signOut(reason: SessionEndReason = 'signed-out'): void {
  pendingRefresh = null;
  setSession({ ...ANONYMOUS, endedBy: reason });
}

/* ── Refresh ──────────────────────────────────────────────────────────────── */

/**
 * The in-flight refresh, shared by every request that hits a 401 while it runs.
 *
 * Without this, a screen with four queries would fire four refreshes; each new
 * token invalidates the one before it, so three of the four replays would fail
 * against a server that rotates refresh tokens.
 */
let pendingRefresh: Promise<boolean> | null = null;

async function performRefresh(): Promise<boolean> {
  try {
    const token = await authClient.post<TokenResponse>('/auth/refresh', undefined, {
      // The refresh token is an httpOnly cookie, so the browser has to be told
      // to send it; this is the only request in the application that needs it.
      credentials: 'include',
    });
    if (!token || typeof token.accessToken !== 'string' || token.accessToken === '') {
      signOut('expired');
      return false;
    }
    setSession(sessionFrom(token));
    return true;
  } catch (error) {
    // Any failure means the session is over: a 401 because the refresh cookie
    // expired, a 5xx or a network error because we cannot prove otherwise.
    // Dropping to anonymous is the safe reading in both cases.
    signOut('expired');
    if (error instanceof ApiError || error instanceof Error) return false;
    throw error;
  }
}

/**
 * Exchange the refresh cookie for a new access token.
 *
 * Resolves `true` when the session was renewed and the caller may replay its
 * request, `false` when the session is over and the caller should surface its
 * original 401. Never rejects.
 */
/**
 * Recover a session from the refresh cookie after a page load.
 * A missing cookie stays anonymous and does not open the sign-in overlay.
 */
export async function restoreSession(): Promise<boolean> {
  if (getSession().status === 'authenticated') return true;
  try {
    const token = await authClient.post<TokenResponse>('/auth/refresh', undefined, { credentials: 'include' });
    if (!token || typeof token.accessToken !== 'string' || token.accessToken === '') return false;
    setSession(sessionFrom(token));
    return true;
  } catch {
    return false;
  }
}

export function refreshSession(): Promise<boolean> {
  // A demo session has nothing to refresh, and an anonymous one never had a
  // session to begin with — neither should produce a network request.
  if (getSession().status !== 'authenticated') return Promise.resolve(false);

  pendingRefresh ??= performRefresh().finally(() => {
    pendingRefresh = null;
  });
  return pendingRefresh;
}

/** Test-only: forget any in-flight refresh. */
export function resetRefreshState(): void {
  pendingRefresh = null;
}
