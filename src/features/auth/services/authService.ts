import { http } from '@/lib/api/client';
import { isApiConfigured } from '@/lib/api/config';

export { isApiConfigured };

export interface OtpChallenge {
  challengeId: string;
  expiresIn?: number;
  resendAfter?: number;
  target?: string;
}

/**
 * The web form shows +27 beside the national number. The API requires E.164.
 * Numbers that already include a country code are left unchanged.
 */
export function toWebPhone(input: string): string {
  const cleaned = input.trim().replace(/[\s\-().]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('00')) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith('0')) return `+27${cleaned.slice(1)}`;
  return `+27${cleaned}`;
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

export function requestWebOtp(input: {
  mode: 'login' | 'signup';
  method: 'mobile' | 'email' | 'whatsapp';
  identifier: string;
  fullName: string;
  role: 'buyer' | 'seller' | 'both';
  email?: string;
  mobile?: string;
}): Promise<OtpChallenge> {
  if (input.mode === 'signup') {
    const email = input.method === 'email' ? input.identifier.trim() : input.email?.trim() || undefined;
    const mobile = input.method === 'email' ? (input.mobile ? toWebPhone(input.mobile) : undefined) : toWebPhone(input.identifier);
    return http.post<OtpChallenge>('/auth/register', {
      method: input.method,
      email,
      mobile,
      fullName: input.fullName,
      role: input.role,
      country: 'ZA',
      acceptedTermsVersion: '1',
    });
  }
  const identifier = input.method === 'email' ? input.identifier.trim() : toWebPhone(input.identifier);
  return http.post<OtpChallenge>('/auth/otp/request', {
    method: input.method,
    identifier,
    intent: 'login',
  });
}

export function verifyWebOtp(challengeId: string, code: string): Promise<VerifiedSession> {
  return http.post<VerifiedSession>('/auth/otp/verify', { challengeId, code });
}

export function resendWebOtp(challengeId: string): Promise<OtpChallenge> {
  return http.post<OtpChallenge>('/auth/otp/resend', { challengeId });
}
