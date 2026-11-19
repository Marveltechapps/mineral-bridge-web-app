import { api, setTokens, clearSession, getDeviceId } from '../api';
import type {
  AuthSession,
  OtpChallenge,
  OtpChannel,
  OtpRequestBody,
  OtpVerifyBody,
  OtpVerifyResult,
  RegisterBody,
  SignedIn,
} from '../api';
import { refreshSession } from '../api/client';

const PUBLIC = { auth: false } as const;

/** Human-readable device label for the sessions list (browser family only, no fingerprinting). */
function browserName(): string {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const b = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  return `${b} (web)`;
}

/** POST /auth/otp/request (202). `fullName` is required for `intent: 'signup'`. */
export const requestOtp = (body: OtpRequestBody, signal?: AbortSignal): Promise<OtpChallenge> =>
  api.post<OtpChallenge>('/auth/otp/request', body, { ...PUBLIC, signal });

/** POST /auth/otp/resend (202). */
export const resendOtp = (challengeId: string, channel?: OtpChannel, signal?: AbortSignal): Promise<OtpChallenge> =>
  api.post<OtpChallenge>('/auth/otp/resend', { challengeId, ...(channel ? { channel } : {}) }, { ...PUBLIC, signal });

/**
 * POST /auth/otp/verify. Returns `needs_registration` (call `register`) or `signed_in`.
 * On `signed_in` the access token is stored in memory; the server sets the HttpOnly `mb_refresh` cookie.
 */
export async function verifyOtp(
  input: { challengeId: string; code: string; keepSignedIn?: boolean },
  signal?: AbortSignal,
): Promise<OtpVerifyResult> {
  const body: OtpVerifyBody = {
    challengeId: input.challengeId,
    code: input.code,
    keepSignedIn: input.keepSignedIn ?? true,
    device: { id: await getDeviceId(), platform: 'web', name: browserName() },
  };
  const res = await api.post<OtpVerifyResult>('/auth/otp/verify', body, { ...PUBLIC, signal });
  if (res.status === 'signed_in') await storeSignedIn(res);
  return res;
}

/** POST /auth/register (201). Consumes the `registrationToken` from `verifyOtp`. Stores the access token. */
export async function register(body: RegisterBody, signal?: AbortSignal): Promise<SignedIn> {
  const res = await api.post<SignedIn>('/auth/register', body, { ...PUBLIC, signal });
  await storeSignedIn(res);
  return res;
}

async function storeSignedIn(res: SignedIn): Promise<void> {
  // The web backend sets the HttpOnly refresh cookie itself (we sent `credentials: 'include'`); no refresh token is
  // returned to JavaScript. Only the access token is held, in memory.
  await setTokens({ accessToken: res.accessToken, expiresIn: res.expiresIn }, 'signed-in');
}

/** POST /auth/refresh via the refresh cookie (single-flight; also done automatically by the client). */
export async function refresh(): Promise<void> {
  await refreshSession();
}

/** POST /auth/logout (204; revokes the session and clears the cookie). Always clears local state, even if it fails. */
export async function logout(): Promise<void> {
  try {
    await api.post<void>('/auth/logout', {});
  } catch {
    /* sign out locally regardless (offline / already-expired session) */
  } finally {
    await clearSession('cleared');
  }
}

/** GET /auth/sessions. */
export const listSessions = (signal?: AbortSignal): Promise<AuthSession[]> =>
  api.get<{ items: AuthSession[] }>('/auth/sessions', { signal }).then(r => r.items);

/** DELETE /auth/sessions/:id (204). */
export const revokeSession = (id: string): Promise<void> => api.delete<void>(`/auth/sessions/${encodeURIComponent(id)}`);
