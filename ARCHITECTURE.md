# Mineral Bridge Web — Frontend Architecture

**Status:** authoritative. This file supersedes the `mineral-bridge-web-app-main`
Next.js scaffold, which described a different application (see
[`ARCHITECTURE-REVIEW.md`](ARCHITECTURE-REVIEW.md)).

**Product:** a regulated marketplace for buying and selling minerals — catalog and
lot discovery, auctions with live bidding, seller onboarding (including artisanal
and small-scale mining), KYC, and a trade desk covering negotiation, contracts,
letters of credit, bank examination and shipment.

Sections marked **[current]** describe what exists today. Sections marked
**[target]** describe the shape to build toward; they are the contract for new
code. Where the two differ, the gap is stated explicitly rather than glossed over.

---

## 1. Stack

| Concern | Choice | Notes |
|---|---|---|
| Build | **Vite 5.4** | SPA. Do not migrate to Next.js — see §12. |
| UI | **React 18.3** | Stay on 18 until there is a reason to move. |
| Routing | **React Router 6.26** | Central route table, not file-based. |
| Language | **TypeScript 5.6**, `strict` | `@typescript-eslint/no-explicit-any: error`. |
| Styling | Global CSS + inline design strings **[current]** → CSS variables + primitives **[target]** | §7 |
| Client state | React Context (`AppStateProvider`) | §6 |
| Server state | **TanStack Query** 5.104 | Client and retry policy in `lib/queryClient.ts`. No query is wired to a screen yet. §5 |
| Tests | Vitest + React Testing Library; Playwright pixel-diff | §9 |
| Path alias | `@/*` → `src/*` | Declared in `vite.config.ts` **and** `tsconfig.app.json`. Always use it. |

---

## 2. Directory structure

```
Mineral_Bridge_Web_Final/
├── design-source/              Original Design Canvas HTML + assets. Read-only reference.
├── public/images/              Static assets served as-is
├── tests/                      Vitest specs, Playwright visual tooling, screenshots
└── src/
    ├── main.tsx                Mount point. Nothing but createRoot.
    ├── App.tsx                 BrowserRouter → providers → AppRoutes
    │
    ├── routes/
    │   └── AppRoutes.tsx       Every screen, one <Route> each, under MainLayout
    ├── layouts/
    │   └── MainLayout.tsx      Header, TradeNav, KycBanner, <Outlet/>, Footer, overlays
    │
    ├── features/<feature>/     ← the unit of ownership (§3)
    │   ├── pages/              One component per screen. Renders; does not decide.
    │   ├── hooks/              use<Feature>ViewModel — the screen's logic
    │   ├── components/         Components used only by this feature
    │   ├── services/           HTTP calls for this domain (§5). Only `catalog` has one.
    │   └── constants.ts        Feature-local constants
    │
    ├── components/
    │   ├── ui/                 [target] Primitives: Button, Input, Chip, Card, Badge, Field
    │   ├── common/             Cross-feature pieces: Icon, Glyphs, Modal, InfoNote, Breadcrumb
    │   └── layout/             Shell: Header, TradeNav, KycBanner, Footer
    │
    ├── lib/                    Framework-facing infrastructure
    │   ├── api/                httpClient (the only `fetch`), ApiError, types
    │   ├── auth/               [target] token storage, refresh, session (§8)
    │   └── queryClient.ts      TanStack Query configuration
    │
    ├── store/
    │   ├── appState.ts         AppState — the union of every slice — + initialState
    │   ├── slices/             the fifteen state slices (§6)
    │   └── useSliceOf.ts       stable projection behind the narrow subscriptions
    ├── context/
    │   ├── AppStateContext.tsx AppStateProvider: state, setState, go — keeps route ↔ URL in sync
    │   └── sliceContexts.tsx   one context per slice, so consumers re-render narrowly
    ├── hooks/                  App-wide hooks: useAppState + the fifteen slice hooks, useActions
    │
    ├── constants/
    │   ├── routes.ts           ROUTE_PATHS + routeFromPath — the routing source of truth
    │   ├── tokens.ts           Design tokens
    │   └── catalog|orders|auctions|courses.ts   Seed/fixture data [current] → fixtures only [target]
    │
    ├── types/index.ts          Domain types: Product, Order, Auction, ContractTerms, …
    ├── utils/                  Pure helpers: css.ts (style parsing), format.ts
    └── styles/
        ├── global.css          Verbatim from the design. Do not re-author.
        └── responsive.css      Additive breakpoints below 1000px
```

### Features

`academy` · `account` · `asm` · `auctions` · `auth` · `catalog` · `home` ·
`howItWorks` · `kyc` · `mining` · `orders` · `passport` · `product` · `sell` ·
`trade` (negotiation, contract, LC, bank, shipment)

**15 features · 22 pages · 21 view models · 22 routes.**

---

## 3. The feature module — the one rule that matters most

A feature is a **vertical slice of the product**, not a folder of similar files.
Everything a screen needs lives inside it, and deleting the folder removes the
feature cleanly.

```
src/features/auctions/
├── pages/AuctionsPage.tsx          route target
├── pages/AuctionDetailPage.tsx     route target
├── hooks/useAuctionsViewModel.ts   logic
├── components/BidPanel.tsx         used only here
└── services/auctionService.ts      [target] HTTP for this domain — copy catalogService.ts
```

**Promote to shared only on the third use.** Two features needing the same
component is a coincidence; three is a pattern. Until then it stays feature-local.
This rule exists because the fastest way to ruin this structure is a `components/`
folder that becomes a junk drawer.

**Features must not import from each other.** If `orders` needs something from
`catalog`, the shared part moves up to `components/`, `types/` or `utils/`. One
exception is already in place and is fine: `layouts/MainLayout` mounts the
`auth` and `howItWorks` overlays, because they are app chrome.

---

## 4. Layering — what may import what

```
pages  →  view-model hooks  →  services  →  lib/api
  ↓             ↓                  ↓
components   store/context      types, utils, constants
```

| Layer | May import | Must never |
|---|---|---|
| `pages/` | its feature's hooks and components, shared `components/`, `types` | call `fetch`, hold business logic, read `store/` directly |
| `hooks/` (view models) | `useAppState`, its feature's services, `constants`, `utils`, `types` | import a page, or another feature's hook |
| `services/` | `lib/api`, `types` | import React, hooks, or components |
| `lib/` | `types` only | import any feature |
| `components/ui/` | `types`, `utils` | import `store/`, `context/`, or any feature |
| `store/`, `context/` | `types`, `utils` | import a page or a service |

**The one-sentence version:** data flows down through props and view models;
nothing below `features/` is allowed to know a feature exists.

### The view-model pattern

Every screen is a pair: a page that renders and a hook that decides.

```ts
// features/catalog/hooks/useCatalogViewModel.ts
export function useCatalogViewModel() {
  const { state, setState, go } = useAppState();
  return useMemo(() => ({
    catalogProducts,          // data, ready to render
    catalogEmpty,             // derived flags
    clearFilters, setSort,    // handlers
  }), [state.homeFilter, state.gradeF, state.sort, setState, go]);
}
```

Rules:
- A page contains **no** `if` on business conditions and no data shaping. It
  destructures the view model and renders.
- A view model returns **data, flags and handlers**. It must not return CSS
  strings — see §7; this is the main way today's code departs from this document.
- Always memoise with **narrow dependencies** — list the state fields used, never
  the whole `state` object.

---

## 5. Data layer **[current — the plumbing exists; no endpoint is wired]**

The structure below is **built and tested**. What is *not* done is the wiring:
all 22 screens still read hardcoded arrays from `src/constants/`, because there
is no backend to read instead. That was the point of doing it in this order —
the layer had to exist before the first endpoint, or HTTP calls would have ended
up scattered through view models.

So: no view model calls a service yet, and `getLots` has never been run against
a real server. Treat the service signatures as the contract the backend has to
meet, not as proven code paths.

### 5.1 Three layers, no shortcuts **[current]**

```
view model  →  feature service  →  lib/api/httpClient  →  backend
```

**`src/lib/api/httpClient.ts`** — the only place `fetch` appears, enforced by
review and by there being nothing else to import. `createHttpClient(config)`
builds one; the `http` singleton is what services use. It owns:

- the base URL from `VITE_API_BASE_URL`, read **per request** rather than at
  module load, so a test can stub it. Unset is a hard failure — `ApiError(0,
  'client/no-base-url')`, raised before any request — not a silent fall back to
  the app's own origin.
- `get` / `post` / `patch` / `delete`, each taking `{ query, signal, timeoutMs,
  headers }`; `query` drops `undefined`, `null` and `''` so a caller can hand it
  an unfiltered options object, and serialises an array as a repeated parameter.
- JSON in and out, with `204`/empty resolving to `undefined`.
- a 15s default timeout, overridable per request.
- the distinction that matters for cancellation: **the caller's abort passes
  through unchanged** as a `DOMException` `AbortError`, so TanStack Query sees a
  normal cancellation, while **a timeout is a failure** — `ApiError(408,
  'client/timeout')`.

The `Authorization` header has its seam (`config.getAccessToken`) and nothing
behind it. **Refresh-on-401 is not built**: the contract it must meet is written
in the file at the one point where it belongs. See §8.

**`src/lib/api/ApiError.ts`** — a typed error, so the UI can tell failures apart:

```ts
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly fields?: Record<string, string>,  // 422 validation, per field
    message?: string,
  ) { super(message ?? `Request failed (${status})`); }
}
```

This matters here specifically. A marketplace has failures that must be
distinguished: `401` expired session, `403` KYC not approved, `409` lot already
sold or bid outbid, `422` contract terms invalid. One generic `Error` string
cannot drive the right UI for any of them.

Alongside it, `CLIENT_ERROR_CODES` names the failures that never reached the
server — no base URL, timeout, network, a 2xx whose body was not JSON — so a
screen can tell "the server said no" from "we never got an answer".

**`src/features/<feature>/services/*.ts`** — one function per endpoint, typed
both ways, no React:

```ts
export const getLots = (q: LotQuery, signal?: AbortSignal) =>
  http.get<Paginated<Product>>('/lots', { query: q, signal });

export const placeBid = (auctionId: string, amount: Money) =>
  http.post<Bid>(`/auctions/${auctionId}/bids`, { amount });
```

`src/features/catalog/services/catalogService.ts` is the one that exists —
`getLots`, `getLot` and the `catalogKeys` query keys. **Copy it.** It shows the
three things easy to get wrong: the signal threaded through, the query mapping
kept in one named function so a rename is a type error, and the keys declared
next to the calls they belong to.

### 5.2 Server state belongs to TanStack Query, not to `AppState` **[current]**

Fetched data is **not** UI state. It has loading, error, staleness and refetch
semantics that an 80-field object cannot express. Keep them apart:

- **Server state** (lots, orders, auctions, bids, documents) → TanStack Query.
- **UI state** (which tab is open, filter rail visibility, wizard step, draft text) → Context slices (§6).

Configured once in `lib/queryClient.ts`, not per hook:

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, err) =>
        err instanceof ApiError && err.status >= 500 && count < 2,  // never retry 401/403/409
    },
  },
});
```

That predicate is exported as `shouldRetry` so it can be tested directly, and it
is deliberately narrow: a non-`ApiError` is a bug in a query function and a
status of `0` or `408` never reached the server, so neither is retried. Retrying
a `409` would repeat a trade action.

`QueryClientProvider` is mounted in `App.tsx` inside `BrowserRouter` and around
`AppStateProvider`; `tests/render.tsx` mirrors it with a fresh client per render,
so one test's cache cannot leak into the next.

Query keys are hierarchical and include **every** parameter that changes the
result, or you will serve a stale catalog after a filter change:

```ts
['lots', { category, grade, sellerType, sort, page }]
['auctions', auctionId, 'bids']
```

Live bidding needs more than polling: put the socket or SSE subscription in
`lib/api/`, and have it write into the query cache via `setQueryData` so
components stay unaware of the transport. **[target]**

### 5.3 Migration path off the hardcoded data **[target]**

`src/constants/{catalog,orders,auctions,courses}.ts` currently *are* the
database. Per feature: add the service and the query hook, switch the view model
to read from it, then demote the constants file to `tests/fixtures/` so the
visual-diff suite keeps a stable dataset. Do not delete them — they are what
makes the pixel tests reproducible.

Nothing has migrated yet. `useCatalogViewModel` is the first candidate, and it
is intentionally still on `PRODUCTS`: switching it needs an endpoint, plus a
decision about what the screen renders while the first request is in flight —
the design has no loading state, so inventing one is a visual-diff change and
belongs in its own commit, not smuggled in with the fetch.

---

## 6. State **[current]**

The 80 fields are split across **fifteen slices** in `src/store/slices/`, one per
area of the product. `AppState` is their union and is still **one object at
runtime**, so `setState` keeps its shallow-merge semantics and a single patch may
span slices atomically — which several flows rely on (signing in sets session,
KYC and navigation fields at once).

```
src/store/slices/
├── sessionSlice.ts      authed, authStage, authMethod, authMode, authRole,
│                       authOpen, authVerifying, pendingResume
├── kycSlice.ts          kycStage, kycIdType, kycShots, kycSelfie, kycStatus, kycReturn
├── catalogSlice.ts      query, homeFilter, gradeF, sellerF, sort, showFilters
├── productSlice.ts      activeId, qty, payMethod
├── sellSlice.ts         sellStep, sellForm
├── ordersSlice.ts       orderFilter, orderTab, trackId
├── auctionsSlice.ts     aucTab, aucId, bidValue, outbidDismissed
├── academySlice.ts      acTrack, courseId, lessonIdx, lessonDone, playing
├── howItWorksSlice.ts   hiwChapter, hiwPlaying, hiwTopic, hiwOverlay (+ HIW_SEEN_KEY)
├── accountSlice.ts      accountTab, accEditKind, accForm, accSaved, accDocName,
│                       accDocUploaded, accDocSubmitted, accPayType, accPayNetwork,
│                       accPayouts, accToggles, accRevoked
├── asmSlice.ts          asmStep, asmElig, asmMin, asmDocs, asmGps, asmForm
├── tradeSlice.ts        negotiation + contract + LC + bank (17 fields)
├── passportSlice.ts     passportQ, passportShown
├── navigationSlice.ts   route
└── uiSlice.ts           modal
```

`tradeSlice` stays whole deliberately: its five screens are one sequential
process whose fields co-change, so splitting it would leave most view models
subscribing to two or three sub-slices for no reduction in renders. `navigation`
and `ui` are separate for the opposite reason — `route` changes on every
navigation and the shell reads it, while `modal` changes independently.

### 6.1 Reading state

Each slice has its own context, so a consumer re-renders **only** when a field of
its own slice changes. `src/store/useSliceOf.ts` projects a stable sub-object out
of the one state object and keeps its identity until one of its fields actually
changes; `context/sliceContexts.tsx` fans the state out into the fifteen
providers.

Use the narrow hook for the slice you need — never the whole state:

```ts
const { query, sort, setState, go } = useCatalogState();   // catalog changes only
const { lcStatus, lcExam, setState, go } = useTradeState(); // trade changes only
```

A consumer that spans areas calls several, taking `setState`/`go` from one:

```ts
const { authed } = useSessionState();
const { kycStatus } = useKycState();
const { route } = useNavigationState();
const { setState, go } = useAppActions();   // writers only, never re-renders
```

The hooks are all in `@/hooks/useAppState`:
`useSessionState`, `useKycState`, `useCatalogState`, `useProductState`,
`useSellState`, `useOrdersState`, `useAuctionsState`, `useAcademyState`,
`useHowItWorksState`, `useAccountState`, `useAsmState`, `useTradeState`,
`usePassportState`, `useNavigationState`, `useUiState`, plus `useAppActions`.

`useAppState()` still returns `{ state, setState, go }` over the whole state. It
subscribes to **everything**, so it is a fallback for a genuinely app-wide
consumer, not the default. No file in `src/` uses it today.

### 6.2 Writing state

`setState` is unchanged and still patches **any** field, across slices, with
shallow merge; function patches receive the whole previous `AppState`. Nothing
about multi-area updates had to change:

```ts
setState({ modal: null, kycStage: 'why', kycReturn: back });   // three slices, one patch
setState((s) => ({ accForm: { ...s.accForm, pw: '' } }));       // reads whole prev state
```

### 6.3 Rules for new state

- **Put the field in the slice that owns it**, and add it to that slice's
  interface, its initial value **and** its `*_KEYS` array.
  `tests/store/slices.test.ts` fails if those three disagree — a missing key means
  a field that silently never triggers a re-render.
- **Server data never goes in a slice.** It belongs to Query (§5.2).
- **Derived values are never stored.** Compute them in the view model. `nActive`
  in `useCatalogViewModel` is the right pattern.
- **Navigation stays in `context/AppStateContext`.** `go()` and the
  `route ↔ URL` reconciliation are correct as written; leave them alone.
- Keep `RouteKey` as the internal identity and `ROUTE_PATHS` as the only place a
  URL string is written.
- **Memoise view models on the fields they read**, never on a whole slice object
  or on `state`.

---

## 7. Styling **[current → target]**

### 7.1 Today, and why

The design is a Design Canvas document whose logic layer computes **inline CSS
strings**. Those strings were carried across verbatim and are parsed at render
time by `utils/css.ts`; `styles/global.css` is a byte-for-byte copy of the
design's `<style>` block. This is what makes the port pixel-identical, and it was
the correct trade for the port.

The cost is now measurable: **1,334 inline `style={}` against 154 `className`**,
1,335 `css()` calls across 36 files, and view models returning CSS
(`filterBtnStyle`, `filterRailStyle`, `catalogGrid`) with hex colours
concatenated in logic files.

### 7.2 Target

1. **Promote colours and spacing to CSS variables** in `constants/tokens.ts` +
   `global.css`. Hex literals stop appearing in `.ts` files.
2. **Build `components/ui/` primitives** — Button, Input, Select, Chip, Card,
   Badge, Field, Table — each owning its own styling. They are what the 22 pages
   are currently re-inlining by hand.
3. **Move style strings out of view models into the components that render them.**
   A view model may return a *variant name* (`variant: 'primary' | 'ghost'`),
   never a CSS string.
4. **Convert page by page, under the visual-diff suite.** `npm run visual` is the
   safety net that makes this refactor safe: a converted page must still diff
   clean against the design. Keep `utils/css.ts` for any page not yet converted.

Rule for new code: **new screens use primitives and `className`.** Inline
`css()` strings are for design-ported code only, never for new work.

---

## 8. Auth and KYC **[target — the security model does not exist]**

Today `state.authed` is a client boolean and `useActions.requireKyc` gates
actions in the browser. **Browser gates are UX, not security.** Nothing here is
enforced.

The target model:

| Piece | Where | Rule |
|---|---|---|
| Token storage | `lib/auth/` | Access token in memory; refresh token in an httpOnly cookie. Never `localStorage`. |
| Header injection | `lib/api/httpClient` | Every request. One place. **The seam exists** (`config.getAccessToken`) and nothing is behind it. |
| Refresh | `lib/api/httpClient` | **Not built.** On 401: refresh once, replay the request, then fail to the login overlay. One in-flight refresh shared by concurrent requests, or a screen with four queries fires four and invalidates its own new token. The contract is written in the file, at the point it goes. |
| Session state | `store/slices/sessionSlice` | Derived from the token, never set by a UI handler. |
| Route protection | `routes/AppRoutes.tsx` | A `<RequireAuth>` wrapper around the authenticated subtree. |
| KYC gating | **server** | Every trading endpoint re-checks KYC. `requireKyc` stays, as the *prompt*, not the *gate*. |

Non-negotiable: **bidding, order creation, contract signing, LC presentation and
payout changes must be authorised server-side.** The client decides what to show,
never what is allowed.

---

## 9. Testing

| Layer | Tool | Covers |
|---|---|---|
| Unit | Vitest | `utils/` (css parsing, formatting), view-model logic |
| Component/integration | Vitest + RTL (`tests/render.tsx`) | Rendering, navigation, user flows |
| Visual regression | Playwright + pixelmatch (`npm run visual`) | Every screen vs. the design at 1440 and 1366 |
| Responsive | `npm run audit:responsive` | 22 routes × 5 viewports, overflow and console errors |

**Gap:** 323 lines of behavioural tests for 13,372 lines of app (~2.4%). The
visual suite checks appearance, not rules. Priority additions, in order of
commercial risk:

1. `requireKyc` blocks bidding and order creation when `kycStatus !== 'verified'`
   — including the `pending` branch.
2. The LC state machine: presentation order, `lcExam` accept/refuse, `lcPaid`
   transitions.
3. Negotiation: a counter-offer updates the correct conversation; accepting one
   closes the others.
4. `routeFromPath` ↔ `ROUTE_PATHS` round-trip for all 22 routes, and the
   unknown-path fallback.
5. Every new service gets a test with a mocked `ApiError` per status it can return.

---

## 10. Conventions

| Thing | Convention | Example |
|---|---|---|
| Component file | PascalCase `.tsx`, named export | `AuctionDetailPage.tsx` |
| Hook file | camelCase `.ts`, `use` prefix | `useAuctionsViewModel.ts` |
| View model | `use<Feature>ViewModel` | `useKycViewModel` |
| Service file | `<domain>Service.ts`, one function per endpoint | `auctionService.ts` |
| Types | Interfaces in `types/index.ts`; unions for closed sets | `KycStage`, `SortKey` |
| Constants | `SCREAMING_SNAKE` for tables, camelCase for config | `ROUTE_PATHS`, `PRODUCTS` |
| Imports | **Always `@/`** — never `../../` | `import { Header } from '@/components/layout/Header'` |
| Route addition | Add to `RouteKey` → `ROUTE_PATHS` → `AppRoutes` | all three, or it breaks |

**The import rule is enforced in lint** — `eslint.config.js` carries:

```js
'no-restricted-imports': ['error', { patterns: [{ group: ['../../*'], message: … }] }]
```

Without it the `@/` convention decays — the sibling admin project configured the
same alias and uses it zero times.

---

## 11. Build, environment, deployment

```bash
npm run dev        # Vite dev server, :5173
npm run build      # tsc -b && vite build → dist/
npm run typecheck  # tsc -p tsconfig.app.json --noEmit
npm run lint
npm test
```

**TypeScript** is split three ways: `tsconfig.app.json` (src + tests, DOM libs),
`tsconfig.node.json` (vite/playwright config, node types), `tsconfig.json`
(solution references only). Keep it that way — it stops DOM globals leaking into
build scripts.

**Environment:** only `VITE_*` variables reach the client, and **they are baked in
at build time**, not read at runtime. `VITE_API_BASE_URL` is currently unused;
once §5 lands, each environment needs its own build or a runtime config endpoint.
Never put a secret in a `VITE_` variable — it ships to the browser.

**Deployment [target]:** this is a browser-router SPA, so the host **must** serve
`index.html` for every unmatched path or all 22 deep links 404 on refresh. No
deployment artifact exists yet; add one (nginx config, `_redirects`, or
`vercel.json`) with:
- SPA fallback to `index.html`
- long-lived immutable caching for `dist/assets/*`, `no-cache` for `index.html`
- gzip/brotli
- security headers: CSP, `X-Content-Type-Options`, `Referrer-Policy`

**Version control:** this folder is **not a git repository**. Initialise one
before any of the refactors in this document.

---

## 12. Decisions, and why

| Decision | Rationale |
|---|---|
| **Vite SPA, not Next.js** | The app is an authenticated trading console behind a login. It gains little from SSR, and migrating 79 files, 22 routes and 1,334 inline styles to App Router would invalidate the pixel-diff suite that is this project's main quality guarantee. The public marketing surface, if one is needed, is a separate concern. |
| **React Router + a central route table, not file-based routing** | The design drives all 22 screens from one `route` key. `ROUTE_PATHS` keeps that internal identity while giving each screen a real URL, so `RouteKey` stays the single source of truth in view models. File-based routing would scatter that table across 22 directories. |
| **Feature modules, not flat by-type** | 15 domains and 22 screens. `features/trade/` keeps negotiation, contract, LC, bank and shipment together; a flat `hooks/` folder with 21 view models tells you nothing about ownership. |
| **View models separate from pages** | The design's logic layer ported function-for-function, keeping the two diffable; and logic became testable without a DOM. |
| **Inline design styles, for now** | The only way to keep the port pixel-exact across ~2,300 markup lines. Being migrated behind primitives (§7), under the visual suite. |
| **Context now, Query later** | There is no backend yet. When there is, server state goes to Query and Context keeps UI state only — not both in one 80-field object. |
| **React 18, not 19** | No feature of 19 is needed, and the visual baselines are verified against 18's output. |

### Known gaps, tracked

1. ~~No data layer~~ — built, but no endpoint is wired and no screen fetches, §5
2. ~~80-field god state in one context~~ — split into fifteen slices, §6
3. Styling bypasses any style system — §7
4. No real auth; KYC enforced client-side only — §8
5. No UI primitive layer; pages up to 521 lines — §3, §7
6. Behavioural test coverage ~2.4% — §9
7. ~~No git repository~~ — initialised; no deployment artifact yet, §11

Each is a deliberate consequence of prioritising design fidelity first. They are
listed so the next person does not mistake them for oversights — and they are the
work queue, in roughly this order.
