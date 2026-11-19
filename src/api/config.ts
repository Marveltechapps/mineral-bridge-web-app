/**
 * Browser configuration for the `/v2` API.
 *
 * `NEXT_PUBLIC_*` values are inlined by Next.js at build time and must be referenced by their literal name.
 * Nothing secret may ever be placed in them.
 */

const DEFAULT_API_BASE_URL = 'http://localhost:5001/v2';

const rawApi = (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL).trim();
const rawWs = (process.env.NEXT_PUBLIC_WS_BASE_URL || '').trim();

/** REST base (includes `/v2`, no trailing slash). May be a same-origin path such as `/v2` (see `API_PROXY_TARGET`). */
export const API_BASE_URL: string = rawApi.replace(/\/+$/, '');

/**
 * WebSocket ORIGIN (no path). The auction socket lives at `/v1/ws/auctions/:id` on the raw HTTP server, so only the
 * origin is configured here. When unset it is derived from an absolute API base URL (http -> ws, https -> wss).
 */
export function resolveWsBase(): string {
  if (rawWs) return rawWs.replace(/\/+$/, '');
  const m = /^(https?):\/\/([^/?#]+)/i.exec(API_BASE_URL);
  if (m) return `${m[1]!.toLowerCase() === 'https' ? 'wss' : 'ws'}://${m[2]}`;
  if (typeof window !== 'undefined') return `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`;
  return '';
}
export const WS_BASE_URL: string = resolveWsBase();

export const CLIENT_VERSION: string = process.env.NEXT_PUBLIC_CLIENT_VERSION || '0.1.0';
export const IS_PROD: boolean = process.env.NODE_ENV === 'production';

/** Value of the `X-Client` header. The backend accepts `web` or the `mineralbridge-web` prefix. */
export const CLIENT_HEADER = `mineralbridge-web/${CLIENT_VERSION}`;

/** Value of the `X-Platform` header. */
export const PLATFORM_HEADER = 'web' as const;

/** Default request timeout in ms. Uploads use `UPLOAD_TIMEOUT_MS`. */
export const REQUEST_TIMEOUT_MS = 30_000;
export const UPLOAD_TIMEOUT_MS = 120_000;
