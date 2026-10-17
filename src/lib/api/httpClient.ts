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
 * AUTH (ARCHITECTURE.md §8). Both hooks are implemented, and this is the only
 * file that may hold them:
 *
 *   1. `getAccessToken` — called before every request; when it returns a token
 *      the `Authorization: Bearer <token>` header is set. Supplied by
 *      `lib/auth/session`, which keeps the token in memory, never in
 *      `localStorage`.
 *
 *   2. `refreshSession` — on a 401, refresh once and replay the original
 *      request (same method, path, query, body and signal); if the refresh or
 *      the replay fails, the original 401 `ApiError` reaches the caller so the
 *      login overlay can open. One in-flight refresh is shared between
 *      concurrent callers, which `lib/auth/session` guarantees — otherwise a
 *      screen with four queries fires four refreshes and each new token
 *      invalidates the one before it. See `request()` at the bottom.
 *
 * Nothing else about auth belongs in this file, and no other file may read the
 * token to set a header of its own. This module imports nothing from
 * `lib/auth/`; the wiring happens in `lib/api/client`.
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
  /**
   * AUTH SEAM (§8): exchange the refresh cookie for a new access token.
   *
   * Resolves `true` when the session was renewed, so the 401'd request is
   * replayed once; `false` when the session is over, so the original 401
   * reaches the caller. Must share one in-flight refresh between concurrent
   * callers and must never reject. Leave unset to disable refresh entirely —
   * a 401 is then an ordinary `ApiError`.
   */
  refreshSession?: () => Promise<boolean>;
}

export interface HttpClient {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions & { body?: unknown }): Promise<T>;
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

  async function send<T>(method: Method, path: string, spec: RequestSpec): Promise<T> {
    const url = joinUrl(resolveBaseUrl(), path, spec.query);
    const fetchImpl = config.fetchImpl ?? globalThis.fetch;
    const timeoutMs = spec.timeoutMs ?? config.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-Client': 'mineralbridge-web/1.0',
      'X-Requested-With': 'mb-web',
    };
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
        credentials: spec.credentials ?? 'include',
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

  /**
   * AUTH SEAM (§8): refresh-on-401, the one place it belongs.
   *
   * On a 401, ask `refreshSession()` once. If it renews the session, replay the
   * request exactly as it was — same method, path, query, body and signal — so
   * the caller never sees the interruption. If it does not, or the replay fails
   * again, the original 401 is what reaches the caller, and the login overlay
   * opens off the back of it.
   *
   * Only the first attempt may refresh: `send` is called directly for the
   * replay, so a server answering 401 twice cannot start a loop.
   */
  async function request<T>(method: Method, path: string, spec: RequestSpec): Promise<T> {
    if (!config.refreshSession) return send<T>(method, path, spec);

    try {
      return await send<T>(method, path, spec);
    } catch (error) {
      const isUnauthorised = error instanceof ApiError && error.status === 401;
      // A cancelled request is the caller's decision, not an auth failure.
      if (!isUnauthorised || spec.signal?.aborted) throw error;

      const renewed = await config.refreshSession();
      if (!renewed) throw error;

      try {
        return await send<T>(method, path, spec);
      } catch (replayError) {
        // Surface the replay's own failure when it is something new, but keep
        // the original 401 when the answer is simply 401 again.
        throw replayError instanceof ApiError && replayError.status === 401
          ? error
          : replayError;
      }
    }
  }

  return {
    get: (path, options = {}) => request('GET', path, options),
    post: (path, body, options = {}) => request('POST', path, { ...options, body, hasBody: true }),
    patch: (path, body, options = {}) => request('PATCH', path, { ...options, body, hasBody: true }),
    delete: (path, options = {}) =>
      request('DELETE', path, {
        ...options,
        body: options.body,
        hasBody: options.body !== undefined,
      }),
  };
}

// The application's wired client is `http` in `@/lib/api/client`, which is what
// feature services import. It is created there, not here, so that this file
// imports nothing from `lib/auth/` — see that file for why.
