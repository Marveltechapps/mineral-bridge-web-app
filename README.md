# mineral-bridge-web-app

Next.js App Router + TypeScript starter following the structure of `selorg-web-app` in the Selorg Application reference. Includes a small sample feature demonstrating file and folder conventions.

```sh
npm install
cp .env.example .env
npm run dev
```

Web: http://localhost:3000. Set `NEXT_PUBLIC_API_BASE_URL` in `.env` to the service API (default `http://localhost:5001/v2`).

Reference data, roles, and any local sample catalogue are created by the API when it starts. This app does not seed the database and does not ship a login password. Start `mineralbridge-backend` first; a customer account is opened through registration unless `SEED_USER_EMAIL` and `SEED_USER_PASSWORD` were set on a local development database.

Routes use `src/app/**/page.tsx` and `layout.tsx`. Components use PascalCase `.tsx`; helpers, hooks, services, and types use `.ts`. The `@/*` alias points to `src/*`.

Run `npm run typecheck` to check TypeScript. Dependencies must be installed in this repository first.

## Sample files

The sample feature reads `GET /api/samples` from the service. Start the service before using the sample screens. Open `/samples`.

## Trading platform (`/app`)

The Mineral Bridge web app from the Claude Design page "Mineral Bridge Web v5": onboarding, KYC, buy, sell, order tracking, auctions, refunds and account screens. Open `/app`.

- `src/app/(platform)/` has its own root layout and `platform.css` (Geist, Geist Mono and Instrument Serif from Google Fonts), so the starter `Header` and `globals.css` do not apply. The starter routes live in `src/app/(starter)/`; URLs are unchanged.
- `src/components/platform/MineralBridgeApp.tsx` is the client entry. `AppShell.tsx` holds the sidebar layout, `shell/` the sidebar, headers, summary aside, action bar, dialog and toast, and `screens/` one component per screen. Markup and inline styles match the design one to one.
- `src/hooks/usePlatform.ts` connects the components to `src/lib/platform/controller.ts`, which holds screen state, navigation and the view values each screen renders.
- `src/lib/platform/data.ts` holds the demo catalogue, order stages and simulated counterparty updates. Product images are in `public/assets/m4/`.

Data is demo data kept in the browser's localStorage (`mb4-web-state-v1`), as in the design. Steps owned by Mineral Bridge, SGS or the logistics partner are simulated with labelled demo buttons. The sidebar's "Jump to any screen" lists every screen, and "Reset demo data" clears the saved state. The platform does not call the API service yet.
