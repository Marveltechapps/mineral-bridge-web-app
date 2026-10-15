# Architecture Review — Mineral Bridge Web

**Date:** 2026-10-15

**Two things were compared:**

| | Path | What it is |
|---|---|---|
| **A — the architecture file** | `C:\js\min-clone\mineral-bridge-web-app-main` | A **Next.js 16 App Router** scaffold, 11 source files, one `sample` feature. Claims to define the conventions. |
| **B — the actual app** | `C:\js\mineralbridge-full\Mineral_Bridge_Web_Final` | A **Vite + React Router** SPA, 79 source files, **13,372 LOC**, 22 screens, 15 features, Buy/Sell/Auctions/Trade/KYC all built. |

---

## 1. Answer: No, the architecture file is not correct

**It does not describe the application you built. It describes a different application.**

The two disagree on every load-bearing decision:

| Decision | A — architecture file | B — actual app | Compatible? |
|---|---|---|---|
| Framework | **Next.js 16** (App Router, `output: 'standalone'`) | **Vite 5.4.9** SPA | **No** |
| React | 19.2.8 | **18.3.1** | **No** — different major |
| Routing | File-based (`src/app/**/page.tsx`) | **React Router 6.26.2** + central `ROUTE_PATHS` table | **No** |
| Rendering | Server Components by default, `'use client'` opt-in | 100% client | **No** |
| Folder organisation | Flat **by file type** (`components/`, `hooks/`, `services/`) | **By feature** (`features/<name>/{pages,hooks,components}`) | **No** |
| Data layer | `services/api.ts` + `apiRequest` + per-feature services | **None. Zero `fetch` calls in 13,372 LOC** | — |
| Shared state | None | 80-field `AppState` in one Context | — |
| Styling | CSS Modules | Inline CSS strings parsed at runtime (`utils/css.ts`) | **No** |
| Tests | None installed | Vitest + RTL + Playwright visual diffing | — |

Adopting file A is not a refactor — it is a **full rewrite**: Vite → Next, React Router → App Router, client → server components, React 18 → 19, and re-homing all 79 files. For a 13,372-line app that already works and is pixel-verified against its design, that is not justified by anything in the document.

### Why it ended up wrong

Both A and the sibling admin scaffold say they follow `selorg-web-app` / `selorg-admin-dashboard` from "the Selorg Application reference". **That reference does not exist anywhere on this machine.** So file A is a generic starter copied from another product's conventions, with `SampleItem` / `getSamples` placeholders never replaced by Mineral Bridge's real domain (`Product`, `Order`, `Auction`, `Lot`, `KycStatus`, `ContractTerms`). It was written *beside* the app, not *from* it.

### One more reason not to adopt it

Even on its own terms, A's flat-by-type layout is the weaker choice **for this product**. With 22 screens across 15 business domains, `components/` and `hooks/` as flat folders become dumping grounds — you cannot tell which of 60 hooks belongs to auctions and which to KYC, and deleting a feature means hunting its files across five directories. Your app already made the better call: `features/trade/` holds negotiation, contract, LC, bank and shipment together. **B's structure is more correct than A's.**

---

## 2. What the actual app gets right

Keep all of this:

- **Feature-module layout.** `src/features/<feature>/{pages,hooks,components}` — 15 features, 22 pages, 21 view-model hooks. Correct for a product this size, and it scales.
- **The view-model pattern.** Every page has a `use<Feature>ViewModel` hook holding the logic; the page component only renders. Pages stay declarative and logic is unit-testable without mounting a DOM.
- **A central route table.** `src/constants/routes.ts` maps `RouteKey → URL` both ways, so deep links, back/forward and shareable URLs all work even though the original design was a single-state prototype. `routeFromPath` falling back to `home` plus the `path="*"` catch-all means no dead URLs. This was careful work.
- **Correct layering of the shell.** `MainLayout` composes Header / TradeNav / KycBanner / Outlet / Footer / overlays in one place; no page re-implements chrome.
- **Clean domain types.** `src/types/index.ts` is real domain modelling — `Product`, `Order`, `Auction`, `ContractTerms`, and a **discriminated union** for `NegotiationMessage` (`k: 'offer' | 'text' | 'system'`), which is exactly the right tool there.
- **Real test infrastructure.** Vitest + RTL, plus Playwright pixel-diffing every screen against the design source, plus a 110-combination responsive overflow audit. Most projects at this stage have none of this.
- **`@/` alias used consistently** — in both `vite.config.ts` and `tsconfig.app.json`, and actually used in the code. (The admin sibling configures it and never uses it.)
- **Good hygiene.** `.env` gitignored, `.env.example` committed with no secrets, `dist/` ignored, `no-explicit-any` set to `error`.

---

## 3. Real problems in the actual app

These are the things worth fixing — not the folder names.

### 3.1 One 80-field state object in one Context — **the top issue**
`src/store/appState.ts` defines a single `AppState` with **80 fields**, covering auth, KYC, selling, orders, auctions, academy, account, negotiation, contracts, LC and banking all at once. `AppStateProvider` puts the whole thing in one context value.

Consequences:
- **Every state change re-renders every consumer.** Typing one character in the search box produces a new context value, so the KYC, auctions and banking screens all re-render. View models use `useMemo` with narrow dependency arrays, which limits recomputation but not re-rendering.
- **No feature owns its state.** `lcBLDate`, `asmGps` and `negDraft` sit in the same object as `query`. Nothing stops the auctions screen writing a KYC field.
- **It cannot absorb server data.** When the API arrives you need loading, error and staleness per resource. Those do not fit in a flat boolean-and-string object.

This is understandable — the design was one `state` object and fidelity was the goal — but it is the thing that will hurt as the team grows.

### 3.2 Styling bypasses the style system entirely
**1,334 inline `style={}` attributes against 154 `className` uses**, with 1,335 `css()` parse calls across 36 files. View models return CSS strings alongside data — `useCatalogViewModel` returns `filterBtnStyle`, `filterRailStyle`, `catalogGrid` and a `box()` helper that concatenates hex colours by hand.

The decision was deliberate and is well documented in the README (it is what makes the port pixel-exact), so it was *right for the port*. But as the permanent architecture it costs you: no theming, no dark mode, no design tokens, hex literals scattered through logic files, no CSS caching or minification for 1,334 inline strings, and a "view model" layer that is really a view-model-plus-stylesheet.

### 3.3 There is no data layer at all
**Zero `fetch` calls in the entire codebase.** All 22 screens read hardcoded arrays from `src/constants/{catalog,orders,auctions,courses}.ts`. `VITE_API_BASE_URL` is declared in `.env.example` and used nowhere.

The README is honest about this. But it means the single largest remaining task — wiring a real backend to a buy/sell marketplace — has **no foundation to build on**: no HTTP client, no typed errors, no caching, no loading/error states, no optimistic updates for bidding. Ironically this is the one thing file A has and B does not, and it is why A should be mined for that one idea rather than adopted wholesale.

### 3.4 `authed` is a client-side boolean
`state.authed: boolean`, flipped by the auth overlay. No token, no session, no refresh, no `Authorization` header, no server check. KYC gating (`requireKyc`) is enforced entirely in the browser.

For a demo this is fine. For a platform that moves minerals against letters of credit, every one of those gates must be enforced server-side, and the client needs real session handling. This has to be designed before the API work starts, not after.

### 3.5 Feature code is 84% of the app, concentrated in very large pages
`features/` is **11,179 of 13,372 LOC (84%)**, against 721 for `components/`. Largest pages: `KycPage.tsx` 521, `AccountEditPage.tsx` 508, `SellPage.tsx` 487, `ProductPage.tsx` 426, `AsmPage.tsx` 406.

Pages that long are reading the design's markup top to bottom. There is almost no shared primitive layer — `components/common/` has only Icon, Glyphs, Modal, InfoNote, Breadcrumb. Buttons, inputs, chips, cards, badges and tables are re-inlined per page, so a change to button styling means editing 22 files.

### 3.6 Thin test coverage relative to size
323 lines of unit/integration tests (`app.test.tsx` 257, `utils.test.ts` 66) for 13,372 lines of app — about 2.4%. The visual and responsive tooling is genuinely good, but it checks *appearance*, not *behaviour*: nothing asserts that `requireKyc` blocks an unverified bid, that the LC state machine rejects an out-of-order presentation, or that a counter-offer updates the right conversation. Those are the rules that matter commercially.

### 3.7 Not under version control
`C:\js\mineralbridge-full` is not a git repository. 13,372 lines of pixel-verified work with no history, no branches, no way to revert. **Fix this first** — before any refactor below.

---

## 4. Verdict in one paragraph

File A is wrong and should not be adopted: it specifies Next.js App Router with flat by-type folders, while your app is a Vite + React Router SPA organised by feature — and your app's structure is the better of the two for a 22-screen marketplace. A's only genuinely useful contribution is the one layer your app lacks: a services/API boundary. So **keep B's structure, borrow A's `services/` idea, and discard the rest.** The real work ahead is not reorganising folders; it is splitting the 80-field god state into per-feature slices, adding a real data layer with server-enforced auth and KYC, and extracting a UI primitive layer so styling stops living in 1,334 inline strings. A corrected architecture document covering all of that is in [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 5. Recommended order

| # | Action | Why now |
|---|---|---|
| 1 | `git init` + first commit | Everything below is safer with history |
| 2 | **Discard file A.** Adopt [`ARCHITECTURE.md`](ARCHITECTURE.md) as the single source of truth | Stop the two documents contradicting each other |
| 3 | Add the `src/services/` + `src/lib/api/` layer: typed `ApiError`, `httpClient`, one service per domain | Prerequisite for all backend work |
| 4 | Design the auth model properly (tokens, refresh, server-side KYC gating) | Shapes routing and the HTTP client; hard to retrofit |
| 5 | Introduce React Query (or equivalent) for server state; keep Context for UI state only | Server state does not belong in the 80-field object |
| 6 | Split `AppState` into per-feature slices behind `useAppState` | Do it before the API work doubles the state |
| 7 | Extract `components/ui/` primitives (Button, Input, Chip, Card, Badge, Field) with CSS variables | Stops the inline-style tax compounding |
| 8 | Add behavioural tests for KYC gating, the LC state machine and negotiation | The rules with money attached |
| 9 | Keep the visual-diff suite running as the safety net during 6–7 | It is what lets you refactor styling without fear |
