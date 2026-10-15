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
| Server state | none **[current]** → **TanStack Query** **[target]** | §5 |
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
    │   ├── services/           [target] HTTP calls for this domain (§5)
    │   └── constants.ts        Feature-local constants
    │
    ├── components/
    │   ├── ui/                 [target] Primitives: Button, Input, Chip, Card, Badge, Field
    │   ├── common/             Cross-feature pieces: Icon, Glyphs, Modal, InfoNote, Breadcrumb
    │   └── layout/             Shell: Header, TradeNav, KycBanner, Footer
    │
    ├── lib/                    [target] Framework-facing infrastructure
    │   ├── api/                httpClient, ApiError, interceptors
    │   ├── auth/               token storage, refresh, session
    │   └── queryClient.ts      TanStack Query configuration
    │
    ├── store/
    │   ├── appState.ts         [current] 80-field AppState + initialState
    │   └── slices/             [target] per-feature state slices (§6)
    ├── context/
    │   └── AppStateContext.tsx AppStateProvider: state, setState, go — keeps route ↔ URL in sync
    ├── hooks/                  App-wide hooks: useAppState, useActions
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
└── services/auctionService.ts      [target] HTTP for this domain
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

## 5. Data layer **[target — does not exist yet]**

Today there are **zero `fetch` calls**; all 22 screens read hardcoded arrays from
`src/constants/`. This is the largest piece of work remaining and needs the
structure below in place **before** the first endpoint is wired, or HTTP calls
will end up scattered through view models.

### 5.1 Three layers, no shortcuts

```
view model  →  feature service  →  lib/api/httpClient  →  backend
```

**`src/lib/api/httpClient.ts`** — the only place `fetch` appears. Owns the base
URL (`VITE_API_BASE_URL`), JSON encoding, the `Authorization` header, refresh-on-401,
timeouts and cancellation.

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

**`src/features/<feature>/services/*.ts`** — one function per endpoint, typed
both ways, no React:

```ts
export const getLots = (q: LotQuery, signal?: AbortSignal) =>
  http.get<Paginated<Product>>('/lots', { query: q, signal });

export const placeBid = (auctionId: string, amount: Money) =>
  http.post<Bid>(`/auctions/${auctionId}/bids`, { amount });
```

### 5.2 Server state belongs to TanStack Query, not to `AppState`

Fetched data is **not** UI state. It has loading, error, staleness and refetch
semantics that an 80-field object cannot express. Keep them apart:

- **Server state** (lots, orders, auctions, bids, documents) → TanStack Query.
- **UI state** (which tab is open, filter rail visibility, wizard step, draft text) → Context slices (§6).

Configure once in `lib/queryClient.ts`, not per hook:

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

Query keys are hierarchical and include **every** parameter that changes the
result, or you will serve a stale catalog after a filter change:

```ts
['lots', { category, grade, sellerType, sort, page }]
['auctions', auctionId, 'bids']
```

Live bidding needs more than polling: put the socket or SSE subscription in
`lib/api/`, and have it write into the query cache via `setQueryData` so
components stay unaware of the transport.

### 5.3 Migration path off the hardcoded data

`src/constants/{catalog,orders,auctions,courses}.ts` currently *are* the
database. Per feature: add the service and the query hook, switch the view model
to read from it, then demote the constants file to `tests/fixtures/` so the
visual-diff suite keeps a stable dataset. Do not delete them — they are what
makes the pixel tests reproducible.

---

## 6. State **[current → target]**

### 6.1 Today

`src/store/appState.ts` holds a single `AppState` with **80 fields** spanning
auth, KYC, selling, orders, auctions, academy, account, negotiation, contracts,
LC and banking. `AppStateProvider` exposes `{ state, setState, go }` with
shallow-merge semantics mirroring the source design, and keeps `state.route` in
sync with the real URL in both directions.

This was the right call for a faithful port. It does not scale: one context value
means **every** change re-renders every consumer, and no feature owns its own
state.

### 6.2 Target — slice it, keep the API

Split the object by feature while keeping `useAppState()` as the public
interface, so view models change little and the refactor can go one feature at a
time:

```
src/store/slices/
├── sessionSlice.ts     authed, authStage, authMode, pendingResume
├── kycSlice.ts         kycStage, kycStatus, kycShots, kycSelfie, kycReturn
├── catalogSlice.ts     query, homeFilter, gradeF, sellerF, sort, showFilters
├── sellSlice.ts        sellStep, sellForm
├── asmSlice.ts         asmStep, asmElig, asmMin, asmDocs, asmGps, asmForm
├── tradeSlice.ts       negId, negDraft, ct, ctSigned, lcStatus, lcDocs, bankStatus
├── accountSlice.ts     accountTab, accForm, accSaved, accPayouts, accToggles
└── uiSlice.ts          modal, hiwOverlay, authOpen, passportShown
```

Then expose per-slice hooks so a component subscribes only to what it reads:

```ts
const { query, sort, setSort } = useCatalogState();   // re-renders on catalog changes only
```

Rules for new state:
- **Server data never goes in a slice.** It belongs to Query (§5.2).
- **Derived values are never stored.** Compute them in the view model. `nActive`
  in `useCatalogViewModel` is the right pattern.
- **Navigation stays in `context/AppStateContext`.** `go()` and the
  `route ↔ URL` reconciliation are correct as written; leave them alone.
- Keep `RouteKey` as the internal identity and `ROUTE_PATHS` as the only place a
  URL string is written.

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
| Header injection | `lib/api/httpClient` | Every request. One place. |
| Refresh | `lib/api/httpClient` | On 401: refresh once, replay the request, then fail to the login overlay. |
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

**Enforce the import rule in lint.** Add to `eslint.config.js`:

```js
'no-restricted-imports': ['error', { patterns: ['../../*'] }]
```

Without it, the `@/` convention decays — the sibling admin project configured the
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

1. No data layer — §5
2. 80-field god state in one context — §6
3. Styling bypasses any style system — §7
4. No real auth; KYC enforced client-side only — §8
5. No UI primitive layer; pages up to 521 lines — §3, §7
6. Behavioural test coverage ~2.4% — §9
7. No git repository, no deployment artifact — §11

Each is a deliberate consequence of prioritising design fidelity first. They are
listed so the next person does not mistake them for oversights — and they are the
work queue, in roughly this order.
