/** Shared request and response shapes for the HTTP layer. */

/** A single query-string value. Arrays are serialised as a repeated parameter. */
export type QueryValue = string | number | boolean | null | undefined | readonly (string | number | boolean)[];

/**
 * Query parameters for a request. `undefined`, `null` and empty-string values
 * are dropped, so callers can pass an unfiltered options object straight in.
 */
export type QueryParams = Record<string, QueryValue>;

/** Per-request options. */
export interface RequestOptions {
  /** Appended to the path as a query string. */
  query?: QueryParams;
  /** Caller cancellation — pass the signal TanStack Query hands the query function. */
  signal?: AbortSignal;
  /** Overrides the client's default timeout for this one request. */
  timeoutMs?: number;
  /** Extra headers, merged over the client's own. */
  headers?: Record<string, string>;
  /**
   * Passed straight to `fetch`. Needed only by `POST /auth/refresh`, which has
   * to send the httpOnly refresh cookie; every other request is authorised by
   * the `Authorization` header and should leave this unset.
   */
  credentials?: RequestCredentials;
}

/** The envelope every list endpoint returns. */
export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
}
