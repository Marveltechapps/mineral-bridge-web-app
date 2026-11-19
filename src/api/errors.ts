/** Backend error envelope: `{ code, message, fields?, requestId, details? }`. */
export interface ApiErrorEnvelope {
  code?: string;
  message?: string;
  fields?: Record<string, string | string[]>;
  requestId?: string;
  details?: Record<string, unknown>;
  [k: string]: unknown;
}

export interface ApiErrorInit {
  status: number;
  code: string;
  message: string;
  fields?: Record<string, string | string[]>;
  requestId?: string;
  details?: Record<string, unknown>;
  /** Raw parsed body, if any (useful for `kycStatus`, `current`, `hint` extras). */
  body?: unknown;
}

/** Synthetic codes produced by the client (status 0 = no HTTP response). */
export const CLIENT_ERROR_CODES = {
  network: 'network/unreachable',
  timeout: 'network/timeout',
  aborted: 'request/aborted',
  sessionExpired: 'auth/session-expired',
  parse: 'response/invalid',
} as const;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string | string[]>;
  readonly requestId?: string;
  readonly details?: Record<string, unknown>;
  readonly body?: unknown;

  constructor(init: ApiErrorInit) {
    super(init.message);
    // Required for `instanceof` to work when targeting ES5-like output (Hermes/Babel).
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = 'ApiError';
    this.status = init.status;
    this.code = init.code;
    this.fields = init.fields;
    this.requestId = init.requestId;
    this.details = init.details;
    this.body = init.body;
  }

  /** First message for a field, or undefined. */
  fieldError(name: string): string | undefined {
    const v = this.fields?.[name];
    return Array.isArray(v) ? v[0] : v;
  }

  /** Field errors flattened to `{ field: 'message' }` for form display. */
  flatFields(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(this.fields ?? {})) out[k] = Array.isArray(v) ? v[0] ?? '' : v;
    return out;
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;

export const isNetworkError = (e: unknown): boolean =>
  isApiError(e) && (e.code === CLIENT_ERROR_CODES.network || e.code === CLIENT_ERROR_CODES.timeout);

export const isAbortError = (e: unknown): boolean =>
  (isApiError(e) && e.code === CLIENT_ERROR_CODES.aborted) || (e instanceof Error && e.name === 'AbortError');

export const isSessionExpiredError = (e: unknown): boolean =>
  isApiError(e) && e.status === 401 && ['auth/session-expired', 'auth/token-invalid', 'auth/token-expired'].includes(e.code);

/** Parse a backend error body into an ApiError. Tolerates non-JSON / empty bodies. */
export function apiErrorFromResponse(status: number, body: unknown, headerRequestId?: string | null): ApiError {
  const env = (body && typeof body === 'object' ? (body as ApiErrorEnvelope) : {}) as ApiErrorEnvelope;
  const message =
    typeof env.message === 'string' && env.message
      ? env.message
      : typeof body === 'string' && body
        ? body.slice(0, 200)
        : `Request failed (${status})`;
  return new ApiError({
    status,
    code: typeof env.code === 'string' && env.code ? env.code : `http/${status}`,
    message,
    fields: env.fields,
    requestId: env.requestId ?? headerRequestId ?? undefined,
    details: env.details,
    body,
  });
}
