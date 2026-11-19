import { api } from '../api';
import type { CreateThreadBody, FaqsResponse, SupportMessage, SupportThread, SupportThreadSummary } from '../api';

/** GET /support/faqs (public) -> FAQs + support contacts. */
export const getFaqs = (signal?: AbortSignal): Promise<FaqsResponse> => api.get<FaqsResponse>('/support/faqs', { signal });

/** GET /support/threads. */
export const listThreads = (signal?: AbortSignal): Promise<{ items: SupportThreadSummary[]; total: number }> =>
  api.get<{ items: SupportThreadSummary[]; total: number }>('/support/threads', { signal });

/** POST /support/threads (201). `topic` is one of general | other_payment_method | order | sell. */
export const createThread = (body: CreateThreadBody): Promise<SupportThread> => api.post<SupportThread>('/support/threads', body);

/** GET /support/threads/:ref. */
export const getThread = (ref: string, signal?: AbortSignal): Promise<SupportThread> =>
  api.get<SupportThread>(`/support/threads/${encodeURIComponent(ref)}`, { signal });

/** POST /support/threads/:ref/messages (201) -> the created message. */
export const postMessage = (ref: string, body: string): Promise<SupportMessage> =>
  api.post<SupportMessage>(`/support/threads/${encodeURIComponent(ref)}/messages`, { body });
