/**
 * The error every failed API call rejects with.
 *
 * A marketplace has failures that must be told apart — `401` expired session,
 * `403` KYC not approved, `409` lot already sold or bid outbid, `422` contract
 * terms invalid — so the UI needs the status and a machine-readable `code`, not
 * a message string it would have to match on.
 *
 * `fields` carries per-field messages from a `422` validation response, keyed by
 * the field name the form knows it as.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly fields?: Record<string, string>,
    message?: string,
  ) {
    super(message ?? `Request failed (${status})`);
    this.name = 'ApiError';
  }
}

/**
 * Codes the client raises itself, for failures that never reached the server or
 * came back unusable. Server-defined codes are plain strings and are passed
 * through as the response sends them.
 */
export const CLIENT_ERROR_CODES = {
  /** `VITE_API_BASE_URL` is not configured for this build. */
  configuration: 'client/no-base-url',
  /** The request did not complete within the client timeout. */
  timeout: 'client/timeout',
  /** `fetch` itself failed: offline, DNS, TLS, CORS. */
  network: 'client/network',
  /** A 2xx response whose body was not the JSON the caller expected. */
  malformedResponse: 'client/malformed-response',
} as const;

/** Status the client reports for a request that never produced an HTTP response. */
export const NO_RESPONSE_STATUS = 0;

/** Status the client reports when its own timeout fires (RFC 9110 "Request Timeout"). */
export const TIMEOUT_STATUS = 408;

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
