/**
 * Realtime helpers.
 *
 *  - Notifications: SSE at `GET /v2/notifications/stream` (events: notification.created,
 *    order.stage_changed, kyc.decided, session.revoked, ...). The endpoint requires an Authorization
 *    header, which the browser `EventSource` cannot send, so SSE is read from a streaming `fetch` body.
 *    If SSE cannot stay connected, the stream transparently falls back to polling
 *    `GET /v2/notifications` every 20 s.
 *  - Auctions: native WebSocket (NOT Socket.io). Backend path is `/v1/ws/auctions/:auctionId` even though
 *    REST is `/v2`. Auth + subprotocol: `Sec-WebSocket-Protocol: mineralbridge.v1, bearer.<accessToken>`.
 *    `auctionId` must be the auction `id` (AuctionDetail.id), not the human `reference`.
 */
import { API_BASE_URL, WS_BASE_URL, canRefresh, getAccessToken } from '../api';
import type { AuctionWsEvent, NotificationStreamEvent } from '../api';
import { baseHeaders, refreshSession } from '../api/client';
import { listNotifications } from './notifications.service';

type TokenSource = string | null | (() => string | null);
const resolveToken = (t: TokenSource): string | null => (typeof t === 'function' ? t() : t);

export interface RealtimeHandle {
  close(): void;
}

/* ------------------------------ Notifications (SSE + poll fallback) ------------------------------ */

export type NotificationStreamStatus = 'connecting' | 'open' | 'polling' | 'closed';

export interface NotificationStreamOptions {
  onStatus?: (status: NotificationStreamStatus) => void;
  onError?: (error: unknown) => void;
  /** Poll interval when SSE is unavailable (default 20 000 ms). */
  pollIntervalMs?: number;
  /** SSE failures (without any received data) before switching to polling. Default 3. */
  maxSseFailures?: number;
}

const DEFAULT_POLL_MS = 20_000;

/** Incremental `text/event-stream` parser. Feed it chunks; it emits complete events. */
export function createSseParser(onEvent: (e: NotificationStreamEvent) => void) {
  let buffer = '';
  return (chunk: string) => {
    buffer += chunk.replace(/\r\n/g, '\n');
    let idx: number;
    while ((idx = buffer.indexOf('\n\n')) >= 0) {
      const block = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      let id: string | undefined;
      let event = 'message';
      const data: string[] = [];
      for (const line of block.split('\n')) {
        if (!line || line.startsWith(':')) continue;
        const c = line.indexOf(':');
        const field = c < 0 ? line : line.slice(0, c);
        const value = c < 0 ? '' : line.slice(c + 1).replace(/^ /, '');
        if (field === 'id') id = value;
        else if (field === 'event') event = value;
        else if (field === 'data') data.push(value);
      }
      if (!data.length) continue;
      let parsed: Record<string, unknown> = {};
      try {
        const j: unknown = JSON.parse(data.join('\n'));
        if (j && typeof j === 'object') parsed = j as Record<string, unknown>;
      } catch {
        parsed = { raw: data.join('\n') };
      }
      onEvent({ id, event, data: parsed });
    }
  };
}

/**
 * Subscribe to the signed-in user's notification/event stream.
 * `accessToken` may be a string or a getter (preferred - the token rotates every ~15 min).
 * Returns a handle; call `close()` on sign-out / unmount.
 */
export function connectNotificationStream(
  accessToken: TokenSource,
  onEvent: (event: NotificationStreamEvent) => void,
  options: NotificationStreamOptions = {},
): RealtimeHandle {
  const pollMs = options.pollIntervalMs ?? DEFAULT_POLL_MS;
  const maxFailures = options.maxSseFailures ?? 3;
  let closed = false;
  let abortCtrl: AbortController | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let lastEventId: string | undefined;
  let failures = 0;
  let backoff = 1000;
  let polling = false;
  const seen = new Set<string>();
  let seeded = false;

  const status = (s: NotificationStreamStatus) => options.onStatus?.(s);

  const poll = async () => {
    try {
      const page = await listNotifications({ unread: true, limit: 30 });
      for (const n of page.items) {
        if (seen.has(n.id)) continue;
        seen.add(n.id);
        if (seeded) onEvent({ id: n.id, event: 'notification.created', data: { ...n } as unknown as Record<string, unknown> });
      }
      seeded = true;
      onEvent({ event: 'notification.sync', data: { unreadCount: page.unreadCount } });
    } catch (e) {
      options.onError?.(e);
    }
  };

  const startPolling = () => {
    if (polling || closed) return;
    polling = true;
    status('polling');
    void poll();
    pollTimer = setInterval(() => void poll(), pollMs);
  };

  const scheduleReconnect = () => {
    if (closed || polling) return;
    if (failures >= maxFailures) return startPolling();
    retryTimer = setTimeout(() => void open(), backoff);
    backoff = Math.min(backoff * 2, 15_000);
  };

  const open = async () => {
    if (closed || polling) return;
    status('connecting');
    // The stream endpoint needs an Authorization header, which the browser EventSource cannot send, so the SSE body is
    // read from a streaming `fetch` instead.
    if (canRefresh() && !resolveToken(accessToken) && !getAccessToken()) {
      try {
        await refreshSession();
      } catch (e) {
        options.onError?.(e);
        failures = maxFailures;
        return scheduleReconnect();
      }
    }
    const token = resolveToken(accessToken) ?? getAccessToken();
    if (!token) {
      failures += 1;
      return scheduleReconnect();
    }
    if (closed) return;

    const ctrl = new AbortController();
    abortCtrl = ctrl;
    let gotData = false;
    const parse = createSseParser(ev => {
      if (ev.id) lastEventId = ev.id;
      onEvent(ev);
    });

    try {
      const headers = await baseHeaders({
        Accept: 'text/event-stream',
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${token}`,
        ...(lastEventId ? { 'Last-Event-ID': lastEventId } : {}),
      });
      const res = await fetch(`${API_BASE_URL}/notifications/stream`, { method: 'GET', headers, signal: ctrl.signal, cache: 'no-store' });

      if (res.status === 401 && canRefresh()) {
        try {
          await refreshSession();
          return void open();
        } catch (e) {
          options.onError?.(e);
          failures = maxFailures; // session is gone; polling will surface the same 401 to the app
          return scheduleReconnect();
        }
      }
      if (!res.ok || !res.body) {
        failures += 1; // e.g. 429 too many streams
        return scheduleReconnect();
      }

      status('open');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value && value.length) {
          gotData = true;
          failures = 0;
          backoff = 1000;
          parse(decoder.decode(value, { stream: true }));
        }
      }
      // Server closed the stream: reconnect quickly.
      if (!gotData) failures += 1;
      abortCtrl = null;
      scheduleReconnect();
    } catch (e) {
      abortCtrl = null;
      if (closed || (e instanceof Error && e.name === 'AbortError')) return;
      failures += 1;
      options.onError?.(e instanceof Error ? e : new Error('Notification stream connection failed'));
      scheduleReconnect();
    }
  };

  void open();

  return {
    close() {
      closed = true;
      status('closed');
      if (retryTimer) clearTimeout(retryTimer);
      if (pollTimer) clearInterval(pollTimer);
      try {
        abortCtrl?.abort();
      } catch {
        /* ignore */
      }
      abortCtrl = null;
    },
  };
}

/* ------------------------------ Auctions (WebSocket) ------------------------------ */

export const WS_SUBPROTOCOL = 'mineralbridge.v1';

export interface AuctionWsHandlers {
  onOpen?: () => void;
  onEvent: (event: AuctionWsEvent) => void;
  onClose?: (info: { code?: number; reason?: string; willReconnect: boolean }) => void;
  onError?: (error: unknown) => void;
}

export interface AuctionWsHandle extends RealtimeHandle {
  isOpen(): boolean;
  /** Send `{ event: 'ping' }`; server replies with `pong`. */
  ping(): void;
}

/**
 * Open `ws(s)://<host>/v1/ws/auctions/:auctionId` and stream bid/extension/closed frames.
 * Reconnects with backoff (token re-read on every attempt; refreshed once if the upgrade is rejected).
 * Close the handle when the auction screen unmounts.
 */
export function connectAuctionWs(
  auctionId: string,
  accessToken: TokenSource,
  handlers: AuctionWsHandlers,
): AuctionWsHandle {
  let closed = false;
  let ws: WebSocket | null = null;
  let open = false;
  let attempts = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  let triedRefresh = false;

  const url = `${WS_BASE_URL}/v1/ws/auctions/${encodeURIComponent(auctionId)}`;

  const stopHeartbeat = () => {
    if (heartbeat) clearInterval(heartbeat);
    heartbeat = null;
  };

  const connect = () => {
    if (closed) return;
    const token = resolveToken(accessToken) ?? getAccessToken();
    if (!token) {
      handlers.onError?.(new Error('Sign in required for live auction updates'));
      return;
    }
    let everOpened = false;
    const sock = new WebSocket(url, [WS_SUBPROTOCOL, `bearer.${token}`]);
    ws = sock;

    sock.onopen = () => {
      everOpened = true;
      open = true;
      attempts = 0;
      triedRefresh = false;
      stopHeartbeat();
      heartbeat = setInterval(() => {
        if (sock.readyState === 1) sock.send(JSON.stringify({ event: 'ping' }));
      }, 25_000);
      handlers.onOpen?.();
    };
    sock.onmessage = msg => {
      try {
        const frame = JSON.parse(String(msg.data)) as AuctionWsEvent;
        if (frame && typeof frame.event === 'string') handlers.onEvent(frame);
      } catch {
        /* ignore malformed frame */
      }
    };
    sock.onerror = e => handlers.onError?.(e);
    sock.onclose = async ev => {
      open = false;
      stopHeartbeat();
      ws = null;
      const willReconnect = !closed;
      handlers.onClose?.({ code: ev?.code, reason: ev?.reason, willReconnect });
      if (closed) return;
      // Upgrade rejected before opening usually means an expired access token -> refresh once.
      if (!everOpened && !triedRefresh && canRefresh()) {
        triedRefresh = true;
        try {
          await refreshSession();
          return connect();
        } catch {
          return;
        }
      }
      if (ev?.code === 1008) return; // rate-limited by server; do not hammer
      attempts += 1;
      const delay = Math.min(1000 * 2 ** Math.min(attempts, 5), 30_000);
      retryTimer = setTimeout(connect, delay);
    };
  };

  connect();

  return {
    close() {
      closed = true;
      if (retryTimer) clearTimeout(retryTimer);
      stopHeartbeat();
      try {
        ws?.close(1000, 'client closed');
      } catch {
        /* ignore */
      }
      ws = null;
      open = false;
    },
    isOpen: () => open,
    ping() {
      if (ws && open) ws.send(JSON.stringify({ event: 'ping' }));
    },
  };
}
