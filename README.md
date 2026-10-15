# Mineral Bridge — Web

A React + TypeScript implementation of the **Mineral Bridge Web v2** design, built
with Vite. The design is reproduced exactly: every screen renders pixel-identical
to the source at desktop and laptop widths, verified by automated image diffing.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config, strict TypeScript rules) |
| `npm test` | Vitest + React Testing Library |
| `npm run audit:responsive` | Visit every route at five viewports and report horizontal overflow |
| `npm run visual` / `visual:authed` | Pixel-diff each screen against the original design |

## How the design is preserved

The source design (`design-source/Mineral Bridge Web v2.dc.html`) is a Design
Canvas document: a single component whose logic layer computes **inline CSS
strings** for every element, which the template then binds. Re-authoring that
styling by hand would have introduced drift on every one of its ~2,300 markup
lines, so instead:

- **Style strings are carried across verbatim** and parsed at render time by
  [`src/utils/css.ts`](src/utils/css.ts), which turns a CSS declaration string
  into a React style object (handling `url()`, gradients and vendor prefixes).
  Every declaration therefore reaches the DOM exactly as designed.
- **The global stylesheet is copied byte-for-byte** from the design's `<style>`
  block into [`src/styles/global.css`](src/styles/global.css) — keyframes,
  `.v2-*` utility classes, hover states and the original media queries at
  1240px / 1100px / 1000px.
- **Catalog, order, auction and course data** are transcribed unchanged into
  `src/constants/`, including the Wikimedia Commons imagery URLs the design uses
  (each layered over a gradient, so lots still render correctly offline).
- **The logic layer is ported function-for-function** into feature view-model
  hooks, keeping the design's own naming so the two can be diffed side by side.

## Architecture

```
src/
├── assets/images/           brand assets
├── components/
│   ├── common/              Icon, Glyphs, Modal, InfoNote, Breadcrumb
│   └── layout/              Header, TradeNav, KycBanner, Footer
├── features/<feature>/
│   ├── components/          feature-local components
│   ├── hooks/               view models — the ported design logic
│   └── pages/               one component per screen
├── constants/               design tokens, catalog data, route table
├── context/                 AppStateProvider (state + navigation)
├── hooks/                   useAppState, useActions
├── layouts/MainLayout.tsx   header, trade bar, banner, outlet, footer, overlays
├── routes/AppRoutes.tsx     all 22 screens
├── store/appState.ts        the application state shape
├── styles/                  global.css (verbatim) + responsive.css (additive)
├── types/                   domain types
└── utils/                   css parsing, formatting
```

Features: `home`, `catalog`, `product`, `sell`, `mining`, `asm`, `orders`,
`auctions`, `academy`, `howItWorks`, `kyc`, `account`, `auth`, `passport`,
`trade` (negotiation, contract, LC, bank, shipment).

### State and routing

The design drives all 22 screens from a single `route` key in one state object.
That state shape is preserved in [`src/store/appState.ts`](src/store/appState.ts),
and `AppStateProvider` keeps `route` in sync with a real URL (see
[`src/constants/routes.ts`](src/constants/routes.ts)) so deep links, the back
button and shareable addresses all work. Screens that depend on a prior
selection — a chosen lot, auction or lesson — keep that selection in memory
exactly as the design does, so deep-linking to them lands on the default
selection.

## Responsive behaviour

The design targets 1440 × 900 and ships breakpoints down to 1000px only. Those
are preserved verbatim. [`src/styles/responsive.css`](src/styles/responsive.css)
continues the same ladder down to small phones — re-flowing the identical
components without altering colours, type scale or styling.

`npm run audit:responsive` checks all 22 routes at 1440, 1366, 768, 390 and
320 px: **110 route/viewport combinations, no horizontal overflow, no console
errors.**

## Verification

`npm run visual` renders the original design and this app side by side at the
same viewport and reports the pixel difference. It needs both servers running:

```bash
npx http-server design-source -p 5180   # or: python -m http.server 5180 --directory design-source
npm run dev                             # port 5173
npm run visual 1440 900
npm run visual:authed 1440 900
```

Results are written to `tests/__screenshots__/` as `<screen>.design.png`,
`<screen>.app.png` and `<screen>.diff.png`.

## Backend integration

The UI runs entirely on the design's bundled data — there is no backend wired
up. `VITE_API_BASE_URL` is reserved in `.env.example` for when there is one.
The following currently resolve against in-memory state and will need real
endpoints: authentication and OTP delivery, KYC document submission, lot and
auction listings, order creation and tracking, bidding, document generation and
download, letter-of-credit and bank actions, and account/payout updates.
