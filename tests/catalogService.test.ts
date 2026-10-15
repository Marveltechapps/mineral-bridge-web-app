import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/lib/api/ApiError';
import { catalogKeys, getLot, getLots } from '@/features/catalog/services/catalogService';
import type { Paginated } from '@/lib/api/types';
import type { Product } from '@/types';

const BASE = 'https://api.mineralbridge.test/v1';

const GOLD: Product = {
  id: 'gold',
  name: 'Gold Concentrate',
  category: 'Precious Metals',
  catKey: 'precious',
  subCategory: 'Gold',
  seller: 'Ashanti Refining Co.',
  sellerType: 'Refinery',
  grade: '99.9%',
  region: 'Obuasi, Ghana',
  price: '$2,410',
  unit: 'oz',
  stock: '745 g',
  grad: 'linear-gradient(140deg,#f3d27a,#b8860b)',
};

const PAGE: Paginated<Product> = { items: [GOLD], page: 1, perPage: 24, total: 1 };

let urls: string[] = [];

/** Answers the next request with `body`, recording the URL it was asked for. */
function serve(body: unknown, status = 200) {
  const impl: typeof fetch = (input) => {
    urls.push(String(input));
    return Promise.resolve(
      new Response(status === 204 ? null : JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
    );
  };
  vi.stubGlobal('fetch', impl);
}

beforeEach(() => {
  urls = [];
  vi.stubEnv('VITE_API_BASE_URL', BASE);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('getLots()', () => {
  it('returns the page of lots the API sends', async () => {
    serve(PAGE);

    await expect(getLots()).resolves.toEqual(PAGE);
    expect(urls).toEqual([`${BASE}/lots`]);
  });

  it('maps the filter rail onto the API query parameters', async () => {
    serve(PAGE);

    await getLots({
      category: 'gemstone',
      grade: 'VS1',
      sellerType: 'Cooperative',
      query: 'ruby',
      sort: 'low',
      page: 2,
      perPage: 24,
    });

    expect(urls[0]).toBe(
      `${BASE}/lots?category=gemstone&grade=VS1&sellerType=Cooperative&q=ruby&sort=low&page=2&perPage=24`,
    );
  });

  it('omits the rail’s "no category chosen" value and its empty filters', async () => {
    serve(PAGE);

    await getLots({ category: 'all', grade: '', query: '', sort: 'featured' });

    expect(urls[0]).toBe(`${BASE}/lots?sort=featured`);
  });

  it('passes the caller’s signal through, so a superseded filter cancels', async () => {
    const controller = new AbortController();
    const seen: (AbortSignal | null | undefined)[] = [];
    // Holds the request open, as fetch does, until the signal aborts.
    vi.stubGlobal('fetch', ((_input, init = {}) => {
      seen.push(init.signal);
      return new Promise<Response>((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => reject(init.signal?.reason));
      });
    }) satisfies typeof fetch);

    const promise = getLots({ category: 'precious' }, controller.signal);
    controller.abort();
    const error = await promise.then(
      () => undefined,
      (reason: unknown) => reason,
    );

    expect(seen[0]?.aborted).toBe(true);
    expect((error as Error).name).toBe('AbortError');
  });

  it('rejects with the ApiError the status describes', async () => {
    serve({ code: 'catalog/unavailable' }, 503);

    const error = await getLots().catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(503);
    expect((error as ApiError).code).toBe('catalog/unavailable');
  });
});

describe('getLot()', () => {
  it('fetches one lot by id', async () => {
    serve(GOLD);

    await expect(getLot('gold')).resolves.toEqual(GOLD);
    expect(urls).toEqual([`${BASE}/lots/gold`]);
  });

  it('escapes an id that is not URL-safe', async () => {
    serve(GOLD);

    await getLot('lot/42 b');

    expect(urls[0]).toBe(`${BASE}/lots/lot%2F42%20b`);
  });

  it('rejects with a 404 ApiError for a lot that does not exist', async () => {
    serve({ code: 'lot/not-found', message: 'No such lot.' }, 404);

    const error = await getLot('nope').catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(404);
    expect((error as ApiError).message).toBe('No such lot.');
  });
});

describe('catalogKeys', () => {
  it('includes every parameter that changes the result', () => {
    const query = { category: 'precious', sort: 'low', page: 2 } as const;

    expect(catalogKeys.lots(query)).toEqual(['lots', query]);
    expect(catalogKeys.lots()).toEqual(['lots', {}]);
    expect(catalogKeys.lot('gold')).toEqual(['lots', 'gold']);
  });
});
