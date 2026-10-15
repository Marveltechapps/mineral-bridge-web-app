/**
 * Where the session lives: in memory, for the lifetime of the tab.
 *
 * ARCHITECTURE.md §8. The access token is **never** written to `localStorage`,
 * `sessionStorage` or a readable cookie — anything a script can read, a script
 * injected into the page can steal. Keeping it in a module variable means a
 * refresh of the page starts anonymous and recovers the session from the
 * refresh cookie instead (see `./session`).
 *
 * The refresh token is not here at all. In the target model it is an httpOnly
 * cookie the server sets, which this code cannot read by design.
 */

/**
 * `demo` is the state the application is in today: the click-through sign-in
 * flow marks someone as signed in, but there is no server and therefore no
 * credential. It is kept distinct from `authenticated` so that
 * `getAccessToken()` returns `null` for it — a placeholder must never be sent
 * to a real server as if it were a credential.
 */
export type SessionStatus = 'anonymous' | 'demo' | 'authenticated';

/**
 * Why a session is anonymous. The interface treats the two differently: an
 * expired session re-opens the login overlay so the person can carry on where
 * they were, while someone who chose to log out is left alone.
 */
export type SessionEndReason = 'signed-out' | 'expired';

export interface Session {
  status: SessionStatus;
  /** Present only when `status` is `authenticated`. */
  accessToken: string | null;
  /** Epoch milliseconds, when the server told us. */
  expiresAt: number | null;
  /** Set only while `status` is `anonymous`; `null` before any session existed. */
  endedBy: SessionEndReason | null;
}

export const ANONYMOUS: Session = {
  status: 'anonymous',
  accessToken: null,
  expiresAt: null,
  endedBy: null,
};

let current: Session = ANONYMOUS;

type Listener = (session: Session) => void;
const listeners = new Set<Listener>();

export function getSession(): Session {
  return current;
}

/** The token for the `Authorization` header, or `null` when there is none to send. */
export function getAccessToken(): string | null {
  return current.status === 'authenticated' ? current.accessToken : null;
}

/** True when the interface should present someone as signed in. */
export function isSignedIn(): boolean {
  return current.status !== 'anonymous';
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Replaces the session and notifies subscribers.
 *
 * A listener that throws must not stop the others from being told, nor leave
 * the store half-updated: the state is committed first and every listener is
 * called, errors reported separately.
 */
export function setSession(next: Session): void {
  const unchanged =
    current.status === next.status &&
    current.accessToken === next.accessToken &&
    current.expiresAt === next.expiresAt &&
    current.endedBy === next.endedBy;
  if (unchanged) return;

  current = next;
  for (const listener of [...listeners]) {
    try {
      listener(current);
    } catch (error) {
      // Reported, not swallowed, and never allowed to break the fan-out.
      console.error('A session listener threw', error);
    }
  }
}

/** Test-only reset, so one spec cannot leak a session into the next. */
export function resetSessionStore(): void {
  current = ANONYMOUS;
  listeners.clear();
}
