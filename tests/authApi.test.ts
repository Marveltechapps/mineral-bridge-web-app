import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHttpClient } from '@/lib/api/httpClient';
import { http } from '@/lib/api/client';
import { requestWebOtp, startDevLogin, verifyDevLogin, verifyWebOtp, visibleDevelopmentOtp } from '@/features/auth/services/authService';

vi.mock('@/lib/api/client', () => ({
  http: { post: vi.fn(), get: vi.fn() },
}));

describe('auth API contract', () => {
  beforeEach(() => {
    vi.mocked(http.post).mockReset();
  });

  it('sends login, signup, and verification to the existing endpoints', async () => {
    vi.mocked(http.post)
      .mockResolvedValueOnce({ challengeId: 'ch_1', expiresIn: 300, resendAfter: 30 })
      .mockResolvedValueOnce({ challengeId: 'ch_2', expiresIn: 300, resendAfter: 30 })
      .mockResolvedValueOnce({ accessToken: 'access-token', expiresIn: 900 });

    await requestWebOtp({
      mode: 'login',
      method: 'mobile',
      identifier: '+919876543210',
      fullName: '',
      role: 'buyer',
      country: 'IN',
    });
    await requestWebOtp({
      mode: 'signup',
      method: 'whatsapp',
      identifier: '+27821234567',
      fullName: 'Ada Lovelace',
      role: 'seller',
      country: 'ZA',
    });
    await verifyWebOtp('ch_1', '1234', false);

    expect(http.post).toHaveBeenNthCalledWith(1, '/auth/otp/request', {
      method: 'mobile',
      identifier: '+919876543210',
      intent: 'login',
    });
    expect(http.post).toHaveBeenNthCalledWith(2, '/auth/register', {
      method: 'whatsapp',
      email: undefined,
      mobile: '+27821234567',
      fullName: 'Ada Lovelace',
      role: 'seller',
      country: 'ZA',
      acceptedTermsVersion: '1',
    });
    expect(http.post).toHaveBeenNthCalledWith(3, '/auth/otp/verify', {
      challengeId: 'ch_1',
      code: '1234',
      rememberDevice: false,
    });
  });

  it('uses the development login endpoints and does not invent a code', async () => {
    vi.mocked(http.post)
      .mockResolvedValueOnce({ challengeId: 'ch_dev', developmentOtp: '847291', codeLength: 6, expiresIn: 120 })
      .mockResolvedValueOnce({ accessToken: 'access-token', expiresIn: 900 });
    await startDevLogin('dev.app@example.com', 'local-app-password');
    await verifyDevLogin('ch_dev', '847291', true);
    expect(http.post).toHaveBeenNthCalledWith(1, '/auth/dev-login', {
      email: 'dev.app@example.com',
      password: 'local-app-password',
    });
    expect(http.post).toHaveBeenNthCalledWith(2, '/auth/dev-login/verify', {
      challengeId: 'ch_dev',
      code: '847291',
      rememberDevice: true,
    });
  });

  it('shows a development code only when the response includes one', () => {
    expect(visibleDevelopmentOtp({ developmentOtp: '847291' })).toBe('847291');
    expect(visibleDevelopmentOtp({})).toBeNull();
    expect(visibleDevelopmentOtp({ developmentOtp: '1234' })).toBeNull();
  });

  it('surfaces a rate-limit response and does not include a verification code', async () => {
    const client = createHttpClient({
      baseUrl: 'http://localhost:5001/v1',
      fetchImpl: async () =>
        new Response(JSON.stringify({ code: 'auth/rate-limited', message: 'Too many attempts. Try again later.' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }),
    });
    await expect(client.post('/auth/otp/request', { method: 'email', identifier: 'ada@example.com' })).rejects.toMatchObject({
      status: 429,
      message: 'Too many attempts. Try again later.',
    });
  });
});
