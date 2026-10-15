/**
 * TanStack Query configuration — ARCHITECTURE.md §5.2.
 *
 * Fetched data (lots, orders, auctions, bids, documents) lives here, not in
 * `AppState`: it has loading, error, staleness and refetch semantics that an
 * 80-field object cannot express. UI state stays in the context.
 *
 * Configured once, here. Hooks do not set `staleTime` or `retry` of their own.
 */
import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/ApiError';

/** How long fetched data is served without a refetch. */
export const DEFAULT_STALE_TIME_MS = 30_000;

/** Retries allowed for a server-side failure, after the first attempt. */
export const MAX_RETRIES = 2;

/**
 * Retry only what retrying can fix.
 *
 * A `5xx` may be transient, so it gets up to {@link MAX_RETRIES} more attempts.
 * Everything else is the server's considered answer and will not change: `401`
 * expired session, `403` KYC not approved, `409` lot already sold or bid
 * outbid, `422` invalid contract terms. Retrying those delays the UI that has
 * to handle them, and for a `409` it can repeat a trade action.
 *
 * A non-`ApiError` (a bug in a query function, or a client-side failure the
 * httpClient reports with status 0) is not retried either.
 */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  return error instanceof ApiError && error.status >= 500 && failureCount < MAX_RETRIES;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
        retry: shouldRetry,
      },
    },
  });
}

/**
 * The application's client, mounted in `App.tsx`.
 *
 * Tests build their own with {@link createQueryClient} so one test's cache
 * cannot leak into the next.
 */
export const queryClient = createQueryClient();
