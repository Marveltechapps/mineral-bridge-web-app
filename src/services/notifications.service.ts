import { api } from '../api';
import type { NotificationsPage, RegisterDeviceBody } from '../api';

/** GET /notifications. */
export const listNotifications = (
  query: { unread?: boolean; cursor?: string; limit?: number } = {},
  signal?: AbortSignal,
): Promise<NotificationsPage> =>
  api.get<NotificationsPage>('/notifications', {
    query: { unread: query.unread === undefined ? undefined : String(query.unread), cursor: query.cursor, limit: query.limit },
    signal,
  });

/** POST /notifications/:id/read -> `{ unreadCount }`. */
export const markRead = (id: string): Promise<{ unreadCount: number }> =>
  api.post<{ unreadCount: number }>(`/notifications/${encodeURIComponent(id)}/read`);

/** POST /notifications/read-all -> `{ unreadCount }`. */
export const markAllRead = (): Promise<{ unreadCount: number }> => api.post<{ unreadCount: number }>('/notifications/read-all');

/** POST /devices (201) - register an FCM/APNs push token. */
export const registerDevice = (body: RegisterDeviceBody): Promise<{ ok: true }> => api.post<{ ok: true }>('/devices', body);

/** DELETE /devices/:token (204). */
export const unregisterDevice = (token: string): Promise<void> => api.delete<void>(`/devices/${encodeURIComponent(token)}`);
