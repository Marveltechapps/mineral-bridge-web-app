# mineral-bridge-web-app

Next.js App Router + TypeScript starter following the structure of `selorg-web-app` in the Selorg Application reference. Includes a small sample feature demonstrating file and folder conventions.

```sh
npm install
cp .env.example .env
npm run dev
```

Web: http://localhost:3000. Set `NEXT_PUBLIC_API_BASE_URL` in `.env` to the service API.

Routes use `src/app/**/page.tsx` and `layout.tsx`. Components use PascalCase `.tsx`; helpers, hooks, services, and types use `.ts`. The `@/*` alias points to `src/*`.

Run `npm run typecheck` to check TypeScript. Dependencies must be installed in this repository first.

## Sample files

The sample feature reads `GET /api/samples` from the service. Start the service before using the sample screens. Open `/samples`.
