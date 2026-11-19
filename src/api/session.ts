import { uuidv4 } from '../lib/uuid';

/**
 * Browser session state.
 *
 * - Access token: IN MEMORY ONLY (never localStorage / sessionStorage / cookies readable by JS).
 * - Refresh token: an HttpOnly `mb_refresh` cookie set by the backend (path `/v2/auth`, SameSite=Strict).
 *   JavaScript can neither read nor send it by hand - requests to `/auth/*` use `credentials: 'include'` and the
 *   browser attaches it. The web `/auth/refresh` therefore takes no body token (mobile sends one in the body).
 * - A non-secret "session hint" flag in localStorage tells us whether a refresh cookie is likely to exist, so an
 *   anonymous visitor does not trigger a pointless (401) refresh call on every page load.
 * - deviceId: a random install id in localStorage (non-secret).
 */
const KEY_DEVICE = 'mb.web.deviceId';
const KEY_HINT = 'mb.web.sessionHint';

type State = {
  accessToken: string | null;
  deviceId: string | null;
  /** epoch ms when the in-memory access token expires. */
  accessExpiresAt: number | null;
  /** true when the last known state was "signed in" (a refresh cookie probably exists). */
  hint: boolean;
};

const state: State = { accessToken: null, deviceId: null, accessExpiresAt: null, hint: false };
let hydrated = false;

export type SessionEvent = 'signed-in' | 'refreshed' | 'cleared' | 'expired';
const listeners = new Set<(event: SessionEvent) => void>();

/** Subscribe to session lifecycle events (e.g. the controller returns to Welcome on `expired`). */
export function subscribeSession(listener: (event: SessionEvent) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit(event: SessionEvent): void {
  listeners.forEach(l => {
    try {
      l(event);
    } catch {
      /* listener errors must never break the auth flow */
    }
  });
}

const store = (): Storage | null => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
};

/** Load the device id + session hint into memory. Safe to call many times; resolves immediately in the browser. */
export function hydrateSession(): Promise<void> {
  if (!hydrated && typeof window !== 'undefined') {
    hydrated = true;
    const ls = store();
    try {
      state.deviceId = ls?.getItem(KEY_DEVICE) ?? null;
      state.hint = ls?.getItem(KEY_HINT) === '1';
    } catch {
      /* storage unavailable: continue with an empty in-memory session */
    }
  }
  return Promise.resolve();
}

export const getAccessToken = (): string | null => state.accessToken;
/** True when we hold an access token or believe a refresh cookie exists. */
export const hasSession = (): boolean => Boolean(state.accessToken || state.hint);
/** True when a `/auth/refresh` call can plausibly succeed (cookie hint). */
export const canRefresh = (): boolean => state.hint;

/** ms until the access token expires, or null when unknown / absent. */
export const accessTokenTtlMs = (): number | null =>
  state.accessToken && state.accessExpiresAt !== null ? state.accessExpiresAt - Date.now() : null;

/** Stable per-browser device id (generated on first use, survives sign-out). */
export async function getDeviceId(): Promise<string> {
  await hydrateSession();
  if (state.deviceId) return state.deviceId;
  const id = uuidv4();
  state.deviceId = id;
  try {
    store()?.setItem(KEY_DEVICE, id);
  } catch {
    /* non-fatal */
  }
  return id;
}

const setHint = (on: boolean) => {
  state.hint = on;
  try {
    const ls = store();
    if (on) ls?.setItem(KEY_HINT, '1');
    else ls?.removeItem(KEY_HINT);
  } catch {
    /* non-fatal */
  }
};

export interface TokenInput {
  accessToken: string;
  /** Seconds, as returned by the backend (`expiresIn`, ~900). */
  expiresIn?: number;
}

export async function setTokens(input: TokenInput, event: SessionEvent = 'signed-in'): Promise<void> {
  await hydrateSession();
  state.accessToken = input.accessToken;
  state.accessExpiresAt = input.expiresIn ? Date.now() + input.expiresIn * 1000 : null;
  setHint(true);
  emit(event);
}

/** Update only the access token (kept for parity with the mobile API). */
export const setAccessToken = (accessToken: string, expiresIn?: number): Promise<void> => setTokens({ accessToken, expiresIn }, 'refreshed');

/** Forget the in-memory token + hint. `reason: 'expired'` notifies listeners so the UI can sign out. */
export async function clearSession(reason: 'cleared' | 'expired' = 'cleared'): Promise<void> {
  await hydrateSession();
  const had = hasSession();
  state.accessToken = null;
  state.accessExpiresAt = null;
  setHint(false);
  if (had || reason === 'cleared') emit(reason);
}
