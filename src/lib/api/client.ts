/**
 * The application's HTTP client: the generic client from `./httpClient` with
 * the session wired into it.
 *
 * It lives here rather than in `httpClient.ts` so that `httpClient.ts` imports
 * nothing from `lib/auth/`. `lib/auth/session` needs a hook-free client of its
 * own for the refresh call, and if `httpClient.ts` imported the session back
 * the two modules would form a cycle whose evaluation order decides whether
 * `createHttpClient` exists yet. The dependency runs one way:
 *
 *     client.ts  ->  auth/session.ts  ->  api/httpClient.ts
 *
 * Feature services import `http` from here and nothing else.
 */
import { createHttpClient } from '@/lib/api/httpClient';
import { getAccessToken, refreshSession } from '@/lib/auth/session';

export const http = createHttpClient({ getAccessToken, refreshSession });
