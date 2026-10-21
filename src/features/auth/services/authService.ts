import { http } from '@/lib/api/client';
import { isApiConfigured } from '@/lib/api/config';

export { isApiConfigured };

export interface OtpChallenge {
  challengeId: string;
  expiresIn?: number;
  resendAfter?: number;
  target?: string;
  codeLength?: number;
  /** Present only when the backend enabled local development delivery. */
  developmentOtp?: string;
}

/** The code is shown only when the server put a six-digit development code on this response. */
export function visibleDevelopmentOtp(challenge: { developmentOtp?: string } | null | undefined): string | null {
  const code = challenge?.developmentOtp;
  return typeof code === 'string' && /^\d{6}$/.test(code) ? code : null;
}


export function authErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

export function isAccountMissing(error: unknown): boolean {
  return authErrorCode(error) === 'auth/account-not-found';
}

/** The provider did not accept the code, so another method can still be chosen. */
export function isDeliveryFailure(error: unknown): boolean {
  const code = authErrorCode(error);
  return (
    code === 'otp/provider-unavailable' ||
    code === 'email/provider-unavailable' ||
    code === 'auth/invalid-phone' ||
    code === 'sms/provider-unconfigured' ||
    code === 'sms/provider-down' ||
    code === 'sms/provider-error'
  );
}

export function formatAuthError(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'fields' in error) {
    const fields = (error as { fields?: Record<string, string> }).fields;
    const first = fields && Object.values(fields).find((value) => typeof value === 'string' && value);
    if (first) return first;
  }
  return error instanceof Error && error.message ? error.message : fallback;
}

export interface VerifiedSession {
  accessToken: string;
  expiresIn?: number;
  isNewAccount?: boolean;
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  user?: { fullName?: string; email?: string; mobile?: string; countryName?: string; companyName?: string | null; role?: string };
}

export function fetchVerificationOptions(): Promise<{ email: boolean; sms: boolean }> {
  return http.get<{ email: boolean; sms: boolean }>('/auth/verification-options');
}

export function requestWebOtp(input: {
  mode: 'login' | 'signup';
  method: 'mobile' | 'email' | 'whatsapp';
  identifier: string;
  fullName: string;
  role: 'buyer' | 'seller' | 'both';
  /** ISO 3166-1 alpha-2 from the country selector. */
  country: string;
  email?: string;
  /** Already normalized to E.164. */
  mobile?: string;
}): Promise<OtpChallenge> {
  if (input.mode === 'signup') {
    const email = input.method === 'email' ? input.identifier.trim() : input.email?.trim() || undefined;
    const mobile = input.method === 'email' ? input.mobile : input.identifier;
    return http.post<OtpChallenge>('/auth/register', {
      method: input.method,
      email,
      mobile,
      fullName: input.fullName,
      role: input.role,
      country: input.country,
      acceptedTermsVersion: '1',
    });
  }
  return http.post<OtpChallenge>('/auth/otp/request', {
    method: input.method,
    identifier: input.identifier,
    intent: 'login',
  });
}

export function verifyWebOtp(
  challengeId: string,
  code: string,
  rememberDevice: boolean,
): Promise<VerifiedSession> {
  return http.post<VerifiedSession>('/auth/otp/verify', { challengeId, code, rememberDevice });
}

export function resendWebOtp(challengeId: string): Promise<OtpChallenge> {
  return http.post<OtpChallenge>('/auth/otp/resend', { challengeId });
}

export interface DevLoginStatus {
  enabled: boolean;
  codeLength?: number;
}

export interface DevLoginChallenge {
  challengeId: string;
  expiresIn: number;
  codeLength: number;
  developmentOtp: string;
}

/** Asks the backend. The screen stays hidden until this says the feature is on. */
export function fetchDevLoginStatus(): Promise<DevLoginStatus> {
  return http.get<DevLoginStatus>('/auth/dev-login');
}

export function startDevLogin(email: string, password: string): Promise<DevLoginChallenge> {
  return http.post<DevLoginChallenge>('/auth/dev-login', { email, password });
}

export function verifyDevLogin(
  challengeId: string,
  code: string,
  rememberDevice: boolean,
): Promise<VerifiedSession> {
  return http.post<VerifiedSession>('/auth/dev-login/verify', { challengeId, code, rememberDevice });
}
