import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, CLIENT_ERROR_CODES } from '@/lib/api/ApiError';
import { createHttpClient, toSearchParams } from '@/lib/api/httpClient';

const BASE = 'https://api.mineralbridge.test/v1';

interface FetchCall {
  url: string;
  init: RequestInit;
}

/** A `fetch` that records what it was asked for and answers from `handler`. */
function stubFetch(handler: (call: FetchCall) => Promise<Response>) {
  const calls: FetchCall[] = [];
  const impl: typeof fetch = (input, init = {}) => {
    const call = { url: String(input), init };
    calls.push(call);
    return handler(call);
  };
  return { calls, impl };
}

/** A `fetch` that answers every request with the same response. */
function respondWith(response: () => Response) {
  return stubFetch(() => Promise.resolve(response()));
}

/** A `fetch` that never settles until its signal aborts — as the real one behaves. */
const pendingFetch: typeof fetch = (_input, init = {}) =>
  new Promise((_resolve, reject) => {
    const { signal } = init;
    const fail = () =>
      reject(signal?.reason ?? new DOMException('The operation was aborted.', 'AbortError'));
    if (signal?.aborted) fail();
    else signal?.addEventListener('abort', fail);
  });

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** Awaits a request that must fail, and hands back the `ApiError` it failed with. */
async function failure(promise: Promise<unknown>): Promise<ApiError> {
  const error = await promise.then(
    () => undefined,
    (reason: unknown) => reason,
  );
  expect(error).toBeInstanceOf(ApiError);
  return error as ApiError;
}

function headersOf(call: FetchCall): Record<string, string> {
  return (call.init.headers ?? {}) as Record<string, string>;
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('toSearchParams()', () => {
  it('drops the parameters a caller left unset', () => {
    const params = toSearchParams({
      category: 'precious',
      grade: undefined,
      sellerF: null,
      query: '',
      page: 2,
      assured: false,
    });
    expect(params.toString()).toBe('category=precious&page=2&assured=false');
  });

  it('serialises an array as a repeated parameter', () => {
    expect(toSearchParams({ grade: ['99.9%', 'Grade A'] }).toString()).toBe(
      'grade=99.9%25&grade=Grade+A',
    );
  });
});

describe('httpClient — requests', () => {
  it('returns the decoded body of a successful GET', async () => {
    const { calls, impl } = respondWith(() => json({ items: [{ id: 'gold' }], total: 1 }));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    await expect(client.get('/lots')).resolves.toEqual({ items: [{ id: 'gold' }], total: 1 });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(`${BASE}/lots`);
    expect(calls[0].init.method).toBe('GET');
    expect(headersOf(calls[0])).toEqual({ Accept: 'application/json' });
    expect(calls[0].init.body).toBeUndefined();
  });

  it('joins the path onto a base URL that has a path of its own', async () => {
    const { calls, impl } = respondWith(() => json({}));
    const client = createHttpClient({ baseUrl: `${BASE}/`, fetchImpl: impl });

    await client.get('lots');
    await client.get('/lots/gold');

    expect(calls.map((c) => c.url)).toEqual([`${BASE}/lots`, `${BASE}/lots/gold`]);
  });

  it('appends the query object to the URL', async () => {
    const { calls, impl } = respondWith(() => json({}));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    await client.get('/lots', { query: { category: 'gemstone', page: 2, grade: undefined } });

    expect(calls[0].url).toBe(`${BASE}/lots?category=gemstone&page=2`);
  });

  it('JSON-encodes a POST body and declares its content type', async () => {
    const { calls, impl } = respondWith(() => json({ id: 'bid_1' }, 201));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    await expect(client.post('/auctions/a1/bids', { amount: 2410 })).resolves.toEqual({
      id: 'bid_1',
    });
    expect(calls[0].init.method).toBe('POST');
    expect(calls[0].init.body).toBe('{"amount":2410}');
    expect(headersOf(calls[0])['Content-Type']).toBe('application/json');
  });

  it('sends PATCH and DELETE with the right method', async () => {
    const { calls, impl } = respondWith(() => new Response(null, { status: 204 }));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    await client.patch('/account', { company: 'Marvel Minerals' });
    await client.delete('/account/payouts/p1');

    expect(calls.map((c) => c.init.method)).toEqual(['PATCH', 'DELETE']);
    expect(calls[0].init.body).toBe('{"company":"Marvel Minerals"}');
    expect(calls[1].init.body).toBeUndefined();
  });

  it('resolves to undefined for a 204 with no body', async () => {
    const { impl } = respondWith(() => new Response(null, { status: 204 }));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    await expect(client.delete('/account/payouts/p1')).resolves.toBeUndefined();
  });

  it('merges caller headers over its own', async () => {
    const { calls, impl } = respondWith(() => json({}));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    await client.get('/lots', { headers: { 'Accept-Language': 'fr', Accept: 'text/csv' } });

    expect(headersOf(calls[0])).toEqual({ Accept: 'text/csv', 'Accept-Language': 'fr' });
  });
});

describe('httpClient — base URL configuration', () => {
  it('reads VITE_API_BASE_URL when no base URL is configured', async () => {
    vi.stubEnv('VITE_API_BASE_URL', BASE);
    const { calls, impl } = respondWith(() => json({}));

    await createHttpClient({ fetchImpl: impl }).get('/lots');

    expect(calls[0].url).toBe(`${BASE}/lots`);
  });

  it('fails loudly, without a request, when VITE_API_BASE_URL is unset', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    const { calls, impl } = respondWith(() => json({}));

    const error = await failure(createHttpClient({ fetchImpl: impl }).get('/lots'));

    expect(error.code).toBe(CLIENT_ERROR_CODES.configuration);
    expect(error.status).toBe(0);
    expect(error.message).toContain('VITE_API_BASE_URL');
    expect(calls).toHaveLength(0);
  });
});

describe('httpClient — the Authorization seam', () => {
  it('sends the bearer token the token getter returns', async () => {
    const { calls, impl } = respondWith(() => json({}));
    const client = createHttpClient({
      baseUrl: BASE,
      fetchImpl: impl,
      getAccessToken: () => 'token-abc',
    });

    await client.get('/orders');

    expect(headersOf(calls[0]).Authorization).toBe('Bearer token-abc');
  });

  it('sends no Authorization header while signed out', async () => {
    const { calls, impl } = respondWith(() => json({}));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl, getAccessToken: () => null });

    await client.get('/orders');

    expect(headersOf(calls[0]).Authorization).toBeUndefined();
  });
});

describe('httpClient — failures', () => {
  it('turns a 422 into an ApiError carrying the per-field messages', async () => {
    const { impl } = respondWith(() =>
      json(
        {
          code: 'contract/invalid-terms',
          message: 'Contract terms are invalid.',
          fields: { incoterm: 'Unsupported for this route', qty: ['Above the lot stock'] },
        },
        422,
      ),
    );
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    const error = await failure(client.post('/contracts', { incoterm: 'XXX' }));

    expect(error.status).toBe(422);
    expect(error.code).toBe('contract/invalid-terms');
    expect(error.message).toBe('Contract terms are invalid.');
    expect(error.fields).toEqual({
      incoterm: 'Unsupported for this route',
      qty: 'Above the lot stock',
    });
  });

  it('keeps 401, 403 and 409 apart by status and code', async () => {
    const cases = [
      { status: 401, code: 'auth/session-expired' },
      { status: 403, code: 'kyc/not-approved' },
      { status: 409, code: 'auction/outbid' },
    ];

    for (const { status, code } of cases) {
      const { impl } = respondWith(() => json({ code }, status));
      const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

      const error = await failure(client.post('/auctions/a1/bids', { amount: 1 }));

      expect(error.status).toBe(status);
      expect(error.code).toBe(code);
      expect(error.fields).toBeUndefined();
    }
  });

  it('reads the nested { error: { code, message } } shape too', async () => {
    const { impl } = respondWith(() =>
      json({ error: { code: 'lot/sold', message: 'This lot has sold.' } }, 409),
    );
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    const error = await failure(client.get('/lots/gold'));

    expect(error.code).toBe('lot/sold');
    expect(error.message).toBe('This lot has sold.');
  });

  it('still reports the status when the error body is not JSON', async () => {
    const { impl } = respondWith(
      () =>
        new Response('<html><body>502 Bad Gateway</body></html>', {
          status: 502,
          headers: { 'content-type': 'text/html' },
        }),
    );
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    const error = await failure(client.get('/lots'));

    expect(error.status).toBe(502);
    expect(error.code).toBe('http/502');
    expect(error.message).toBe('Request failed (502)');
  });

  it('turns a 500 into an ApiError the retry predicate can recognise', async () => {
    const { impl } = respondWith(() => json({ code: 'server/unavailable' }, 500));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    const error = await failure(client.get('/lots'));

    expect(error.status).toBe(500);
    expect(error.code).toBe('server/unavailable');
  });

  it('reports a 2xx body that is not JSON as a malformed response', async () => {
    const { impl } = respondWith(() => new Response('not json', { status: 200 }));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    const error = await failure(client.get('/lots'));

    expect(error.status).toBe(200);
    expect(error.code).toBe(CLIENT_ERROR_CODES.malformedResponse);
  });

  it('reports a fetch that never reached the server as a network failure', async () => {
    const { impl } = stubFetch(() => Promise.reject(new TypeError('Failed to fetch')));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    const error = await failure(client.get('/lots'));

    expect(error.status).toBe(0);
    expect(error.code).toBe(CLIENT_ERROR_CODES.network);
    expect(error.message).toBe('Failed to fetch');
  });
});

describe('httpClient — cancellation and timeout', () => {
  it("passes the caller's cancellation through, as an abort rather than a failure", async () => {
    const controller = new AbortController();
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: pendingFetch });

    const promise = client.get('/lots', { signal: controller.signal });
    controller.abort();
    const error = await promise.then(
      () => undefined,
      (reason: unknown) => reason,
    );

    expect(error).not.toBeInstanceOf(ApiError);
    expect((error as Error).name).toBe('AbortError');
  });

  it('aborts the underlying fetch when the caller cancels', async () => {
    const controller = new AbortController();
    const { calls, impl } = stubFetch((call) => pendingFetch('x', call.init));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl });

    const promise = client.get('/lots', { signal: controller.signal });
    controller.abort();
    await promise.catch(() => undefined);

    expect(calls[0].init.signal?.aborted).toBe(true);
  });

  it('never calls out when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: pendingFetch });

    const error = await client
      .get('/lots', { signal: controller.signal })
      .then(() => undefined, (reason: unknown) => reason);

    expect((error as Error).name).toBe('AbortError');
  });

  it('fails with a timeout when the request outlives the deadline', async () => {
    vi.useFakeTimers();
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: pendingFetch, timeoutMs: 100 });

    const settled = failure(client.get('/lots'));
    await vi.advanceTimersByTimeAsync(100);
    const error = await settled;

    expect(error.status).toBe(408);
    expect(error.code).toBe(CLIENT_ERROR_CODES.timeout);
    expect(error.message).toContain('100ms');
  });

  it('lets a per-request timeout override the client default', async () => {
    vi.useFakeTimers();
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: pendingFetch, timeoutMs: 10_000 });

    const settled = failure(client.get('/lots', { timeoutMs: 50 }));
    await vi.advanceTimersByTimeAsync(50);
    const error = await settled;

    expect(error.code).toBe(CLIENT_ERROR_CODES.timeout);
    expect(error.message).toContain('50ms');
  });

  it('does not time out a request that has already answered', async () => {
    vi.useFakeTimers();
    const { impl } = respondWith(() => json({ items: [] }));
    const client = createHttpClient({ baseUrl: BASE, fetchImpl: impl, timeoutMs: 100 });

    await expect(client.get('/lots')).resolves.toEqual({ items: [] });
    await vi.advanceTimersByTimeAsync(500);
  });
});
