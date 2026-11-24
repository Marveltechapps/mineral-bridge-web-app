# mineral-bridge-web-app

Next.js App Router + TypeScript Mineral Bridge web client.

```sh
npm install
cp .env.example .env
npm run dev
```

Web: http://localhost:3000 — `/` redirects to `/app` (BUG-007). Set `NEXT_PUBLIC_API_BASE_URL` in `.env` to the service API (default `http://localhost:5001/v2`).

Start `mineralbridge-backend` first; a customer account is opened through registration unless `SEED_USER_EMAIL` and `SEED_USER_PASSWORD` were set on a local development database.

## Trading platform (`/app`)

The Mineral Bridge web app: onboarding, KYC, buy, sell, order tracking, auctions, refunds and account screens. `/` and `/samples` redirect here.

- `src/app/(platform)/` has its own root layout and `platform.css`.
- `src/components/platform/MineralBridgeApp.tsx` is the client entry.
- `src/hooks/usePlatform.ts` connects to `src/lib/platform/controller.ts`.
- Product images are in `public/assets/m4/`.

Run `npm test` (Jest) and `npm run test:e2e` (Playwright).
