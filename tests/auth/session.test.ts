import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAccessToken,
  getSession,
  isSignedIn,
  refreshSession,
  resetRefreshState,
  signIn,
  signOut,
  subscribe,
} from '@/lib/auth/session';
import { resetSessionStore } from '@/lib/auth/sessionStore';

const BASE = 'https://api.mineralbridge.test/v1';

interface FetchCall {
  url: string;
  init: RequestInit;
}

function stubFetch(handler: (call: FetchCall) => Promise<Response>) {
  const calls: FetchCall[] = [];
  const impl: typeof fetch = (input, init = {}) => {
    const call = { url: String(input), init };
    calls.push(call);
    return handler(call);
  };
  vi.stubGlobal('fetch', impl);
  return calls;
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

beforeEach(() => {
  resetSessionStore();
  resetRefreshState();
  vi.stubEnv('VITE_API_BASE_URL', BASE);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  resetSessionStore();
  resetRefreshState();
});

describe('the session store', () => {
  it('starts anonymous, with no token and no end reason', () => {
    expect(getSession()).toEqual({
      status: 'anonymous',
      accessToken: null,
      expiresAt: null,
      endedBy: null,
    });
    expect(isSignedIn()).toBe(false);
    expect(getAccessToken()).toBeNull();
  });

  it('treats a demo session as signed in but withholds any token', () => {
    signIn();

    expect(isSignedIn()).toBe(true);
    expect(getSession().status).toBe('demo');
    // The point of the demo status: nothing may be sent as a bearer credential.
    expect(getAccessToken()).toBeNull();
  });

  it('sends the token only for an authenticated session', () => {
    signIn({ accessToken: 'tok-1' });

    expect(getSession().status).toBe('authenticated');
    expect(getAccessToken()).toBe('tok-1');
  });

  it('converts expiresIn seconds into an absolute expiry', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-15T12:00:00Z'));

    signIn({ accessToken: 'tok-1', expiresIn: 900 });

    expect(getSession().expiresAt).toBe(Date.parse('2026-10-15T12:15:00Z'));
    vi.useRealTimers();
  });

  it('records why the session ended', () => {
    signIn({ accessToken: 'tok-1' });
    signOut();
    expect(getSession().endedBy).toBe('signed-out');

    signIn({ accessToken: 'tok-2' });
    signOut('expired');
    expect(getSession().endedBy).toBe('expired');
  });

  it('notifies subscribers on change and not on a no-op write', () => {
    const seen: string[] = [];
    subscribe((session) => seen.push(session.status));

    signIn({ accessToken: 'tok-1' });
    signIn({ accessToken: 'tok-1' }); // identical — no notification
    signOut();

    expect(seen).toEqual(['authenticated', 'anonymous']);
  });

  it('tells every subscriber even when one of them throws', () => {
    const second = vi.fn();
    subscribe(() => {
      throw new Error('listener blew up');
    });
    subscribe(second);
    vi.spyOn(console, 'error').mockImplementation(() => {});

    signIn();

    expect(second).toHaveBeenCalledTimes(1);
  });

  it('stops notifying after unsubscribe', () => {
    const listener = vi.fn();
    subscribe(listener)();

    signIn();

    expect(listener).not.toHaveBeenCalled();
  });
});

describe('refreshSession()', () => {
  it('makes no request when there is no authenticated session to refresh', async () => {
    const calls = stubFetch(() => Promise.resolve(json({ accessToken: 'nope' })));

    await expect(refreshSession()).resolves.toBe(false);

    signIn(); // a demo session has nothing to refresh either
    await expect(refreshSession()).resolves.toBe(false);
    expect(calls).toHaveLength(0);
  });

  it('exchanges the refresh cookie for a new token', async () => {
    signIn({ accessToken: 'old' });
    const calls = stubFetch(() =>
      Promise.resolve(json({ accessToken: 'fresh', expiresIn: 600 })),
    );

    await expect(refreshSession()).resolves.toBe(true);

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(`${BASE}/auth/refresh`);
    expect(calls[0].init.method).toBe('POST');
    // Without this the browser withholds the httpOnly refresh cookie.
    expect(calls[0].init.credentials).toBe('include');
    expect(getAccessToken()).toBe('fresh');
  });

  it('ends the session as expired when the refresh is rejected', async () => {
    signIn({ accessToken: 'old' });
    stubFetch(() => Promise.resolve(json({ code: 'auth/refresh-expired' }, 401)));

    await expect(refreshSession()).resolves.toBe(false);

    expect(isSignedIn()).toBe(false);
    expect(getSession().endedBy).toBe('expired');
  });

  it('ends the session when the refresh succeeds but returns no token', async () => {
    signIn({ accessToken: 'old' });
    stubFetch(() => Promise.resolve(json({ accessToken: '' })));

    await expect(refreshSession()).resolves.toBe(false);
    expect(getSession().endedBy).toBe('expired');
  });

  it('ends the session when the network fails outright', async () => {
    signIn({ accessToken: 'old' });
    stubFetch(() => Promise.reject(new TypeError('Failed to fetch')));

    await expect(refreshSession()).resolves.toBe(false);
    expect(getSession().endedBy).toBe('expired');
  });

  it('shares one in-flight refresh between concurrent callers', async () => {
    signIn({ accessToken: 'old' });
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const calls = stubFetch(async () => {
      await gate;
      return json({ accessToken: 'fresh' });
    });

    const all = Promise.all([refreshSession(), refreshSession(), refreshSession()]);
    release?.();

    expect(await all).toEqual([true, true, true]);
    // Four concurrent 401s must not rotate the refresh token four times.
    expect(calls).toHaveLength(1);
  });

  it('allows a later refresh once the in-flight one has settled', async () => {
    signIn({ accessToken: 'old' });
    const calls = stubFetch(() => Promise.resolve(json({ accessToken: 'fresh' })));

    await refreshSession();
    await refreshSession();

    expect(calls).toHaveLength(2);
  });
});
