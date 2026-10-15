/**
 * The only place `fetch` appears in this application.
 *
 * Everything above it — feature services, view models, pages — goes through
 * `http`, so base URL, JSON encoding, error shape, timeouts, cancellation and
 * (later) the `Authorization` header are decided once.
 *
 *     view model  ->  feature service  ->  lib/api/httpClient  ->  backend
 *
 * See ARCHITECTURE.md §5.1. The base URL comes from `VITE_API_BASE_URL`, which
 * Vite bakes in at build time; it is read per request so a test can stub it.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * AUTH SEAM (ARCHITECTURE.md §8) — deliberately not implemented: there is no
 * backend and no `lib/auth/` yet. Two hooks are reserved here, and this is the
 * only file that should ever grow them:
 *
 *   1. `getAccessToken` — called before every request; when it returns a token
 *      the `Authorization: Bearer <token>` header is set. Wire it up from
 *      `lib/auth/` (access token in memory, never `localStorage`).
 *
 *   2. Refresh-on-401 — NOT built. The one place it belongs is marked
 *      `AUTH SEAM: refresh-on-401` inside `request()` below. The contract it
 *      must implement: on a 401, refresh once, replay the original request
 *      (same method, URL, body and signal), and if the refresh or the replay
 *      fails, reject with the 401 `ApiError` so the login overlay can open.
 *      A single in-flight refresh must be shared by concurrent requests, or a
 *      screen with four queries will fire four refreshes and invalidate its own
 *      new token.
 *
 * Nothing else about auth belongs in this file, and no other file may read the
 * token to set a header of its own.
 * ──────────────────────────────────────────────────────────────────────────────
 */
import {
  ApiError,
  CLIENT_ERROR_CODES,
  NO_RESPONSE_STATUS,
  TIMEOUT_STATUS,
} from '@/lib/api/ApiError';
import type { QueryParams, QueryValue, RequestOptions } from '@/lib/api/types';

/** Default request timeout. Long enough for a slow document upload to finish. */
export const DEFAULT_TIMEOUT_MS = 15_000;

export interface HttpClientConfig {
  /** Overrides `VITE_API_BASE_URL`. Mainly for tests and for a future runtime config. */
  baseUrl?: string;
  /** Default timeout for every request this client makes. */
  timeoutMs?: number;
  /** Injected `fetch`, for tests. Resolved per request from `globalThis` otherwise. */
  fetchImpl?: typeof fetch;
  /** AUTH SEAM (§8): return the current access token, or `null` when signed out. */
  getAccessToken?: () => string | null | undefined;
}

export interface HttpClient {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestSpec extends RequestOptions {
  body?: unknown;
  hasBody?: boolean;
}

/* ── URL building ─────────────────────────────────────────────────────────── */

/** Serialises query parameters, dropping the ones a caller left unset. */
export function toSearchParams(query: QueryParams): URLSearchParams {
  const params = new URLSearchParams();
  const append = (key: string, value: QueryValue) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((item) => append(key, item));
      return;
    }
    params.append(key, String(value));
  };
  Object.entries(query).forEach(([key, value]) => append(key, value));
  return params;
}

function joinUrl(baseUrl: string, path: string, query?: QueryParams): string {
  // Joined by hand rather than with `new URL(path, base)`, which would discard a
  // path segment in the base (`https://api.example.com/v1`).
  const url = `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  const search = query ? toSearchParams(query).toString() : '';
  return search ? `${url}${url.includes('?') ? '&' : '?'}${search}` : url;
}

/* ── Response decoding ────────────────────────────────────────────────────── */

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined;
}

/**
 * Per-field messages from a `422`. Accepts both `{ qty: 'Too high' }` and the
 * `{ qty: ['Too high'] }` spelling frameworks commonly produce.
 */
function readFields(body: Record<string, unknown>): Record<string, string> | undefined {
  const raw = asRecord(body.fields) ?? asRecord(body.errors);
  if (!raw) return undefined;
  const fields: Record<string, string> = {};
  for (const [name, value] of Object.entries(raw)) {
    const message = Array.isArray(value) ? asString(value[0]) : asString(value);
    if (message) fields[name] = message;
  }
  return Object.keys(fields).length ? fields : undefined;
}

/** Reads a response body as JSON, or `undefined` when there is no body. */
async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205 || response.status === 304) {
    return undefined;
  }
  const text = await response.text();
  if (text.trim() === '') return undefined;
  return JSON.parse(text) as unknown;
}

/**
 * Builds the `ApiError` for a non-2xx response.
 *
 * The expected body is `{ code, message, fields? }`; `{ error: { code, message } }`
 * and `{ detail }` are read too, and a response that is not JSON at all (an HTML
 * error page from a proxy) still yields an error carrying the real status.
 */
async function errorFromResponse(response: Response): Promise<ApiError> {
  const body = asRecord(await readBody(response).catch(() => undefined));
  const nested = body ? asRecord(body.error) : undefined;
  const code =
    (body && asString(body.code)) ??
    (nested && asString(nested.code)) ??
    (body && asString(body.error)) ??
    `http/${response.status}`;
  const message =
    (body && (asString(body.message) ?? asString(body.detail))) ??
    (nested && asString(nested.message)) ??
    `Request failed (${response.status})`;
  return new ApiError(response.status, code, body ? readFields(body) : undefined, message);
}

/* ── Client ───────────────────────────────────────────────────────────────── */

export function createHttpClient(config: HttpClientConfig = {}): HttpClient {
  const resolveBaseUrl = (): string => {
    const baseUrl = (config.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? '').trim();
    if (!baseUrl) {
      throw new ApiError(
        NO_RESPONSE_STATUS,
        CLIENT_ERROR_CODES.configuration,
        undefined,
        'VITE_API_BASE_URL is not set, so no API request can be made. Set it in .env ' +
          'for this build — it is baked in at build time, not read at runtime.',
      );
    }
    return baseUrl;
  };

  async function request<T>(method: Method, path: string, spec: RequestSpec): Promise<T> {
    const url = joinUrl(resolveBaseUrl(), path, spec.query);
    const fetchImpl = config.fetchImpl ?? globalThis.fetch;
    const timeoutMs = spec.timeoutMs ?? config.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (spec.hasBody) headers['Content-Type'] = 'application/json';
    // AUTH SEAM (§8): the one place a request gets its credentials.
    const token = config.getAccessToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;
    Object.assign(headers, spec.headers ?? {});

    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    const abortFromCaller = () => controller.abort(spec.signal?.reason);
    if (spec.signal?.aborted) abortFromCaller();
    spec.signal?.addEventListener('abort', abortFromCaller);

    let response: Response;
    try {
      response = await fetchImpl(url, {
        method,
        headers,
        body: spec.hasBody ? JSON.stringify(spec.body) : undefined,
        signal: controller.signal,
      });
    } catch (error) {
      // The caller's cancellation is theirs: rethrow it unchanged so TanStack
      // Query and anything else awaiting it see a normal abort, not a failure.
      if (spec.signal?.aborted) throw error;
      if (timedOut) {
        throw new ApiError(
          TIMEOUT_STATUS,
          CLIENT_ERROR_CODES.timeout,
          undefined,
          `${method} ${path} timed out after ${timeoutMs}ms`,
        );
      }
      throw new ApiError(
        NO_RESPONSE_STATUS,
        CLIENT_ERROR_CODES.network,
        undefined,
        error instanceof Error ? error.message : `${method} ${path} could not be sent`,
      );
    } finally {
      clearTimeout(timer);
      spec.signal?.removeEventListener('abort', abortFromCaller);
    }

    if (!response.ok) {
      // AUTH SEAM: refresh-on-401 goes exactly here — see the file header for
      // the contract it has to meet. Until `lib/auth/` exists, a 401 is an
      // ordinary ApiError and the UI decides what to do with it.
      throw await errorFromResponse(response);
    }

    try {
      return (await readBody(response)) as T;
    } catch {
      throw new ApiError(
        response.status,
        CLIENT_ERROR_CODES.malformedResponse,
        undefined,
        `${method} ${path} returned a body that is not valid JSON`,
      );
    }
  }

  return {
    get: (path, options = {}) => request('GET', path, options),
    post: (path, body, options = {}) => request('POST', path, { ...options, body, hasBody: true }),
    patch: (path, body, options = {}) => request('PATCH', path, { ...options, body, hasBody: true }),
    delete: (path, options = {}) => request('DELETE', path, options),
  };
}

/** The application's client. Feature services import this and nothing else. */
export const http = createHttpClient();
