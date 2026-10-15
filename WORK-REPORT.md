# Mineral Bridge — Architecture Review and Refactor Report

**Date:** 2026-10-15
**Scope:** frontend architecture of the Mineral Bridge platform (buying and selling minerals)
**Projects examined:** 4 — three scaffolds and one real application

---

## 1. What was asked

Two questions, in order:

1. Is the project architecture / folder structure correct, and what will be difficult to handle?
2. Is the frontend architecture file correct for the web app — and if not, produce the right one.

Both were answered, and the two highest-priority gaps the answer identified were then built and verified.

---

## 2. Headline finding

**The architecture file was wrong. It described a different application than the one that exists.**

`C:\js\min-clone\mineral-bridge-web-app-main` — the file presented as defining the conventions — specifies a **Next.js 16 App Router** app with folders grouped **by file type**. The actual application, `Mineral_Bridge_Web_Final`, is a **Vite + React Router SPA** organised **by feature**. They disagreed on every load-bearing decision:

| Decision | Architecture file | Actual app | Compatible |
|---|---|---|---|
| Framework | Next.js 16, `output: standalone` | Vite 5.4 SPA | **No** |
| React | 19.2 | 18.3 | **No** — different major |
| Routing | File-based `app/**/page.tsx` | React Router 6 + central route table | **No** |
| Rendering | Server Components default | 100% client | **No** |
| Folders | Flat by type | By feature | **No** |
| Styling | CSS Modules | Inline CSS strings parsed at runtime | **No** |
| Data layer | `services/api.ts` present | **absent** | — |
| Shared state | none | 80-field object in one context | — |
| Tests | none installed | Vitest + RTL + Playwright pixel-diff | — |

Adopting it would have been a **full rewrite** of 79 files, 22 screens and 13,372 lines — not a refactor — for no stated benefit.

**Why it was wrong:** it and its sibling scaffolds all claim to follow `selorg-web-app` / `selorg-admin-dashboard` from "the Selorg Application reference". **That reference does not exist anywhere on the machine.** The files are generic starters copied from another product, with `SampleItem` / `getSamples` placeholders never replaced by Mineral Bridge's real domain (`Product`, `Order`, `Auction`, `ContractTerms`, `KycStatus`). They were written *beside* the app, not from it.

**Also worth saying plainly:** on its own merits the scaffold's flat-by-type layout was the *weaker* of the two designs for this product. With 22 screens across 15 business domains, flat `components/` and `hooks/` folders become dumping grounds. The real app had already made the better call. **The app's structure was more correct than the document meant to govern it.**

---

## 3. The four projects, as found

| Project | Stack | Size | Assessment |
|---|---|---|---|
| `Mineral_Bridge_Web_Final` | Vite + React 18 + RR6 | **13,372 LOC**, 79 files, 22 screens, 15 features | **The real app.** Structure sound; four foundations missing. |
| `mineral-bridge-web-app-main` | Next.js 16 | 11 files, one `sample` feature | Wrong architecture for this product. **Discard.** |
| `mineral-bridge-admin-dashboard-main` | Vite + React 19 + RR7 | **91 LOC**, 15 files | Sound layout, but an empty scaffold; conventions already bypassed. |
| `mineral-bridge-mobile-app-main` | React Native 0.83 | 14 files | Reviewed for contract drift only. Cannot ship — API URL hardcoded. |

### The cross-project risk

`SampleItem` was defined **three times, identically**, in three repos. `apiRequest` was implemented **three times** with three incompatible base-URL strategies (Vite dev proxy / `NEXT_PUBLIC_API_BASE_URL` / hardcoded platform constants). No shared package, no workspace, no OpenAPI schema.

Consequence: the day the server renames a field, three repos must be fixed and **nothing tells you which one you missed** — no type error, no failing test. With three clients and one evolving contract, that is the normal case, not an edge case.

---

## 4. Problems found in the real app

Ranked by cost of leaving them.

| # | Problem | Evidence | Status |
|---|---|---|---|
| 1 | No data layer at all | **0 `fetch` calls** in 13,372 LOC; all 22 screens read hardcoded arrays from `src/constants/` | **Built** (§6) |
| 2 | 80-field god state in one context | One `AppState`, one context value → every change re-rendered every consumer | **Fixed** (§6) |
| 3 | Styling bypasses any style system | **1,334 inline `style={}` vs 154 `className`**; view models returned CSS strings and concatenated hex colours | Open |
| 4 | No real auth | `authed` a client boolean; KYC gated in the browser only | Open |
| 5 | No UI primitive layer | `components/common/` held 5 items; pages up to **521 lines** re-inlining buttons and inputs | Open |
| 6 | Thin behavioural tests | 323 LOC of tests for 13,372 LOC (~2.4%); visual suite checks appearance, not rules | Partly addressed |
| 7 | Not under version control | No git repository in `C:\js\mineralbridge-full` | **Fixed** |

Problems 3 and 5 are a *deliberate* consequence of the pixel-faithful port and were correct for that goal — they are listed as debt, not as mistakes.

---

## 5. Documents delivered

| File | Purpose |
|---|---|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | **The corrected architecture file.** Authoritative; supersedes the Next.js scaffold. Sections marked `[current]` vs `[target]` so the gap between intent and reality is never hidden. Covers stack, directory structure, the feature-module rule, layering (what may import what), the data layer, state, styling, auth, testing, conventions, build/deploy, and the reasoning behind each decision. |
| [`ARCHITECTURE-REVIEW.md`](ARCHITECTURE-REVIEW.md) | The verdict: why the scaffold was wrong, what the app gets right, the 7 problems, and a recommended order. |
| `../../min-clone/mineral-bridge-admin-dashboard-main/ARCHITECTURE-REVIEW.md` | Separate review of the admin scaffold. |

---

## 6. Work built and verified

Two refactors, run in parallel, both required not to change a single pixel.

### 6.1 Data-access foundation — commit `cc6d5ff`

- `src/lib/api/httpClient.ts` — the only place `fetch` appears. Base URL from `VITE_API_BASE_URL`, `get`/`post`/`patch`/`delete`, query encoding, cancellation, timeout, and a documented seam for the `Authorization` header and refresh-on-401.
- `src/lib/api/ApiError.ts` — typed error carrying `status`, `code` and per-field `fields` for 422 validation. This is what lets the UI tell *expired session* from *KYC not approved* from *lot already sold* — distinctions a mineral marketplace cannot do without, and which the previous single `throw new Error(...)` made impossible.
- `src/lib/queryClient.ts` — TanStack Query with `staleTime: 30s` and a retry predicate that retries only `status >= 500`, never a 401/403/409.
- `src/features/catalog/services/catalogService.ts` — `getLots` / `getLot`, typed against the existing `Product`, as the pattern to copy.
- `QueryClientProvider` mounted in `src/App.tsx`.
- 42 tests.

**Deliberately not wired:** no screen fetches yet. There is no backend. This is plumbing, ready for the first endpoint — and `ARCHITECTURE.md` §5 says exactly that rather than overclaiming.

### 6.2 State slice refactor — commit `7ae98e6`

49 files, +1,509 / −615.

- The 80 fields now live in **15 slice modules** under `src/store/slices/`, one per product area.
- `AppState` is their union and **still one object at runtime**, so `setState` is unchanged: same shallow merge, patches still span slices atomically, function patches still receive the whole previous state. Several flows depend on that — signing in sets session, KYC and navigation fields in one patch.
- Each slice has **its own context**, so a consumer re-renders only when a field of its own slice changes. `src/store/useSliceOf.ts` keeps a slice's object identity stable until one of its fields actually changes.
- **All 25 consumers** — 21 view models plus Header, KycBanner, TradeNav, Footer, Modal and `useActions` — now read through a narrow hook (`useCatalogState`, `useTradeState`, `useSessionState`, …). **Nothing in `src/` subscribes to the whole state any more.** `useAppActions()` gives writers `setState`/`go` with no subscription at all.
- `tradeSlice` was kept whole deliberately: its five screens are one sequential process whose fields co-change, so splitting it would leave most view models subscribing to two or three sub-slices for no reduction in renders. `navigation` and `ui` were split for the opposite reason.
- 21 tests, including drift guards that fail if a field is added to a slice without being added to its key array — the one way this design can silently rot.

### 6.3 Verification

| Check | Result |
|---|---|
| Pixel diff, all screens | **21 of 21 byte-identical**; every height delta 0; worst case 0.03% |
| Responsive audit | **110 route/viewport combinations**, no horizontal overflow, no console errors |
| TypeScript | clean |
| ESLint | clean |
| Tests | **97 passing** across 7 files |
| Production build | **succeeds** — 173 modules, 488 kB JS / 129 kB gzipped |

**Neither refactor moved a pixel.** For a port whose entire quality guarantee is design fidelity, that was the acceptance criterion, and it was met.

---

## 7. State of the codebase now

```
Mineral_Bridge_Web_Final
├── 101 source files · 14,559 LOC   (was 79 files · 13,372)
├── 1,121 LOC of tests · 97 tests   (was 323 LOC · 34 tests)
└── 4 commits on master (no remote)
```

```
7ae98e6  Split the 80-field AppState into fifteen per-feature slices
32847c0  Mark ARCHITECTURE.md section 5 as current, and record what is not wired
cc6d5ff  Add the data-access foundation: httpClient, ApiError, Query client
974de07  Initial commit: Mineral Bridge web app as ported from the Design Canvas prototype
```

---

## 8. What remains

In the order `ARCHITECTURE.md` recommends.

| # | Work | Why it is next |
|---|---|---|
| 1 | **Design the auth model** — tokens, refresh, server-enforced KYC | Shapes the router and the HTTP client. The hardest thing to retrofit, and it gets worse per screen added. Bidding, order creation, contract signing, LC presentation and payout changes **must** be authorised server-side. |
| 2 | **Wire the first endpoints** and migrate `src/constants/` data to fixtures | The plumbing is in; nothing uses it. Do catalog first, the service already exists. |
| 3 | **Single source of API types** — shared workspace package or OpenAPI codegen | Kills the three-way contract drift between web, admin and mobile permanently. |
| 4 | **Extract `components/ui/` primitives** with CSS variables | Stops the 1,334-inline-style tax compounding. The pixel suite makes this refactor safe. |
| 5 | **Behavioural tests** for KYC gating, the LC state machine, negotiation | The rules with money attached. The visual suite checks appearance, not rules. |
| 6 | **Deployment artifact** — SPA fallback, caching, security headers | Without an `index.html` fallback every deep link 404s on refresh. |
| 7 | **Mobile:** move the hardcoded API URL into env config | It cannot ship otherwise. |

---

## 9. Caveats

Stated plainly rather than left for someone to discover.

- **No screen fetches yet.** §6.1 is plumbing. The app still runs entirely on bundled design data.
- **Styling is untouched** — still 1,334 inline styles to 154 classNames. Out of scope here, and the largest remaining debt.
- **Auth is still a client-side boolean.** Nothing is enforced.
- **Test coverage is better but still thin for behaviour.** Most of the 63 new tests cover the new infrastructure; the business rules remain largely untested.
- **The admin dashboard and mobile app were reviewed, not changed.** The admin project is 91 lines and still has no auth, no typed errors, no tests, and declares a `@/` alias it uses zero times.
- **Committed to `master` with no remote.** Normally this work would sit on a branch; here the repo was created today, has no remote, and the parallel commits were already on `master`, so splitting it would have fragmented one day's work. Trivially movable — nothing is pushed.
- **No `.gitattributes`.** Git will normalise LF to CRLF on Windows checkouts; a cross-platform clone will show whole-file diffs until `* text=auto eol=lf` is added.
- **Pixel verification compared the app against its own pre-refactor captures and the design source**, at 1440 and 1366. Widths below 1000px are covered by the responsive audit (overflow and console errors), not by pixel diffing — the design ships no baseline below 1000px.

---

## 10. Bottom line

The folder structure was right; the document describing it was wrong, and the foundations underneath it were missing. The structure has been kept, the document replaced with one that matches reality and marks its own gaps honestly, and the two deepest gaps — no data layer, and an 80-field state object in a single context — have been closed and verified not to have changed a single pixel of a pixel-faithful application. What remains is sequenced in §8, and auth is the piece that should not wait.
