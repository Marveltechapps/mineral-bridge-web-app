import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/lib/api/ApiError';
import { createHttpClient } from '@/lib/api/httpClient';

/**
 * The refresh-on-401 contract in `httpClient` — ARCHITECTURE.md §8.
 *
 * `refreshSession` is injected here rather than using the real session, so each
 * case can decide exactly what the refresh does and how often it was asked.
 */

const BASE = 'https://api.mineralbridge.test/v1';

interface FetchCall {
  url: string;
  init: RequestInit;
}

function stubFetch(handler: (call: FetchCall, n: number) => Promise<Response>) {
  const calls: FetchCall[] = [];
  const impl: typeof fetch = (input, init = {}) => {
    const call = { url: String(input), init };
    calls.push(call);
    return handler(call, calls.length);
  };
  return { calls, impl };
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const authHeader = (call: FetchCall): string | undefined =>
  (call.init.headers as Record<string, string> | undefined)?.Authorization;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('refresh-on-401', () => {
  it('refreshes once and replays the request with the new token', async () => {
    let token = 'stale';
    const { calls, impl } = stubFetch((_call, n) =>
      Promise.resolve(n === 1 ? json({ code: 'auth/expired' }, 401) : json({ id: 'gold' })),
    );
    const refreshSession = vi.fn(async () => {
      token = 'fresh';
      return true;
    });
    const http = createHttpClient({
      baseUrl: BASE,
      fetchImpl: impl,
      getAccessToken: () => token,
      refreshSession,
    });

    await expect(http.get('/lots/gold')).resolves.toEqual({ id: 'gold' });

    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
    expect(authHeader(calls[0])).toBe('Bearer stale');
    // The replay must carry the token the refresh just produced.
    expect(authHeader(calls[1])).toBe('Bearer fresh');
  });

  it('replays the original method, path, query and body unchanged', async () => {
    const { calls, impl } = stubFetch((_call, n) =>
      Promise.resolve(n === 1 ? json({}, 401) : json({ ok: true })),
    );
    const http = createHttpClient({
      baseUrl: BASE,
      fetchImpl: impl,
      refreshSession: async () => true,
    });

    await http.post('/auctions/a1/bids', { amount: 185000 }, { query: { dry: true } });

    expect(calls).toHaveLength(2);
    expect(calls[0].url).toBe(calls[1].url);
    expect(calls[0].url).toBe(`${BASE}/auctions/a1/bids?dry=true`);
    expect(calls[1].init.method).toBe('POST');
    expect(calls[1].init.body).toBe(JSON.stringify({ amount: 185000 }));
  });

  it('surfaces the original 401 when the refresh fails', async () => {
    const { calls, impl } = stubFetch(() =>
      Promise.resolve(json({ code: 'auth/expired', message: 'Session expired' }, 401)),
    );
    const http = createHttpClient({
      baseUrl: BASE,
      fetchImpl: impl,
      refreshSession: async () => false,
    });

    const error = await http.get('/orders').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect((error as ApiError).code).toBe('auth/expired');
    // No replay when the session could not be renewed.
    expect(calls).toHaveLength(1);
  });

  it('surfaces the original 401 when the replay is also rejected', async () => {
    const { calls, impl } = stubFetch(() => Promise.resolve(json({ code: 'auth/expired' }, 401)));
    const refreshSession = vi.fn(async () => true);
    const http = createHttpClient({
      baseUrl: BASE,
      fetchImpl: impl,
      refreshSession,
    });

    const error = await http.get('/orders').catch((e: unknown) => e);

    expect((error as ApiError).status).toBe(401);
    // Exactly one refresh and one replay: a server answering 401 forever must
    // not start a loop.
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
  });

  it('reports the replay failure when it is something other than a 401', async () => {
    const { impl } = stubFetch((_call, n) =>
      Promise.resolve(n === 1 ? json({}, 401) : json({ code: 'lot/sold' }, 409)),
    );
    const http = createHttpClient({
      baseUrl: BASE,
      fetchImpl: impl,
      refreshSession: async () => true,
    });

    const error = await http.get('/lots/gold').catch((e: unknown) => e);

    expect((error as ApiError).status).toBe(409);
    expect((error as ApiError).code).toBe('lot/sold');
  });

  it('does not refresh when no refreshSession is configured', async () => {
    const { calls, impl } = stubFetch(() => Promise.resolve(json({ code: 'auth/expired' }, 401)));
    const http = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    await expect(http.get('/orders')).rejects.toBeInstanceOf(ApiError);
    expect(calls).toHaveLength(1);
  });

  it('does not refresh on a status other than 401', async () => {
    const refreshSession = vi.fn(async () => true);
    const { impl } = stubFetch(() => Promise.resolve(json({ code: 'kyc/required' }, 403)));
    const http = createHttpClient({ baseUrl: BASE, fetchImpl: impl, refreshSession });

    await expect(http.get('/orders')).rejects.toBeInstanceOf(ApiError);
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it('does not refresh when the caller cancelled the request', async () => {
    const refreshSession = vi.fn(async () => true);
    const controller = new AbortController();
    const { impl } = stubFetch(() => {
      controller.abort();
      return Promise.resolve(json({}, 401));
    });
    const http = createHttpClient({ baseUrl: BASE, fetchImpl: impl, refreshSession });

    await expect(http.get('/orders', { signal: controller.signal })).rejects.toBeTruthy();
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it('sets no Authorization header when there is no token', async () => {
    const { calls, impl } = stubFetch(() => Promise.resolve(json({ items: [] })));
    const http = createHttpClient({
      baseUrl: BASE,
      fetchImpl: impl,
      getAccessToken: () => null,
    });

    await http.get('/lots');

    expect(authHeader(calls[0])).toBeUndefined();
  });
});
