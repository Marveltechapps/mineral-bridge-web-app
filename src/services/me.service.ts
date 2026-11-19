import { api } from '../api';
import type {
  BusinessTypeBody,
  ContactChangeBody,
  HomeSummary,
  Me,
  MePatchBody,
  NotificationPrefs,
  OtpChallenge,
} from '../api';

/** Contact-change challenges return the id + masked destination (plus the dev-only code / resend time when present). */
export type ContactChangeChallenge = Pick<OtpChallenge, 'challengeId' | 'maskedDestination'> & Partial<Pick<OtpChallenge, 'resendAvailableAt' | 'developmentOtp'>>;

/** GET /me. */
export const getMe = (signal?: AbortSignal): Promise<Me> => api.get<Me>('/me', { signal });

/** PATCH /me (fullName / businessName / countryCode; at least one). */
export const patchMe = (body: MePatchBody): Promise<Me> => api.patch<Me>('/me', body);

/** POST /me/contact-change (202) - sends an OTP to the new contact. */
export const contactChange = (body: ContactChangeBody): Promise<ContactChangeChallenge> =>
  api.post<ContactChangeChallenge>('/me/contact-change', body);

/** POST /me/contact-change/verify. */
export const verifyContactChange = (challengeId: string, code: string): Promise<Me> =>
  api.post<Me>('/me/contact-change/verify', { challengeId, code });

/** PUT /me/business-type. */
export const putBusinessType = (body: BusinessTypeBody): Promise<Me> => api.put<Me>('/me/business-type', body);

/** GET /me/summary (home dashboard counts). */
export const getSummary = (signal?: AbortSignal): Promise<HomeSummary> => api.get<HomeSummary>('/me/summary', { signal });

/** GET /me/notification-preferences. */
export const getPrefs = (signal?: AbortSignal): Promise<NotificationPrefs> =>
  api.get<NotificationPrefs>('/me/notification-preferences', { signal });

/** PATCH /me/notification-preferences (at least one key). */
export const patchPrefs = (body: Partial<NotificationPrefs>): Promise<NotificationPrefs> =>
  api.patch<NotificationPrefs>('/me/notification-preferences', body);
