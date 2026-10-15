import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/ApiError';
import { DEFAULT_STALE_TIME_MS, createQueryClient, shouldRetry } from '@/lib/queryClient';

const apiError = (status: number) => new ApiError(status, `http/${status}`);

describe('shouldRetry()', () => {
  it('retries a server error twice, then gives up', () => {
    expect(shouldRetry(0, apiError(500))).toBe(true);
    expect(shouldRetry(1, apiError(500))).toBe(true);
    expect(shouldRetry(2, apiError(500))).toBe(false);
    expect(shouldRetry(3, apiError(500))).toBe(false);
  });

  it('retries every 5xx', () => {
    for (const status of [500, 502, 503, 504]) {
      expect(shouldRetry(0, apiError(status))).toBe(true);
    }
  });

  it('never retries a client error — the answer will not change', () => {
    for (const status of [400, 401, 403, 404, 409, 422, 429]) {
      expect(shouldRetry(0, apiError(status))).toBe(false);
    }
  });

  it('does not retry a client-side failure, which has no status to retry', () => {
    expect(shouldRetry(0, new ApiError(0, 'client/network'))).toBe(false);
    expect(shouldRetry(0, new ApiError(408, 'client/timeout'))).toBe(false);
  });

  it('does not retry anything that is not an ApiError', () => {
    expect(shouldRetry(0, new Error('boom'))).toBe(false);
    expect(shouldRetry(0, 'boom')).toBe(false);
    expect(shouldRetry(0, undefined)).toBe(false);
  });
});

describe('createQueryClient()', () => {
  it('applies the shared defaults, so no hook has to', () => {
    const defaults = createQueryClient().getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(DEFAULT_STALE_TIME_MS);
    expect(DEFAULT_STALE_TIME_MS).toBe(30_000);
    expect(defaults?.retry).toBe(shouldRetry);
  });

  it('hands out an independent cache each time', () => {
    expect(createQueryClient()).not.toBe(createQueryClient());
  });
});
