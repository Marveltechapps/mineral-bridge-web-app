# Mineral Bridge — API Contract

**Version:** 1.0 (draft for implementation)
**Date:** 16 October 2026
**Derived from:** `Mineral_Bridge_Web_Final` — 22 routes, 15 state slices, 18 view models
**Endpoint index:** [API-ENDPOINTS.md](API-ENDPOINTS.md) — 136 REST endpoints + 3 realtime channels

This document is the contract the backend has to meet. It was written by tracing
every user flow, interaction and action in the shipped frontend: each schema below
exists because a screen needs exactly those fields.

---

## Table of contents

1. [Conventions](#1-conventions)
2. [Authentication](#2-authentication)
3. [Errors](#3-errors)
4. [Pagination, filtering, sorting](#4-pagination-filtering-sorting)
5. [Shared types](#5-shared-types)
6. [A note on display strings](#6-a-note-on-display-strings)
7. [Auth & session](#7-auth--session)
8. [KYC](#8-kyc)
9. [Reference data](#9-reference-data)
10. [Catalog, lots & market](#10-catalog-lots--market)
11. [Mineral passport](#11-mineral-passport)
12. [Orders](#12-orders)
13. [Sell listings](#13-sell-listings)
14. [Auctions](#14-auctions)
15. [Academy](#15-academy)
16. [ASM registration](#16-asm-registration)
17. [Account](#17-account)
18. [Negotiation](#18-negotiation)
19. [Contracts](#19-contracts)
20. [Letters of credit](#20-letters-of-credit)
21. [Bank portal](#21-bank-portal)
22. [Shipments](#22-shipments)
23. [Notifications, support, content, uploads](#23-notifications-support-content-uploads)
24. [Realtime](#24-realtime)
25. [State machines](#25-state-machines)
26. [Non-functional requirements](#26-non-functional-requirements)

---

## 1. Conventions

| Rule | Value |
|---|---|
| Base URL | `VITE_API_BASE_URL`, e.g. `https://api.mineralbridge.com/v1`. Baked in at build time; unset is a hard client failure (`ApiError(0, 'client/no-base-url')`) |
| Transport | HTTPS only. HTTP/2 preferred |
| Content type | `application/json; charset=utf-8` both directions |
| Character encoding | UTF-8. Mineral names carry non-ASCII (`99.5% SiO₂`, `Driver's licence`) |
| Casing | `camelCase` for every field, request and response. The frontend consumes responses directly as TypeScript objects |
| Identifiers | Opaque strings. Never expose database sequence numbers. Human-facing references (`MB-ORDER-33056`, `LC-2026-0419`, `MBP-2026-0419-AU`) are separate display fields, not primary keys |
| Dates | **Calendar dates** `YYYY-MM-DD` (the contract's `from` / `to` are date pickers). **Timestamps** RFC 3339 UTC, `2026-10-16T09:14:00Z` |
| Money | Minor-unit integer + ISO 4217 code — never a float. See [`Money`](#money) |
| Empty bodies | `204 No Content`. The client resolves these to `undefined` |
| Timeouts | The client allows 15 s by default. Any endpoint that cannot answer in 10 s must return `202` with a poll URL instead |
| Idempotency | Every `POST` that creates money movement, a bid, an order or a signature accepts `Idempotency-Key` (UUID v4). Replays within 24 h return the original response |
| Cancellation | The client aborts in-flight requests on filter change. Treat a dropped connection on a `GET` as normal |

### Required request headers

```http
Accept: application/json
Content-Type: application/json          # only when a body is sent
Authorization: Bearer <accessToken>     # when a session exists
Idempotency-Key: <uuid-v4>              # on money/trade POSTs
X-Request-Id: <uuid-v4>                 # optional; echoed back for tracing
```

### Response headers

```http
Content-Type: application/json; charset=utf-8
X-Request-Id: <uuid-v4>
X-RateLimit-Limit / X-RateLimit-Remaining / X-RateLimit-Reset
Retry-After: <seconds>                  # on 429 and 503
```

---

## 2. Authentication

Two-token scheme. The split is deliberate and the client already enforces it
(`src/lib/auth/sessionStore.ts`, `src/lib/api/httpClient.ts`).

| Token | Lifetime | Storage | Transport |
|---|---|---|---|
| **Access token** | 15 minutes | JS memory only — never `localStorage`, `sessionStorage` or a readable cookie | `Authorization: Bearer <token>` |
| **Refresh token** | 30 days, rotating | `httpOnly; Secure; SameSite=Strict` cookie, path `/auth` | Browser sends it automatically |

A page reload therefore starts anonymous and recovers by calling
`POST /auth/refresh` — that endpoint is the **only** request in the application
sent with `credentials: 'include'`.

### Refresh-on-401

The client implements this and the server must match it:

1. Any request answering `401` triggers one `POST /auth/refresh`.
2. On success the original request is replayed unchanged — same method, path, query, body.
3. On failure the original `401` surfaces and the sign-in overlay opens with `pendingResume` set to the current screen.
4. Concurrent `401`s share one in-flight refresh. **The server must tolerate the old refresh token being presented once more within a 10 s grace window**, or a screen with four parallel queries will sign the user out.

`POST /auth/refresh` must never answer `401` to a request that carries no cookie
at all — answer `401 auth/no-refresh-token` so it is distinguishable in logs, and
never issue a redirect.

### Authorisation rules

**The client decides what to show, never what is allowed.** `requireKyc` in
`src/hooks/useActions.ts` is a prompt. Every endpoint marked `KYC` in the
endpoint list must independently verify:

- a valid, unexpired access token;
- `kycStatus === 'verified'` — a `pending` submission is **not** sufficient;
- that the caller owns, or is counterparty to, the resource in the path.

Roles: `buyer`, `seller`, `both`, `bank_operator`, `admin`. The nine bank-portal
endpoints require `bank_operator`; a `buyer` calling them gets `403 auth/role-required`.

---

## 3. Errors

Every non-2xx response carries this body. `src/lib/api/ApiError.ts` parses it.

```ts
interface ErrorBody {
  code: string;                          // stable, machine-readable, "domain/reason"
  message: string;                       // human-readable, safe to display
  fields?: Record<string, string>;       // 422 only: one message per invalid field
  requestId?: string;
}
```

```json
{
  "code": "lot/insufficient-stock",
  "message": "Only 540 g remain in this lot.",
  "fields": { "quantity": "Reduce to 540 g or less." },
  "requestId": "6f1c2d84-9a71-4c3e-b0f2-1e7d9a2c4b55"
}
```

`{ "error": { "code", "message" } }` and `{ "detail": "..." }` are also parsed as
a compatibility fallback, but new endpoints must use the shape above.

### Status codes

| Status | Meaning | Client behaviour |
|---|---|---|
| `200` | Success with body | — |
| `201` | Created | Response carries the created resource |
| `202` | Accepted, async | Poll the `Location` URL |
| `204` | Success, no body | Resolves to `undefined` |
| `400` | Malformed request | Generic failure sheet |
| `401` | No/expired session | Refresh once, replay, else open sign-in overlay |
| `403` | Authenticated but not permitted | **Never retried** |
| `404` | Not found | Empty state |
| `409` | Conflict with current state | **Never retried** — retrying would repeat a trade action |
| `422` | Validation failure | Per-field messages painted onto the form |
| `429` | Rate limited | Respect `Retry-After` |
| `5xx` | Server fault | Retried up to twice (`shouldRetry` in `lib/queryClient.ts`) |

### Error code registry

The frontend branches on these, so they are part of the contract.

| Code | Status | Raised by |
|---|---|---|
| `auth/invalid-credentials` | 401 | `POST /auth/otp/verify` |
| `auth/otp-expired` | 401 | `POST /auth/otp/verify` |
| `auth/otp-incorrect` | 422 | `POST /auth/otp/verify` |
| `auth/otp-throttled` | 429 | `POST /auth/otp/request`, `/resend` |
| `auth/no-refresh-token` | 401 | `POST /auth/refresh` |
| `auth/session-expired` | 401 | any authorised endpoint |
| `auth/role-required` | 403 | the nine `/bank/*` endpoints |
| `auth/account-has-open-orders` | 409 | `DELETE /auth/account` |
| `kyc/not-approved` | 403 | all 16 KYC-gated endpoints |
| `kyc/already-submitted` | 409 | `POST /kyc/submit` |
| `kyc/captures-incomplete` | 422 | `POST /kyc/submit` |
| `kyc/selfie-missing` | 422 | `POST /kyc/submit` |
| `lot/not-found` | 404 | `GET /lots/{id}` |
| `lot/unavailable` | 409 | `POST /orders` — lot withdrawn or sold |
| `lot/insufficient-stock` | 409 | `POST /orders` |
| `order/not-cancellable` | 409 | `POST /orders/{id}/cancel` — escrow already funded |
| `listing/quantity-invalid` | 422 | `POST /listings` |
| `listing/mineral-required` | 422 | `POST /listings` — mirrors the step-1 client check |
| `auction/closed` | 409 | `POST /auctions/{id}/bids` |
| `auction/not-open` | 409 | bidding on an `upcoming` lot |
| `auction/bid-too-low` | 422 | below `currentBid + increment` |
| `auction/outbid` | 409 | a higher bid landed first |
| `academy/lessons-incomplete` | 409 | `POST /academy/courses/{id}/certificate` |
| `asm/eligibility-failed` | 422 | `POST /asm/registrations` |
| `asm/gps-outside-region` | 422 | `POST .../gps` |
| `asm/documents-incomplete` | 422 | `POST .../submit` |
| `payout/verification-pending` | 409 | using a method before the test deposit clears |
| `payout/duplicate` | 409 | `POST /account/payout-methods` |
| `negotiation/offer-closed` | 409 | accept/counter on a closed offer |
| `negotiation/offer-not-yours` | 403 | accepting your own offer |
| `negotiation/terms-already-agreed` | 409 | a second accept in one conversation |
| `contract/terms-invalid` | 422 | `PATCH /contracts/{id}` |
| `contract/already-signed` | 409 | editing or re-signing a signed contract |
| `contract/not-signed` | 409 | `POST /lcs` from an unsigned contract |
| `lc/documents-incomplete` | 422 | `POST /lcs/{id}/presentation` |
| `lc/precheck-required` | 409 | presenting without a current pre-check |
| `lc/discrepancies-present` | 409 | presenting with known discrepancies |
| `lc/not-confirmed` | 409 | presenting before `Confirmed` |
| `lc/already-presented` | 409 | a second presentation |
| `lc/invalid-transition` | 409 | e.g. `Applied → Confirmed` |
| `lc/already-examined` | 409 | a second examination |
| `lc/payment-not-authorised` | 409 | release before `accepted` |
| `upload/too-large` | 413 | `POST /uploads` |
| `upload/unsupported-type` | 422 | `POST /uploads` |
| `validation/failed` | 422 | generic fallback with `fields` |

### Client-side codes (never reach the server)

Raised by `httpClient` so a screen can tell "the server said no" from "we never
got an answer": `client/no-base-url`, `client/timeout` (status `408`),
`client/network` (status `0`), `client/malformed-response`.

---

## 4. Pagination, filtering, sorting

Every list endpoint returns the same envelope — `Paginated<T>` in
`src/lib/api/types.ts`:

```ts
interface Paginated<T> {
  items: T[];
  page: number;        // 1-based
  perPage: number;     // default 24, max 100
  total: number;       // total matching records, not pages
}
```

```http
GET /lots?category=precious&grade=99.9%25&sellerType=Refinery&q=gold&sort=low&page=2&perPage=24
```

The client drops `undefined`, `null` and `''` from the query string before
sending, and serialises an array as a repeated parameter
(`?state=live&state=upcoming`). So the server must treat an **absent** parameter
as "no filter" and must not require explicit nulls.

`sort` accepts `featured` (default) | `low` | `high` | `name`, matching `SortKey`.

---

## 5. Shared types

### Money

```ts
interface Money {
  amount: number;      // MINOR units — 241000 is $2,410.00
  currency: string;    // ISO 4217, e.g. "USD"
}
```

Integer minor units throughout. Floats are not acceptable for prices, bids,
escrow balances or LC amounts.

### Quantity

```ts
interface Quantity {
  value: number;                                  // may be fractional: 2.4 kg
  unit: 'g' | 'kg' | 'oz' | 'ct' | 'MT';
}
```

### FileRef

Returned wherever the frontend renders a document, photo or certificate.

```ts
interface FileRef {
  id: string;
  name: string;              // "mining-licence-2026.pdf"
  mimeType: string;          // "application/pdf"
  sizeBytes: number;
  url: string | null;        // signed, time-limited; null until the record is readable
  expiresAt: string | null;  // RFC 3339
  uploadedAt: string;
}
```

### Address

```ts
interface Address {
  city: string;
  region: string | null;
  country: string;           // ISO 3166-1 alpha-2
  countryName: string;       // display: "South Africa"
}
```

### GeoPoint

```ts
interface GeoPoint {
  latitude: number;          // decimal degrees
  longitude: number;
  accuracyMetres: number | null;
  capturedAt: string;
}
```

### ChainAnchor

Provenance, contract signatures and settlements are all anchored. One shape:

```ts
interface ChainAnchor {
  hash: string;              // "0x41c2...9a07" — full hash; the UI truncates
  network: string;           // "polygon" | "ethereum" | ...
  blockNumber: number | null;
  anchoredAt: string | null; // null while pending inclusion
  explorerUrl: string | null;
}
```

---

## 6. A note on display strings

The frontend's current domain types (`src/types/index.ts`) were transcribed
verbatim from the Design Canvas source, so they hold **presentation strings**
where a value belongs:

```ts
// src/types/index.ts — today
interface Product {
  price: string;   // "$2,410"
  stock: string;   // "745 g"
  grad: string;    // a CSS background declaration
}
```

**The API must not reproduce this.** `price` comes back as `Money`, `stock` as
`Quantity`, and `grad` does not exist server-side at all — it is a CSS string
and belongs nowhere near a payload. The server sends `imageUrl` plus a
`gradientFallback` pair of hex colours; the frontend composes the CSS.

Each service module adapts the wire shape to the view-model shape, exactly as
ARCHITECTURE.md §5.1 prescribes. Schemas below are the **wire** shape; where it
differs from the current frontend type I say so, so the adapter is obvious.

---

## 7. Auth & session

### `POST /auth/register` — public

```ts
// Request
{
  method: 'mobile' | 'email' | 'whatsapp';
  mobile?: string;                   // E.164, required for mobile|whatsapp
  email?: string;                    // required for email
  fullName: string;
  role: 'buyer' | 'seller' | 'both'; // from authRole chips
  companyName?: string;
  country: string;                   // ISO alpha-2
  acceptedTermsVersion: string;
}
// 201
{
  challengeId: string;
  method: 'mobile' | 'email' | 'whatsapp';
  target: string;                    // masked: "+27 82 ••• 0000"
  expiresIn: number;                 // seconds
  codeLength: 4;
}
```

The frontend renders four OTP boxes, so `codeLength` is fixed at 4. Changing it
is a breaking change to `otpBoxes` in `useAuthViewModel`.

### `POST /auth/otp/request` — public

```ts
// Request
{ method: 'mobile' | 'email' | 'whatsapp'; identifier: string; intent: 'login' | 'signup' }
// 200 — same shape as register's response
```

Rate limit: 3 per identifier per 15 min, 10 per IP per hour → `auth/otp-throttled`.
**Never reveal whether an account exists** — the response is identical either way.

### `POST /auth/otp/verify` — public

```ts
// Request
{ challengeId: string; code: string }   // 4 digits
// 200
{
  accessToken: string;
  expiresIn: number;                    // seconds, e.g. 900
  tokenType: 'Bearer';
  user: UserProfile;
  kycStatus: 'unverified' | 'pending' | 'verified';
  isNewAccount: boolean;                // drives the signup → KYC route
}
```

Also sets `Set-Cookie: mb_refresh=...; HttpOnly; Secure; SameSite=Strict; Path=/auth; Max-Age=2592000`.

This response feeds `signIn(token)` in `src/lib/auth/session.ts`, which turns the
session from `demo` into `authenticated` with no other change. `isNewAccount`
reproduces the existing branch in `verifyOtp`: a new sign-up with
`kycStatus === 'unverified'` routes to `/kyc`; a returning user resumes
`pendingResume`.

Failure: 5 wrong codes invalidates the challenge → `auth/otp-expired`.

### `POST /auth/refresh` — refresh cookie only

```ts
// Request: no body. Must be sent with credentials: 'include'
// 200
{ accessToken: string; expiresIn: number; tokenType: 'Bearer' }
```

Rotates the refresh cookie on every call. Honour the 10 s grace window on the
previous token (§2).

### `POST /auth/logout` — `S`

`204`. Revokes the refresh token server-side and clears the cookie
(`Max-Age=0`). The client calls `signOut()` regardless of the outcome.

### `GET /auth/me` — `S`

```ts
{
  user: UserProfile;
  kycStatus: 'unverified' | 'pending' | 'verified';
  kycStage: KycStage | null;
  roles: string[];
  permissions: string[];              // e.g. ["bank.examine"]
  unreadNotifications: number;
}

interface UserProfile {
  id: string;
  fullName: string;                   // locked to the KYC record once verified
  email: string;
  mobile: string;
  countryCode: string;
  countryName: string;
  companyName: string | null;
  role: 'buyer' | 'seller' | 'both';
  avatarUrl: string | null;
  initials: string;                   // "MT" — server-computed so the UI never guesses
  createdAt: string;
}
```

### `POST /auth/password/change` — `S`

```ts
// Request
{ currentPassword: string; newPassword: string }
// 204
```

Server-side policy must match the client meter in `useAccountEditViewModel`:
≥ 10 characters, ≥ 1 uppercase, ≥ 1 digit or symbol. Violations return `422`
with `fields.newPassword`. **Revokes every other session** and rotates the
refresh cookie for the caller.

### `GET /auth/sessions` — `S`

```ts
{
  items: Array<{
    id: string;
    device: string;                   // "Chrome on macOS"
    location: string;                 // "Cape Town, ZA"
    lastActiveAt: string;
    isCurrent: boolean;
    ipAddress: string;                // last octet masked
  }>;
}
```

### `DELETE /auth/sessions/{sessionId}` — `S`

`204`. Revoking the current session is `409 auth/cannot-revoke-current` — the
frontend disables that row (`other: !s.current`).

### `DELETE /auth/account` — `S`

```ts
// Request
{ confirmation: 'DELETE'; reason?: string }
// 202
{ scheduledDeletionAt: string; openOrderCount: number }
```

`409 auth/account-has-open-orders` with `openOrderCount` when orders are
unsettled — the frontend's modal already says open orders must settle first.

---

## 8. KYC

Flow: `why → type → capture → live → review → pending`. `why` and `review` are
client-only; the server is touched at `type`, `capture`, `live` and `review → pending`.

### `GET /kyc` — `S`

```ts
{
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  stage: 'why' | 'type' | 'capture' | 'live' | 'review' | 'pending';
  idType: 'national' | 'passport' | 'licence' | null;
  requiredSides: Array<'front' | 'back' | 'photo_page'>;
  captures: Array<{ side: 'front' | 'back' | 'photo_page'; fileId: string; capturedAt: string }>;
  selfie: { fileId: string; capturedAt: string } | null;
  submittedAt: string | null;
  decidedAt: string | null;
  rejectionReason: string | null;
  reviewSlaHours: 24;
  reference: string | null;           // "KYC-2026-00412" for the pending screen
}
```

`requiredSides` is authoritative — it is what drives `kycSides`. For `passport`
it is `['photo_page']`; otherwise `['front', 'back']`. The client currently
derives this from `kycIdType !== 'passport'`; move that decision to the server so
new document types do not need a frontend release.

### `PATCH /kyc` — `S`

```ts
// Request
{ idType: 'national' | 'passport' | 'licence' }
// 200 — the full record above
```

Changing `idType` **discards existing captures** and returns the new
`requiredSides`. The client must clear `kycShots` on the response.

### `POST /kyc/captures` — `S`

```ts
// Request
{ side: 'front' | 'back' | 'photo_page'; fileId: string }   // fileId from POST /uploads
// 201
{
  side: string;
  fileId: string;
  capturedAt: string;
  quality: {
    acceptable: boolean;
    issues: Array<'glare' | 'blur' | 'cropped' | 'too_dark' | 'low_resolution'>;
  };
}
```

`quality.issues` maps onto the three capture tips already on screen ("flat, dark
surface", "avoid glare", "all four corners inside the frame"). When
`acceptable: false` the client keeps the slot pending and shows the issue.

### `DELETE /kyc/captures/{side}` — `S` → `204`

### `POST /kyc/selfie` — `S`

```ts
// Request
{ fileId: string; livenessToken?: string }
// 201
{ capturedAt: string; liveness: { passed: boolean; score: number; reason: string | null } }
```

The frontend's `selfieCta` toggles between "Take selfie" and "Retake selfie", so
a failed liveness check must be re-postable without any reset call.

### `POST /kyc/submit` — `S`

```ts
// Request: no body
// 202
{ status: 'pending'; submittedAt: string; reference: string; estimatedDecisionBy: string }
```

Rejections: `422 kyc/captures-incomplete`, `422 kyc/selfie-missing`,
`409 kyc/already-submitted`. The decision arrives asynchronously as
`kyc.decided` on the notification stream (R3) — the frontend's `pending` screen
is built to flip to `approved` in place.

---

## 9. Reference data

All eight are public, cacheable (`Cache-Control: public, max-age=3600`) and
versioned with `ETag`. They replace hardcoded option arrays, so each response
carries exactly what the control needs.

### `GET /reference/categories`

```ts
{
  items: Array<{
    key: 'precious' | 'gemstone' | 'industrial' | 'base' | 'energy';
    name: string;                     // "Precious Metals"
    shortName: string;                // "Precious" — the home filter chips
    subCategories: string[];          // ["Gold","Silver","Platinum","Palladium"]
    featuredTypes: string[];          // drives the home category tile count
    imageUrl: string;
    gradientFrom: string;             // "#3a3226" — the UI composes the CSS
    gradientTo: string;               // "#0e0e10"
    lotCount: number;
  }>;
}
```

### `GET /reference/minerals`

```ts
{
  items: Array<{
    id: string;                       // "gold"
    name: string;                     // "Gold Concentrate"
    categoryKey: string;
    categoryName: string;             // auto-fills the sell form's category
    defaultUnit: 'g'|'kg'|'oz'|'ct'|'MT';
    indicativeRate: Money | null;     // per defaultUnit; powers the sell estimate
  }>;
  allowsOther: true;                  // the "Other — not listed" option
}
```

`categoryName` matters: `sfMineralPick` sets the category from the chosen
mineral, so the server must supply the pairing rather than the client inferring it.

### `GET /reference/units`

```ts
{ items: Array<{ code: 'g'|'kg'|'oz'|'ct'|'MT'; name: string; gramsPerUnit: number | null }> }
```

### `GET /reference/countries`

```ts
{ items: Array<{ code: string; name: string; dialCode: string; supported: boolean; payoutMethods: string[] }> }
```

`supported: false` countries can still be selected for a verification address but
cannot receive payouts — this is where the Bitcoin option's "Supported countries
only" tag gets its truth.

### `GET /reference/incoterms`

```ts
{
  items: Array<{
    code: 'EXW'|'FCA'|'FOB'|'CIF'|'DAP';
    name: string;                     // "Cost, Insurance & Freight"
    description: string;              // the full sentence shown under the picker
    requiresNamedPort: boolean;
    sellerPaysFreight: boolean;
    sellerPaysInsurance: boolean;
  }>;
}
```

### `GET /reference/id-types`

```ts
{
  items: Array<{
    key: 'national'|'passport'|'licence';
    label: string;                    // "National ID card"
    description: string;              // "Front and back required"
    requiredSides: Array<'front'|'back'|'photo_page'>;
    acceptedCountries: string[] | null;
  }>;
}
```

### `GET /reference/banks`

```ts
{
  items: Array<{
    id: string;
    name: string;                     // "Standard Bank of South Africa"
    swift: string;
    country: string;
    canIssueLc: boolean;
    canAdviseLc: boolean;
  }>;
}
```

### `GET /reference/payout-networks`

```ts
{
  items: Array<{
    code: 'TRC-20'|'ERC-20'|'BEP-20';
    name: string;
    assets: string[];                 // ["USDC","USDT"]
    addressPattern: string;           // regex for client-side validation
    estimatedFee: Money;
  }>;
}
```

---

## 10. Catalog, lots & market

### `GET /lots` — public

Already written client-side as `catalogService.getLots`.

**Query:** `category`, `grade`, `sellerType`, `q`, `sort`, `page`, `perPage`.
`category=all` is the rail's "nothing chosen" value and is **not** sent.

```ts
// 200 — Paginated<LotSummary>
interface LotSummary {
  id: string;
  name: string;                       // "Gold Concentrate"
  categoryKey: string;
  categoryName: string;
  subCategory: string;                // "Gold"
  grade: string;                      // "99.9%" — free text; grades are not a closed set
  price: Money;                        // per unit  ← frontend Product.price is "$2,410"
  unit: 'g'|'kg'|'oz'|'ct'|'MT';
  availableQuantity: Quantity;         // ← frontend Product.stock is "745 g"
  origin: { city: string; country: string; countryName: string; display: string };
  seller: {
    id: string;
    name: string;
    type: 'Refinery'|'Cooperative'|'Artisanal'|'Trader';
    initials: string;
    verified: boolean;
    academyCertified: boolean;         // the badge the Academy certificate grants
  };
  imageUrl: string;
  gradientFrom: string;
  gradientTo: string;
  passportId: string | null;           // "MBP-2026-0419-AU"
  assured: boolean;
  listedAt: string;
}
```

`grade` is deliberately a string: the data carries `99.9%`, `Grade A`, `VS1`,
`Vivid` and `99.5% SiO₂` — not an enum.

### `GET /lots/{lotId}` — public

```ts
interface LotDetail extends LotSummary {
  description: string;                 // long-form; the UI no longer templates it client-side
  specs: Array<{ label: string; value: string }>;   // ordered, server-controlled
  testMethod: string;                  // "Fire assay + XRF"
  documentation: string[];             // ["CoA","provenance","export permit"]
  minimumOrder: Quantity | null;
  platformFeeRate: number;             // 0.01 — never hardcode the 1% client-side
  settlementOptions: Array<{
    key: 'escrow'|'wire'|'lc'|'btc';
    label: string;
    description: string;
    available: boolean;
    tag: string | null;                // "OPTIONAL" for btc
  }>;
}
```

`platformFeeRate` and `settlementOptions` are the two things the frontend
currently hardcodes (`sub * 0.01` and the `PAYS` array). Serving them removes a
release from every pricing or payment-method change.

`404 lot/not-found`.

### `GET /lots/{lotId}/provenance` — public

```ts
{
  passportId: string;
  events: Array<{
    id: string;
    title: string;                     // "Extracted and registered"
    description: string;               // "Obuasi, Ghana · GPS-verified site"
    occurredAt: string;
    actor: string | null;
    anchor: ChainAnchor | null;
  }>;
}
```

### `GET /lots/{lotId}/documents` — public

```ts
{ items: Array<{ id: string; kind: 'coa'|'provenance'|'export_permit'|'assay'|'inspection'; name: string; file: FileRef; issuedBy: string; issuedAt: string }> }
```

### `GET /lots/facets` — public

Same query parameters as `/lots`. Returns counts for the filter rail, computed
against the **other** active filters — so the Grade counts reflect the chosen
category, which is what `countIn` approximates client-side today.

```ts
{
  categories: Array<{ key: string; name: string; count: number }>;
  grades: Array<{ value: string; count: number }>;
  sellerTypes: Array<{ value: string; count: number }>;
  totalMatching: number;
}
```

### `GET /market/rates` — public

```ts
{
  asOf: string;
  items: Array<{
    mineralId: string;
    name: string;
    categoryName: string;
    price: Money;
    unit: string;
    changePercent: number;             // -0.6 — signed; the UI picks the colour
    imageUrl: string;
    gradientFrom: string;
    gradientTo: string;
  }>;
}
```

### `GET /market/stats` — public

```ts
{
  items: Array<{ key: string; value: string; label: string }>;
  // [{ key: "mineral_types", value: "190+", label: "Mineral types" }, ...]
}
```

`value` is a string because the design shows `190+` and `100%`. The server owns
the formatting here; this is the one place where that is correct, because the
values are editorial.

---

## 11. Mineral passport

### `GET /passports/{passportId}` — public

Format: `MBP-{year}-{sequence}-{symbol}`, e.g. `MBP-2026-0419-AU`. Lookup is
**case-insensitive** — the frontend upper-cases input before querying.

```ts
// 200
{
  passportId: string;
  lot: { id: string; name: string; categoryName: string };
  origin: string;                      // "Obuasi, Ghana"
  assay: { grade: string; method: string; laboratory: string; testedAt: string };
  custodyEventCount: number;
  mintedAt: string;
  anchor: ChainAnchor;                 // blockNumber renders as "Block #19,402,118"
  integrityVerified: boolean;          // false ⇒ the record was altered
  lotUrl: string;
}
```

`404 passport/not-found` drives the "not found" branch. Rate limit 30/min per IP —
the passport namespace is enumerable, so this endpoint must not become a scraper.

### `GET /passports/{passportId}/events` — public

Same `events` array as `/lots/{lotId}/provenance`.

---

## 12. Orders

### `POST /orders/quote` — public

Called as the quantity stepper changes, so it must be cheap and cacheable.

```ts
// Request
{ lotId: string; quantity: Quantity; paymentMethod: 'escrow'|'wire'|'lc'|'btc' }
// 200
{
  subtotal: Money;
  platformFee: Money;
  platformFeeRate: number;             // 0.01
  paymentSurcharge: Money | null;
  total: Money;
  availableQuantity: Quantity;
  withinAvailable: boolean;
  quoteId: string;
  expiresAt: string;                   // quotes are short-lived
}
```

`quoteId` should be passed to `POST /orders` so the price the buyer saw is the
price they get; a stale quote is `409 order/quote-expired`.

### `POST /orders` — `KYC` · idempotent

```ts
// Request
{
  lotId: string;
  quantity: Quantity;
  paymentMethod: 'escrow'|'wire'|'lc'|'btc';
  quoteId?: string;
  deliveryAddress?: Address;
  payoutMethodId?: string;             // escrow refund destination
  notes?: string;
}
// 201
{ order: Order; nextAction: { kind: 'await_verification'|'fund_escrow'|'open_contract'; url: string | null } }
```

`nextAction` is what makes the existing `buyNow` honest: it currently just
navigates to `/orders`. With `paymentMethod: 'lc'` the server returns
`kind: 'open_contract'` and the frontend can route to the Contract Builder —
which is exactly what the product-page copy promises ("agree terms in Contract
Builder").

Errors: `403 kyc/not-approved`, `409 lot/unavailable`, `409 lot/insufficient-stock`,
`422 validation/failed`.

### `GET /orders` — `S`

**Query:** `side=buy|sell`, `status=active|completed`, `page`, `perPage`.

```ts
// Paginated<Order>
interface Order {
  id: string;                          // "MB-ORDER-33056"
  reference: string;
  side: 'BUY' | 'SELL';
  lot: { id: string; name: string; imageUrl: string; gradientFrom: string; gradientTo: string };
  quantity: Quantity;
  value: Money;
  placedAt: string;
  status: 'in_review'|'active'|'complete'|'rejected'|'cancelled';
  statusLabel: string;                 // "In review"
  stage: { index: number; total: number; title: string; subtitle: string };
  progressPercent: number;             // 0–100 integer  ← frontend Order.progress is "33%"
  rejected: boolean;
  rejectionReason: string | null;
  region: string | null;
  closed: boolean;                     // rejected || status === 'complete'
}
```

`closed` is served rather than derived: `isClosed` in `constants/orders.ts`
currently reimplements it, and the active/completed tab counts depend on it.

The frontend's `sc` / `sbg` (status colour pairs) are **not** in the payload —
they are presentation, mapped from `status` in the component.

### `GET /orders/{orderId}` — `S`

Returns one `Order` plus `settlement`, `counterparty` and `documentsAvailable`:

```ts
{
  order: Order;
  settlement: {
    method: 'escrow'|'wire'|'lc'|'btc';
    status: 'not_funded'|'held'|'released'|'refunded';
    escrowReference: string | null;
    releasedAt: string | null;
  };
  counterparty: { name: string; type: string; verified: boolean } | null;
  cancellable: boolean;
}
```

`403` when the caller is not party to the order — never `404`, which would leak
existence.

### `GET /orders/{orderId}/timeline` — `S`

```ts
{
  pipeline: 'BUY' | 'SELL';
  currentIndex: number;
  terminated: boolean;                 // rejected: stops here, never "in progress"
  stages: Array<{
    index: number;
    title: string;
    subtitle: string;
    state: 'done'|'current'|'terminated'|'pending';
    occurredAt: string | null;         // null for stages not yet reached
    note: string | null;               // the rejection explanation on a terminated stage
  }>;
}
```

The server owns `state` because the client's rule is subtle and worth preserving
exactly: a rejected order has **no** `current` stage — the stage it died at is
`terminated`. Six stages for both pipelines (`BUY_STAGES`, `SELL_STAGES`).

### `GET /orders/{orderId}/logistics` — `S`

```ts
{
  currentIndex: number;
  legs: Array<{ index: number; label: string; meta: string; state: 'done'|'pending'; occurredAt: string | null }>;
}
```

Four legs, and they differ by side: a sell order runs
`Your site → Agent collection → Assay lab → MB vault`; a buy order runs
`MB vault → Inspection hub → In transit → Your facility`.

### `GET /orders/{orderId}/documents` — `S`

```ts
{
  items: Array<{
    id: string;
    name: string;                      // "Assay certificate"
    kind: string;
    available: boolean;                // stage-gated
    availableFromStage: number;
    unavailableReason: string | null;  // "Available at a later stage"
    file: FileRef | null;              // null while unavailable
  }>;
}
```

Six documents for a buy order, five for a sell order, each unlocking at its own
stage — the gating is server-side, so a buyer cannot fetch an escrow receipt
before escrow is funded.

### `GET /orders/{orderId}/documents/{documentId}/download` — `S`

```ts
// 200
{ url: string; expiresAt: string; name: string; sizeBytes: number }
```

A short-lived signed URL rather than a redirect, so the client can show its
"preparing your document" sheet and handle `403` without a navigation.

### `POST /orders/{orderId}/cancel` — `S`

```ts
// Request
{ reason?: string }
// 200
{ order: Order; refund: { amount: Money; status: 'none'|'pending'|'completed' } | null }
```

`409 order/not-cancellable` once escrow is funded.

---

## 13. Sell listings

Wizard: mineral details → location → review → submitted. Validation must mirror
the client's step-1 check (mineral name present, quantity > 0) so a determined
caller gets the same answer.

### `POST /listings/quote` — public

```ts
// Request
{ mineralId: string | null; customMineralName: string | null; quantity: Quantity }
// 200
{
  indicativeGross: Money;
  sellerFee: Money;
  sellerFeeRate: number;               // 0.02
  indicativeNet: Money;
  rateUsed: Money;                     // per unit
  disclaimer: string;                  // "indicative only, subject to on-site verification"
}
```

`sellerFeeRate` and `rateUsed` replace the `INDICATIVE_RATE = 2410` and
`SELLER_FEE = 0.02` constants in `useSellViewModel`. The disclaimer is served
because it is a compliance statement and must be changeable without a release.

### `POST /listings` — `KYC` · idempotent

```ts
// Request
{
  mineralId: string | null;            // null when customMineralName is used
  customMineralName: string | null;
  categoryKey: string;
  quantity: Quantity;
  form: 'raw' | 'semi_finished' | 'finished';
  verificationAddress: Address;
  preferredSlot: 'morning' | 'afternoon' | 'flexible';
  payoutMethodId: string | null;
  payoutPreference: string;            // "Bank transfer" when no method is linked yet
  photoFileIds: string[];
  quoteId?: string;
}
// 201
{
  listing: Listing;
  nextSteps: Array<{ index: number; title: string; description: string }>;
}

interface Listing {
  id: string;                          // "MB-SELL-41982"
  reference: string;
  mineralName: string;
  categoryName: string;
  quantity: Quantity;
  form: string;
  verificationAddress: Address;
  preferredSlot: string;
  status: 'draft'|'submitted'|'visit_scheduled'|'verified'|'in_transit'|'received'|'paid'|'rejected';
  statusLabel: string;
  submittedAt: string | null;
  visitScheduledFor: string | null;
  indicativeNet: Money | null;
  photos: FileRef[];
  orderId: string | null;              // the SELL-side Order once one exists
}
```

`nextSteps` is the four-item "what happens next" list the step-4 screen renders.
Serving it keeps the operational promise (visit → verify → ship → payment) in one
place.

Errors: `403 kyc/not-approved`, `422 listing/mineral-required`,
`422 listing/quantity-invalid`.

### `PATCH /listings/{listingId}` — `S`

Partial update of any `POST /listings` field while `status === 'draft'`. `200`
with the `Listing`. `409 listing/not-editable` once submitted.

### `GET /listings` — `S` → `Paginated<Listing>`, query `status`
### `GET /listings/{listingId}` — `S`

```ts
{
  listing: Listing;
  verification: {
    status: 'not_scheduled'|'scheduled'|'completed'|'failed';
    scheduledFor: string | null;
    agent: { name: string; contact: string } | null;
    completedAt: string | null;
    findings: string | null;
    assay: { grade: string; method: string; laboratory: string } | null;
  } | null;
}
```

### `POST /listings/{listingId}/photos` — `S`

```ts
// Request
{ fileIds: string[] }
// 201
{ photos: FileRef[] }
```

Max 8 photos, each ≤ 10 MB, `image/jpeg` or `image/png`. The design shows four
slots; the limit is server-enforced.

### `DELETE /listings/{listingId}/photos/{photoId}` — `S` → `204`

---

## 14. Auctions

### `GET /auctions` — public

**Query:** `state=live|upcoming|ended` (repeatable), `page`, `perPage`.

```ts
// Paginated<AuctionSummary>
interface AuctionSummary {
  id: string;
  name: string;                        // "Gold Dore Bars"
  state: 'live' | 'upcoming' | 'ended';
  quantity: Quantity;
  grade: string;
  origin: string;
  currentBid: Money;                   // STARTING BID when upcoming, SOLD FOR when ended
  minimumIncrement: Money;
  bidCount: number;
  opensAt: string;
  closesAt: string;
  serverTime: string;                  // authoritative clock for the countdown
  imageUrl: string;
  gradientFrom: string;
  gradientTo: string;
  viewer: {                            // null when signed out
    highestBid: Money | null;
    isHighestBidder: boolean;
    outbid: boolean;
    won: boolean;
    autoBidCeiling: Money | null;
    reminderSet: boolean;
  } | null;
}
```

`serverTime` is essential. The frontend currently renders a fixed string
(`"Ends in 02:14:38"`); a real countdown must tick against the server's clock, or
a skewed client bids after close.

`viewer.outbid` is what the dismissible outbid banner keys off.

### `GET /auctions/{auctionId}` — public

```ts
interface AuctionDetail extends AuctionSummary {
  lotId: string | null;
  specs: Array<{ label: string; value: string }>;
  settlementTerms: string;             // "Escrow · 48h after close"
  description: string;
  result: {                            // ended lots only
    outcome: 'won'|'lost'|'not_participated'|'unsold';
    headline: string;
    detail: string;
    settlementOrderId: string | null;  // "track it in My Orders"
  } | null;
}
```

### `GET /auctions/{auctionId}/bids` — public

```ts
{
  items: Array<{
    id: string;
    bidderLabel: string;               // "Bidder #4471" — pseudonymous
    bidderInitials: string;            // "B4"
    isYou: boolean;
    amount: Money;
    placedAt: string;
    kind: 'manual'|'auto'|'opening';
  }>;
  page: number; perPage: number; total: number;
}
```

Bidder identity must never be exposed. `isYou` is the only link to the caller.

### `POST /auctions/{auctionId}/bids` — `KYC` · idempotent

```ts
// Request
{ amount: Money }
// 201
{
  bid: { id: string; amount: Money; placedAt: string };
  auction: { currentBid: Money; bidCount: number; closesAt: string };
  isHighestBidder: boolean;
  minimumNextBid: Money;
}
```

Errors — all four are distinct screens:

| Error | Meaning |
|---|---|
| `403 kyc/not-approved` | verification required |
| `409 auction/closed` | the lot closed, possibly between render and click |
| `409 auction/not-open` | bidding on an `upcoming` lot |
| `422 auction/bid-too-low` | below `currentBid + minimumIncrement`; `fields.amount` carries the minimum |
| `409 auction/outbid` | a competing bid landed first; the response body carries the new `currentBid` |

Anti-sniping: a bid inside the final 2 minutes extends `closesAt` by 2 minutes
and the extension must be broadcast on R1.

### `PUT /auctions/{auctionId}/auto-bid` — `KYC`

```ts
// Request
{ ceiling: Money }
// 200
{ ceiling: Money; currentBid: Money; strategy: 'minimum_increment'; active: true }
```

Replaces any existing ceiling — hence `PUT`. The server bids on the user's
behalf in minimum increments and stops at the ceiling, exactly as the on-screen
explanation says.

### `DELETE /auctions/{auctionId}/auto-bid` — `KYC` → `204`
### `POST /auctions/{auctionId}/reminder` — `S`

```ts
// Request
{ channels?: Array<'email'|'sms'|'push'> }   // defaults to the account preference
// 201
{ reminderSet: true; notifyAt: string }
```

### `DELETE /auctions/{auctionId}/reminder` — `S` → `204`

---

## 15. Academy

### `GET /academy/courses` — public

**Query:** `track=asm|platform`.

```ts
{
  tracks: Array<{ key: 'asm'|'platform'; label: string }>;
  stats: Array<{ value: string; label: string }>;   // "12 Free courses", "4,800+ Miners certified"
  items: Array<{
    id: string;
    track: 'asm'|'platform';
    title: string;
    summary: string;
    level: string;                     // "LEVEL 1"
    lessonCount: number;
    durationMinutes: number;
    grantsCertificate: boolean;
    iconKey: 'shield'|'flask'|'truck'|'chain';
    imageUrl: string;
    gradientFrom: string;
    gradientTo: string;
    progress: {                        // zeroed when signed out
      lessonsCompleted: number;
      percent: number;
      state: 'not_started'|'in_progress'|'completed';
      certificateIssued: boolean;
    };
  }>;
}
```

Progress is per-user server state, not a client `lessonDone` map. Today it lives
in `academySlice` and is lost on reload — which is wrong for a certification
product.

### `GET /academy/courses/{courseId}` — public

```ts
{
  course: { /* the list item above */ };
  description: string;
  outcomes: string[];                  // "Identify and map the main hazards..."
  assessment: { required: boolean; questionCount: number; passMark: number } | null;
  nextLessonId: string | null;         // resume point
}
```

### `GET /academy/courses/{courseId}/lessons` — public

```ts
{
  items: Array<{
    id: string;
    index: number;
    title: string;                     // "Lesson 1 · Hazard identification"
    durationSeconds: number;           // 440 → the UI renders "07:20"
    completed: boolean;
    locked: boolean;                   // sequential courses only
  }>;
}
```

### `GET /academy/lessons/{lessonId}/media` — `S`

```ts
{
  url: string;                         // signed HLS or MP4
  expiresAt: string;
  durationSeconds: number;
  resumePositionSeconds: number;
  captions: Array<{ language: string; url: string }>;
}
```

Six languages are advertised in the stats, so captions are part of the contract.

### `POST /academy/lessons/{lessonId}/progress` — `S`

```ts
// Request
{ positionSeconds: number }
// 204
```

Throttle to one call per 15 s of playback.

### `POST /academy/lessons/{lessonId}/complete` — `S`

```ts
// 200
{
  lessonId: string;
  courseProgress: { lessonsCompleted: number; percent: number; state: string };
  nextLessonId: string | null;
  certificateAvailable: boolean;
}
```

`certificateAvailable` is the server's verdict on `canCertify`, so the button
cannot be enabled by a client that miscounts.

### `POST /academy/courses/{courseId}/certificate` — `S`

```ts
// 201
{
  certificate: {
    id: string;
    courseId: string;
    courseTitle: string;
    issuedAt: string;
    credentialId: string;              // "MB-CERT-2026-00841"
    verificationUrl: string;
    visibleOnSellerProfile: true;
    file: FileRef;
  };
}
```

`409 academy/lessons-incomplete`. Issuing must flip `seller.academyCertified` on
every lot the seller lists — which is the promise the modal makes ("Buyers can
see it on every lot you list").

### `GET /academy/certificates` — `S` → `{ items: Certificate[] }`

---

## 16. ASM registration

Five steps: eligibility → site → GPS → documents → done.

### `GET /asm/eligibility-criteria` — public

```ts
{
  items: Array<{ index: number; statement: string; required: boolean }>;
  allRequired: boolean;
}
```

Four statements today. `required` matters: the client lets a user continue with
partial answers but shows `eligShort`, so the server decides what actually blocks.

### `GET /asm/registrations` — `S` → `{ items: AsmRegistration[] }`

### `POST /asm/registrations` — `S`

```ts
// Request
{ eligibilityAnswers: Array<{ index: number; answer: boolean }> }
// 201
{ registration: AsmRegistration }

interface AsmRegistration {
  id: string;
  status: 'draft'|'submitted'|'visit_scheduled'|'approved'|'rejected';
  step: 'elig'|'site'|'gps'|'docs'|'done';
  eligibilityAnswers: Array<{ index: number; answer: boolean }>;
  eligibilityMet: boolean;
  site: {
    name: string | null;
    country: string | null;
    countryName: string | null;
    region: string | null;
    minerals: string[];
    workerCount: number;
  };
  gps: GeoPoint | null;
  gpsWithinEligibleRegion: boolean | null;
  documents: Array<{
    key: 'id'|'licence'|'photos';
    label: string;
    description: string;
    uploaded: boolean;
    files: FileRef[];
    status: 'missing'|'uploaded'|'under_review'|'accepted'|'rejected';
    rejectionReason: string | null;
  }>;
  submittedAt: string | null;
  visitScheduledFor: string | null;
  reference: string | null;            // "ASM-2026-00117"
}
```

`422 asm/eligibility-failed` when a `required` statement is answered `false`.

### `GET /asm/registrations/{registrationId}` — `S`

Returns the record, so the five-step wizard resumes server-side rather than from
a client slice that a reload empties.

### `PATCH /asm/registrations/{registrationId}` — `S`

```ts
// Request — any subset
{ site?: { name?: string; country?: string; region?: string; minerals?: string[]; workerCount?: number }; step?: AsmStep }
// 200 { registration: AsmRegistration }
```

### `POST /asm/registrations/{registrationId}/gps` — `S`

```ts
// Request
{ latitude: number; longitude: number; accuracyMetres: number; capturedAt: string }
// 200
{
  gps: GeoPoint;
  withinEligibleRegion: boolean;
  regionName: string | null;
  display: string;                     // "−11.6604, 27.4794"
}
```

`422 asm/gps-outside-region` when the point falls outside every eligible region —
the third eligibility statement made a promise and this is where it is checked.

### `POST /asm/registrations/{registrationId}/documents` — `S`

```ts
// Request
{ key: 'id'|'licence'|'photos'; fileIds: string[] }
// 201
{ document: { key: string; uploaded: true; files: FileRef[]; status: 'uploaded' } }
```

`photos` requires three or more files — "Three or more showing the working area".

### `POST /asm/registrations/{registrationId}/submit` — `S`

```ts
// 202
{ registration: AsmRegistration; reference: string; estimatedVisitWindow: string }
```

`422 asm/documents-incomplete` lists the missing keys in `fields`.

---

## 17. Account

### `GET /account/profile` — `S`

```ts
{
  profile: UserProfile;
  nameLockedToKyc: boolean;            // true once verified
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    loginAlertsEnabled: boolean;
    ledgerVisibilityEnabled: boolean;
    passwordChangedAt: string | null;
    activeSessionCount: number;
  };
  kyc: { status: string; statusLabel: string; statusDetail: string; actionLabel: string };
}
```

`kyc.statusDetail` / `actionLabel` are the three-way strings the account screen
shows ("Not started — required to trade" / "Verify now", "Submitted — under
compliance review" / "View status", "Verified — full trading access" / "View").
Serving them keeps compliance wording in one place.

### `PATCH /account/profile` — `S`

```ts
// Request — any subset
{
  email?: string;
  mobile?: string;
  country?: string;
  companyName?: string;
  role?: 'buyer'|'seller'|'both';
  fullName?: string;                   // 409 account/name-locked once KYC-verified
  security?: {
    twoFactorEnabled?: boolean;
    biometricEnabled?: boolean;
    loginAlertsEnabled?: boolean;
    ledgerVisibilityEnabled?: boolean;
  };
}
// 200 — the full profile payload
```

Changing `email` or `mobile` requires re-verification: the response carries
`pendingVerification: { field, challengeId, target }` and the old value stays
live until the OTP is confirmed. Disabling `twoFactorEnabled` requires a fresh
OTP — `403 auth/reauthentication-required` otherwise.

### `POST /account/avatar` — `S`

```ts
// Request
{ fileId: string }
// 200
{ avatarUrl: string }
```

### `GET /account/documents` — `S`

```ts
{
  items: Array<{
    id: string;
    kind: 'company_registration'|'mining_licence'|'proof_of_address'|'tax_certificate';
    label: string;
    description: string;
    status: 'missing'|'pending'|'verified'|'rejected'|'expired';
    statusLabel: string;               // "Pending" | "Verified"
    required: boolean;                 // mining licence is required to sell
    reference: string | null;
    expiresAt: string | null;
    file: FileRef | null;
    rejectionReason: string | null;
    submittedAt: string | null;
  }>;
}
```

### `POST /account/documents` — `S`

```ts
// Request
{ kind: string; fileId: string; reference?: string; expiresAt?: string }
// 201
{ document: { /* the item above */ }; reviewSlaHours: 24 }
```

`reference` and `expiresAt` are the `docRef` / `docExp` fields on the upload
sheet. `409 document/already-pending` for a second submission of the same kind.

### `GET /account/documents/{documentId}` — `S` → the item plus `reviewerNotes`
### `DELETE /account/documents/{documentId}` — `S` → `204`, `409 document/not-withdrawable` once verified

### `GET /account/payout-methods` — `S`

```ts
{
  items: Array<{
    id: string;
    type: 'escrow_wallet'|'bank_transfer'|'mobile_money'|'crypto_wallet';
    label: string;                     // "Corporate bank · SWIFT"
    maskedReference: string;           // "···· 4471" — never the full number
    isDefault: boolean;
    status: 'pending_verification'|'verified'|'failed';
    statusLabel: string;               // "Primary" | "Verified"
    network: string | null;            // "TRC-20" for crypto
    bankName: string | null;
    swift: string | null;
    currency: string;
    verifiedAt: string | null;
  }>;
  canAddTypes: string[];               // gated by the account's country
}
```

**Never return a full account number, wallet address or SWIFT-plus-account pair.**
The edit sheet only ever needs the mask.

### `POST /account/payout-methods` — `S` · idempotent

```ts
// Request
{
  type: 'bank_transfer'|'mobile_money'|'crypto_wallet';
  accountReference: string;            // account number / wallet address / mobile number
  bankName?: string;
  swift?: string;
  network?: string;                    // crypto only
  makeDefault: boolean;
  currency?: string;
}
// 201
{
  method: { /* the item above */ };
  verification: { kind: 'test_deposit'|'signature'|'none'; expectedWithinHours: number; instructions: string };
}
```

`verification` is the "small test deposit before first use" the modal promises.
Validation against `addressPattern` from `/reference/payout-networks` →
`422 fields.accountReference`. `409 payout/duplicate`.

### `PATCH /account/payout-methods/{methodId}` — `S`

```ts
// Request
{ isDefault?: true; label?: string }
// 200 { method }
```

Setting a default clears the previous one atomically. A method with
`status: 'pending_verification'` cannot become default →
`409 payout/verification-pending`.

### `DELETE /account/payout-methods/{methodId}` — `S`

`204`. `409 payout/in-use` when an unsettled order or listing points at it.

---

## 18. Negotiation

The negotiation room is the most stateful screen in the app. Three message kinds
share one ordered thread, and offer state is derived from accept/counter history.

### `GET /negotiations` — `S`

```ts
{
  items: Array<{
    id: string;
    counterparty: { id: string; name: string; initials: string; type: string; verified: boolean };
    lot: { id: string; name: string; summary: string; grade: string };
    status: 'awaiting_reply'|'offer_received'|'agreed'|'closed';
    statusLabel: string;               // "Awaiting reply" | "Offer received" | "Agreed"
    lastMessageAt: string;
    lastMessagePreview: string;
    unreadCount: number;
    agreedOfferId: string | null;
    contractId: string | null;
  }>;
}
```

`status` is server-derived — the client currently computes it by walking the
thread for the last offer and checking who sent it. Deriving it once, server-side,
is the only way the list and the thread cannot disagree.

### `POST /negotiations` — `KYC`

```ts
// Request
{ lotId: string; message?: string; initialOffer?: OfferInput }
// 201
{ negotiation: { /* the list item */ } }
```

### `GET /negotiations/{negotiationId}` — `S`

```ts
{
  negotiation: { /* the list item */ };
  agreedTerms: {                       // null until an offer is accepted
    offerId: string;
    price: Money; unit: string; quantity: number;
    incoterm: string; namedPort: string;
    shipmentWindow: { from: string; to: string; display: string };
    settlement: string;                // "Letter of Credit"
    total: Money;
  } | null;
  progress: Array<{ key: 'terms_agreed'|'contract_drafted'|'contract_signed'|'lc_opened'; label: string; done: boolean }>;
  contractId: string | null;
  lcId: string | null;
}
```

`progress` is the four-step rail on the summary panel. It spans negotiation,
contract and LC, so only the server can fill it honestly — the client currently
infers `lc_opened` from `lcStatus !== 'Applied'`, which is a guess.

### `GET /negotiations/{negotiationId}/messages` — `S`

**Query:** `before`, `limit` (cursor pagination — threads grow).

```ts
{
  items: NegotiationMessage[];         // oldest → newest
  nextCursor: string | null;
}

type NegotiationMessage = TextMessage | OfferMessage | SystemMessage;

interface MessageBase { id: string; kind: string; createdAt: string; }

interface TextMessage extends MessageBase {
  kind: 'text';
  author: 'me' | 'them';
  body: string;
}

interface OfferMessage extends MessageBase {
  kind: 'offer';
  author: 'me' | 'them';
  offerId: string;
  price: Money;
  unit: string;
  quantity: number;
  incoterm: string;
  namedPort: string;
  shipmentWindow: { from: string; to: string; display: string };
  total: Money;
  state: 'open'|'accepted'|'countered'|'rejected'|'expired'|'superseded';
  stateLabel: string;                  // "Open" | "Awaiting reply" | "Accepted" | "Countered"
  actionable: boolean;                 // true only when open AND author === 'them'
  expiresAt: string | null;
}

interface SystemMessage extends MessageBase {
  kind: 'system';
  body: string;                        // "Offer accepted — terms locked..."
  event: 'offer_accepted'|'contract_signed'|'lc_issued'|'terms_expired';
}
```

`state` and `actionable` are served, not derived. The client's `isOpen` predicate
is four conditions deep (`open && !closed && !countered && !accepted`) and must
not be reimplemented in two places.

### `POST /negotiations/{negotiationId}/messages` — `S`

```ts
// Request
{ body: string }                       // 1–2000 chars, trimmed; empty is 422
// 201
{ message: TextMessage }
```

### `POST /negotiations/{negotiationId}/offers` — `KYC` · idempotent

```ts
// Request — OfferInput
{
  price: Money;
  unit: 'g'|'kg'|'oz'|'ct'|'MT';
  quantity: number;
  incoterm: 'EXW'|'FCA'|'FOB'|'CIF'|'DAP';
  namedPort: string;
  shipmentWindow: { from: string; to: string };
  inResponseToOfferId?: string;        // set when countering
  expiresAt?: string;
}
// 201
{ message: OfferMessage; supersededOfferId: string | null }
```

Making an offer **supersedes** the counterparty's open offer — that is the
client's `counter()` behaviour (mark countered, push a new offer) and the server
must do it in one transaction so two open offers can never coexist.

`409 negotiation/terms-already-agreed` once an offer is accepted.

### `POST /negotiations/{negotiationId}/offers/{offerId}/accept` — `KYC` · idempotent

```ts
// 200
{
  offer: OfferMessage;                 // state: 'accepted'
  systemMessage: SystemMessage;
  agreedTerms: { /* as in GET */ };
  contract: { id: string; status: 'draft' } | null;   // auto-drafted
}
```

`contract` being returned here is what makes "A draft contract is ready" true.
The client then navigates to the Contract Builder with real data rather than
copying the offer into `ct` itself.

Errors: `403 negotiation/offer-not-yours` (you cannot accept your own offer),
`409 negotiation/offer-closed`, `409 negotiation/terms-already-agreed`.

### `POST /negotiations/{negotiationId}/offers/{offerId}/counter` — `KYC`

Convenience wrapper over `POST /offers` with `inResponseToOfferId` set. Same
request body as `OfferInput` minus that field. `201` with
`{ counteredOffer, newOffer }`.

### `POST /negotiations/{negotiationId}/offers/{offerId}/reject` — `S`

```ts
// Request
{ reason?: string }
// 200 { offer: OfferMessage }          // state: 'rejected'
```

---

## 19. Contracts

### `GET /contracts` — `S` → `Paginated<ContractSummary>`, query `status`

### `POST /contracts` — `KYC`

```ts
// Request
{ negotiationId: string; acceptedOfferId: string }
// 201
{ contract: Contract }
```

Terms are prefilled from the accepted offer server-side —
`409 contract/already-exists` returns the existing one rather than drafting a second.

### `GET /contracts/{contractId}` — `S`

```ts
interface Contract {
  id: string;
  reference: string;                   // "MB-CONTRACT-2026-0419"
  status: 'draft' | 'signed' | 'countersigned' | 'cancelled';
  negotiationId: string;
  lcId: string | null;
  buyer: { id: string; name: string; company: string; signatory: string | null };
  seller: { id: string; name: string; company: string; signatory: string | null };
  terms: {
    lotDescription: string;            // "Gold Concentrate · 2.4 kg"
    incoterm: 'EXW'|'FCA'|'FOB'|'CIF'|'DAP';
    namedPort: string;
    unitPrice: Money;
    quantity: number;
    unit: 'g'|'kg'|'oz'|'ct'|'MT';
    total: Money;                      // server-computed; never trust a client total
    shipmentFrom: string;              // YYYY-MM-DD
    shipmentTo: string;
    lcType: 'Irrevocable'|'Confirmed'|'Standby';
    tenor: 'At sight'|'30 days'|'60 days'|'90 days';
    issuingBankId: string;
    issuingBankName: string;
    presentationPeriodDays: number;
  };
  validation: {
    valid: boolean;
    missing: string[];                 // ["namedPort","issuingBankName"]
    messages: Record<string, string>;
  };
  signatures: {
    buyer: { signed: boolean; signatory: string | null; signedAt: string | null };
    seller: { signed: boolean; signatory: string | null; signedAt: string | null };
  };
  anchor: ChainAnchor | null;          // present once signed
  editable: boolean;                   // false once signed
  createdAt: string;
  updatedAt: string;
}
```

`validation` serves the sign button's enabled state. The client's `valid` check
(total > 0, dates set, port set, bank set) is a copy; the server's is the one
that decides.

### `PATCH /contracts/{contractId}` — `KYC`

```ts
// Request — any subset of terms
{ incoterm?, namedPort?, unitPrice?, quantity?, unit?, shipmentFrom?, shipmentTo?, lcType?, tenor?, issuingBankId?, presentationPeriodDays? }
// 200 { contract: Contract }
```

`409 contract/already-signed` — which is the server-side half of the client's
`locked` state. `422 contract/terms-invalid` with per-field `fields` for an
inverted shipment window, a non-positive quantity, or a presentation period
beyond LC expiry.

### `POST /contracts/{contractId}/sign` — `KYC` · idempotent

```ts
// Request
{ signatory: string; acceptedTermsVersion: string; otpCode?: string }
// 200
{
  contract: Contract;                  // status: 'signed', editable: false
  anchor: ChainAnchor;
  nextAction: { kind: 'open_lc'; lcApplicationUrl: string };
}
```

Signing is the point of no return: terms lock and the hash anchors. Require a
fresh OTP (`otpCode`) when the account has 2FA on —
`403 auth/reauthentication-required` otherwise. `409 contract/already-signed`
returns the existing signature rather than double-anchoring.

`nextAction` carries the Contract Builder's "Open LC Workspace" step.

### `GET /contracts/{contractId}/document` — `S`

```ts
{ url: string; expiresAt: string; format: 'pdf'; sizeBytes: number; hash: string }
```

The PDF must render the same terms as the live preview; `hash` lets the buyer
verify it against `anchor.hash`.

---

## 20. Letters of credit

Lifecycle: `Applied → Issued → Advised → Confirmed`, then
`Goods shipped → Docs presented → Examined → Payment` — the eight milestones
on the LC Workspace timeline.

### `GET /lcs` — `S` → `Paginated<LcSummary>`

### `POST /lcs` — `KYC`

```ts
// Request
{ contractId: string; issuingBankId: string; advisingBankId?: string; expiresAt?: string }
// 201
{ lc: LetterOfCredit }
```

`409 contract/not-signed` — an LC cannot exist before a signed contract.

### `GET /lcs/{lcId}` — `S`

```ts
interface LetterOfCredit {
  id: string;
  reference: string;                   // "LC-2026-0419"
  status: 'Applied'|'Issued'|'Advised'|'Confirmed'|'Presented'|'Examined'|'Paid'|'Refused'|'Expired';
  lcType: 'Irrevocable'|'Confirmed'|'Standby';
  tenor: 'At sight'|'30 days'|'60 days'|'90 days';
  amount: Money;
  contractId: string;
  applicant: { name: string; company: string };
  beneficiary: { name: string; company: string };
  issuingBank: { id: string; name: string; swift: string };
  advisingBank: { id: string; name: string; swift: string } | null;
  goodsDescription: string;
  incoterm: string;
  namedPort: string;
  latestShipmentDate: string;          // YYYY-MM-DD
  expiresAt: string;
  presentationPeriodDays: number;
  billOfLading: { onBoardDate: string | null; number: string | null; vessel: string | null } | null;
  presentation: {
    presentedAt: string | null;
    examination: 'accepted' | 'refused' | null;
    examinedAt: string | null;
    discrepancies: Discrepancy[];
  } | null;
  payment: { released: boolean; releasedAt: string | null; amount: Money | null; anchor: ChainAnchor | null };
  createdAt: string;
}

interface Discrepancy {
  code: string;                        // "bl/late-shipment", "document/not-presented"
  documentKey: string | null;
  message: string;                     // "Bill of lading on-board date (06 Oct 2026) is after..."
  severity: 'discrepancy' | 'warning';
}
```

### `GET /lcs/{lcId}/milestones` — `S`

```ts
{
  items: Array<{ index: number; key: string; label: string; state: 'done'|'current'|'pending'; occurredAt: string | null }>;
}
```

Eight milestones: `application`, `issued`, `advised`, `confirmed`,
`goods_shipped`, `docs_presented`, `examined`, `payment`. The client currently
builds the `done[]` array from six separate state fields; the server should
collapse that into one ordered answer.

### `GET /lcs/{lcId}/documents` — `S`

```ts
{
  items: Array<{
    key: 'invoice'|'bl'|'packing'|'origin'|'assay'|'insurance'|'inspection';
    name: string;                      // "Bill of lading"
    requirement: string;               // "Full set, clean on-board, to order of the issuing bank"
    required: boolean;
    uploaded: boolean;
    file: FileRef | null;
    extracted: Record<string, string> | null;   // parsed values the bank examines
    uploadedAt: string | null;
  }>;
  allRequiredPresented: boolean;
}
```

`extracted` carries the values the Bank Portal shows per document — on-board date
and container for the B/L, weight per sealed unit for the packing list, purity
and lab for the assay. That is examination data and belongs server-side; it is
currently a hardcoded `VAL` map in `useBankViewModel`.

### `POST /lcs/{lcId}/documents` — `KYC`

```ts
// Request
{ key: string; fileId: string }
// 201
{ document: { /* the item above */ }; precheckInvalidated: true }
```

`precheckInvalidated` is the contract for the client's `lcCheck: false` reset on
every document change — a stale pre-check must never authorise a presentation.

### `DELETE /lcs/{lcId}/documents/{documentKey}` — `KYC`

`204`. Also invalidates the pre-check. `409 lc/already-presented`.

### `POST /lcs/{lcId}/precheck` — `S`

```ts
// 200
{
  checkedAt: string;
  compliant: boolean;
  discrepancies: Discrepancy[];
  missingDocuments: string[];
  summary: string;                     // "2 discrepancies found" | "Complying presentation"
  canPresent: boolean;
  blockedReason: string | null;        // "The LC must be confirmed before documents can be presented."
}
```

This is a UCP 600 compliance scan and the one endpoint whose logic the client
genuinely cannot own: comparing the B/L on-board date against the latest shipment
date, checking invoice value against the credit amount, insurance at 110%, the
presentation period. `canPresent` and `blockedReason` map directly onto the
existing `presentBlocked` / `presentHint` pair.

### `POST /lcs/{lcId}/presentation` — `KYC` · idempotent

```ts
// Request
{ precheckAcknowledged: true; notes?: string }
// 200
{ lc: LetterOfCredit; presentedAt: string; examinationSlaHours: 120 }
```

Five banking days is the UCP 600 examination period — hence `120`.

Errors, each a distinct screen state:
`409 lc/not-confirmed`, `409 lc/precheck-required`,
`409 lc/discrepancies-present`, `422 lc/documents-incomplete`,
`409 lc/already-presented`.

### `POST /lcs/{lcId}/amendments` — `KYC`

```ts
// Request
{ changes: Array<{ field: string; from: string; to: string }>; reason: string }
// 201
{ amendment: { id: string; status: 'pending_approval'; requestedAt: string; approvals: Array<{ party: string; approved: boolean | null }> } }
```

An amendment needs applicant, beneficiary and bank consent — the modal's "sent to
the applicant for approval".

---

## 21. Bank portal

Nine endpoints, all `bank_operator`. A `buyer` token gets `403 auth/role-required`.

### `GET /bank/lc-applications` — `BANK`

```ts
// Paginated<BankLcRow>
interface BankLcRow {
  lcId: string;
  reference: string;
  applicant: string;
  beneficiary: string;
  amount: Money;
  status: 'Applied'|'Issued'|'Advised'|'Confirmed'|'Presented'|'Examined'|'Paid'|'Refused';
  availableActions: Array<'issue'|'advise'|'confirm'|'amend'>;
  submittedAt: string;
  hasPresentation: boolean;
}
```

`availableActions` is served so the four action buttons' enabled state comes from
the state machine, not from a client-side status comparison. Today the client
hardcodes `Issue` as enabled only when `status === 'Applied'`; that rule belongs
with the machine.

### `GET /bank/lc-applications/{lcId}` — `BANK`

```ts
{
  lc: LetterOfCredit;
  terms: Array<{ label: string; value: string }>;    // the examination panel
  applicantCreditLimit: Money | null;
  collateralHeld: Money | null;
}
```

### `POST /bank/lc-applications/{lcId}/issue` — `BANK`
### `POST /bank/lc-applications/{lcId}/advise` — `BANK`
### `POST /bank/lc-applications/{lcId}/confirm` — `BANK`

Same shape for all three:

```ts
// Request
{ notes?: string }
// 200
{ lc: LetterOfCredit; status: string; notifiedParties: string[]; transitionedAt: string }
```

`notifiedParties` is the modal's "All parties on LC-2026-0419 have been notified."
`409 lc/invalid-transition` for anything out of order.

### `POST /bank/lc-applications/{lcId}/amend` — `BANK`

```ts
// Request
{ changes: Array<{ field: string; from: string; to: string }>; message: string }
// 201
{ amendment: { id: string; status: 'sent_to_applicant'; sentAt: string } }
```

### `GET /bank/presentations/{lcId}` — `BANK`

```ts
{
  lcReference: string;
  presentedAt: string;
  documents: Array<{
    key: string;
    name: string;
    presented: boolean;
    extractedValue: string;            // "On board 06 Oct 2026 · MEDU 4471882"
    compliant: boolean;
    discrepancyNote: string | null;    // "— after latest shipment date"
    file: FileRef;
  }>;
  discrepancies: Discrepancy[];
  compliant: boolean;
  summary: string;
  examination: 'accepted' | 'refused' | null;
  examinationDeadline: string;
}
```

`404` when nothing has been presented — the frontend's `examEmpty` branch.

### `POST /bank/presentations/{lcId}/examination` — `BANK` · idempotent

```ts
// Request
{ decision: 'accepted' | 'refused'; discrepancyCodes?: string[]; notes?: string }
// 200
{
  lc: LetterOfCredit;
  decision: 'accepted' | 'refused';
  decidedAt: string;
  beneficiaryNotified: boolean;
  paymentAuthorised: boolean;          // true only on 'accepted'
}
```

A `refused` presentation must list `discrepancyCodes` — `422` otherwise. UCP 600
requires the refusal notice to state every discrepancy, and a refusal returns the
LC to a state where documents can be re-presented, which is why the client clears
`lcPresented` on refuse.

`409 lc/already-examined`. Accepting a presentation that carries discrepancies
requires an explicit `notes` justification.

### `POST /bank/presentations/{lcId}/payment` — `BANK` · idempotent

```ts
// Request
{ amount?: Money; valueDate?: string; reference?: string }
// 200
{
  payment: { released: true; releasedAt: string; amount: Money; beneficiary: string; anchor: ChainAnchor };
  lc: LetterOfCredit;                  // status: 'Paid'
}
```

`409 lc/payment-not-authorised` unless `examination === 'accepted'`. The response
produces the "Payment released · settlement hash recorded on-chain" panel.

**This endpoint moves money.** `Idempotency-Key` is mandatory, not optional, and
a replay must return the original payment rather than releasing twice.

---

## 22. Shipments

### `GET /shipments` — `S` → `Paginated<ShipmentSummary>`, query `lcId`, `orderId`, `contractId`

### `GET /shipments/{shipmentId}` — `S`

```ts
{
  id: string;
  lotDescription: string;
  references: { billOfLading: string; lcReference: string | null; orderId: string | null };
  route: { fromPort: string; fromCountry: string; toPort: string; toCountry: string };
  departedAt: string | null;
  estimatedArrival: string;
  actualArrival: string | null;
  progressPercent: number;
  vessel: { name: string; voyage: string; imo: string | null };
  container: { number: string; sealNumber: string; type: string };
  insuredValue: Money;
  insuranceRate: number;               // 1.1 — the 110% the LC requires
  incoterm: string;
  status: 'booked'|'loaded'|'in_transit'|'discharged'|'delivered'|'delayed';
}
```

### `GET /shipments/{shipmentId}/events` — `S`

```ts
{
  items: Array<{
    id: string;
    index: number;
    title: string;                     // "Loaded on vessel"
    actor: string;                     // "MSC Aurora · Voy 226W"
    location: string;                  // "Port of Tema"
    occurredAt: string | null;         // null for a projected event
    projected: boolean;                // ETA rows
    state: 'done' | 'current' | 'pending';
    anchor: ChainAnchor | null;
  }>;
}
```

Six custody events, the last two projected. `state` is server-side: the client
currently hardcodes the first three as done, which only works for demo data.

### `GET /shipments/{shipmentId}/documents` — `S`

```ts
{ items: Array<{ id: string; kind: 'bill_of_lading'|'packing_list'|'insurance_certificate'|'delivery_note'; name: string; file: FileRef }> }
```

---

## 23. Notifications, support, content, uploads

### `GET /notifications` — `S`

**Query:** `unreadOnly`, `kind`, `page`, `perPage`.

```ts
{
  items: Array<{
    id: string;
    kind: 'auction_outbid'|'auction_opening'|'auction_won'|'kyc_decided'|'order_stage'|'lc_status'|'document_reviewed'|'payout_verified';
    title: string;                     // "You were outbid on Gold Dore Bars"
    body: string;
    read: boolean;
    createdAt: string;
    severity: 'info'|'warning'|'success'|'error';
    action: { label: string; route: string; params: Record<string, string> } | null;
    data: Record<string, unknown>;     // kind-specific: { auctionId, currentBid } etc.
  }>;
  unreadCount: number;
  page: number; perPage: number; total: number;
}
```

`action.route` uses the frontend's `RouteKey` vocabulary (`auctionDetail`, `kyc`,
`orderDetail`), so a notification can deep-link without the server knowing URLs.

### `POST /notifications/{notificationId}/read` — `S` → `204`
### `POST /notifications/read-all` — `S` → `200 { markedCount: number }`
### `PATCH /notifications/preferences` — `S`

```ts
// Request
{ channels?: { email?: boolean; sms?: boolean; push?: boolean }; kinds?: Record<string, boolean> }
// 200 { preferences: {...} }
```

### `POST /support/chat-sessions` — `S`

```ts
// Request
{ topic?: string; orderId?: string }
// 201
{ sessionId: string; status: 'queued'|'connected'; estimatedWaitSeconds: number; agentsOnline: number; transportUrl: string }
```

`estimatedWaitSeconds` replaces the hardcoded "under 2 minutes".

### `POST /support/tickets` — `S`

```ts
// Request
{ subject: string; body: string; orderReference?: string; attachmentFileIds?: string[] }
// 201
{ ticketId: string; reference: string; responseSlaHours: 4 }
```

### `POST /support/callbacks` — `S`

```ts
// Request
{ phone: string; preferredWindow?: string; topic?: string }
// 201
{ callbackId: string; phone: string; expectedWithinMinutes: number; eligible: boolean }
```

`eligible: false` with `403 support/institutional-only` for non-institutional
accounts — the row already says "Institutional accounts only".

### `GET /content/faq` — public

```ts
{ items: Array<{ id: string; category: string; question: string; answer: string; helpCentreUrl: string }> }
```

### `GET /content/how-it-works` — public

```ts
{
  video: {
    durationSeconds: 47;
    posterUrl: string;
    sources: Array<{ url: string; mimeType: string; quality: string }>;
    chapters: Array<{ index: number; title: string; caption: string; startSeconds: number; imageUrl: string; gradientFrom: string; gradientTo: string }>;
  };
  topics: Array<{
    key: 'sell'|'assure'|'buy'|'chain';
    title: string;
    summary: string;
    iconKey: 'shield'|'flask'|'truck'|'chain';
    points: string[];
  }>;
}
```

### `GET /content/mining-hub` — public

```ts
{
  modules: Array<{ key: string; title: string; description: string; iconKey: string; route: string | null }>;
  requirements: string[];
  benefits: Array<{ headline: string; label: string }>;
}
```

### `GET /content/pipelines` — public

```ts
{
  buy: { label: string; note: string; stages: Array<{ index: number; title: string; subtitle: string }> };
  sell: { label: string; note: string; stages: Array<{ index: number; title: string; subtitle: string }> };
}
```

### `POST /uploads` — `S`

Presigned direct upload. Document bytes never pass through the API tier.

```ts
// Request
{
  purpose: 'kyc_document'|'kyc_selfie'|'listing_photo'|'account_document'|'asm_document'|'lc_document'|'support_attachment'|'avatar';
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}
// 201
{
  fileId: string;
  uploadUrl: string;                   // presigned PUT, S3-compatible
  method: 'PUT';
  headers: Record<string, string>;
  expiresAt: string;
  maxSizeBytes: number;
}
```

Flow: `POST /uploads` → `PUT uploadUrl` with the bytes → pass `fileId` to the
owning endpoint (`POST /kyc/captures`, `POST /listings/{id}/photos`, …). A
`fileId` that was never uploaded, or is used for the wrong `purpose`, is
`422 upload/not-completed`.

Limits by purpose: images 10 MB (`image/jpeg`, `image/png`, `image/webp`);
documents 25 MB (`application/pdf` plus those image types). Over the limit is
`413 upload/too-large`; anything else is `422 upload/unsupported-type`.
Every upload is virus-scanned asynchronously; a quarantined file makes its
owning record `rejected` with a reason.

### `GET /files/{fileId}` — `S`

```ts
{ url: string; expiresAt: string; name: string; mimeType: string; sizeBytes: number }
```

Signed URLs expire in 5 minutes. Access is checked against the owning record —
being able to name a `fileId` must never be enough.

---

## 24. Realtime

Two WebSocket channels and one SSE stream. Per ARCHITECTURE.md §5.2, the
subscription lives in `lib/api/` and writes into the TanStack Query cache with
`setQueryData`; components never see the transport.

### Handshake

```
wss://api.mineralbridge.com/v1/ws/auctions/{auctionId}?token=<accessToken>
```

The access token goes in the query string (browsers cannot set headers on
`WebSocket`), so it must be short-lived and single-purpose: issue a dedicated
`wsToken` from `GET /auth/me` rather than reusing the bearer token.

Envelope, every message:

```ts
{ event: string; sequence: number; sentAt: string; data: unknown }
```

`sequence` is monotonic per channel; a gap means the client should refetch
rather than patch.

### R1 — `/ws/auctions/{auctionId}`

| Event | `data` |
|---|---|
| `bid.placed` | `{ bidId, amount: Money, bidderLabel, placedAt, bidCount, minimumNextBid }` |
| `bidder.outbid` | `{ yourBid: Money, currentBid: Money, auctionName }` — addressed to one subscriber |
| `auction.extended` | `{ closesAt, reason: 'anti_snipe' }` |
| `auction.closing` | `{ secondsRemaining }` |
| `auction.closed` | `{ finalBid: Money, outcome: 'won'\|'lost'\|'unsold', settlementOrderId }` |

### R2 — `/ws/negotiations/{negotiationId}`

| Event | `data` |
|---|---|
| `message.created` | a `TextMessage` |
| `offer.created` | an `OfferMessage` + `supersededOfferId` |
| `offer.accepted` | `{ offerId, agreedTerms, contractId }` |
| `offer.countered` | `{ counteredOfferId, newOffer }` |
| `typing` | `{ party: 'them' }` — ephemeral, not persisted |

### R3 — `/events/notifications` (SSE)

```
GET /events/notifications
Accept: text/event-stream
Last-Event-ID: <sequence>
```

| Event | `data` |
|---|---|
| `notification.created` | a notification item |
| `kyc.decided` | `{ status: 'verified'\|'rejected', decidedAt, rejectionReason }` |
| `order.stage_changed` | `{ orderId, stageIndex, stageTitle, progressPercent }` |
| `lc.status_changed` | `{ lcId, status, milestone }` |
| `session.revoked` | `{ reason: 'password_changed'\|'revoked_by_user'\|'expired' }` |

`kyc.decided` is what lets the KYC pending screen flip to approved in place — the
design was built for it, and it is the only way "we'll notify you the moment it
clears" is true.

`session.revoked` must drive `signOut('expired')` client-side, which
`useSessionSync` already handles by reopening the sign-in overlay with
`pendingResume` set.

SSE heartbeat: a `: ping` comment every 20 s so proxies hold the connection.

---

## 25. State machines

The server owns every transition below. The client renders them; it must never
compute one.

### KYC status

```
unverified ──submit──▶ pending ──approve──▶ verified
                          │
                          └──reject───────▶ rejected ──resubmit──▶ pending
```

Only `verified` unlocks the 16 KYC-gated endpoints. A `pending` submission is
not sufficient — this is explicit in `requireKyc` and must be explicit in the
server's check.

### Order status

```
in_review ──verify──▶ active ──settle──▶ complete
    │                   │
    └──reject──▶ rejected (terminal)
    └──cancel──▶ cancelled (terminal, only before escrow funding)
```

Six pipeline stages run underneath (`BUY_STAGES` / `SELL_STAGES`). A rejected
order **stops** at the stage it failed — it has a `terminated` stage and no
`current` one.

### Listing status

```
draft ──submit──▶ submitted ──schedule──▶ visit_scheduled ──verify──▶ verified
                                                │                        │
                                                └──fail──▶ rejected      ▼
                                                                   in_transit
                                                                        ▼
                                                                    received
                                                                        ▼
                                                                      paid
```

### Auction state

```
upcoming ──opensAt──▶ live ──closesAt──▶ ended
```

Driven by the server clock only. A bid inside the final 2 minutes pushes
`closesAt` out by 2 minutes.

### Offer state

```
open ──accept───▶ accepted   (terminal; locks the whole negotiation)
  │  ──counter──▶ countered  (terminal; a new open offer is created)
  │  ──reject───▶ rejected   (terminal)
  │  ──expire───▶ expired    (terminal)
  └──(new offer from the same party)──▶ superseded
```

**At most one `open` offer per negotiation at any moment.** Accept and counter
must be transactional against that invariant.

### Contract status

```
draft ──sign──▶ signed ──countersign──▶ countersigned
  └──cancel──▶ cancelled
```

`draft` is the only editable state. Signing anchors a hash and is irreversible.

### LC status

```
Applied ──issue──▶ Issued ──advise──▶ Advised ──confirm──▶ Confirmed
                                                              │
                                                       present documents
                                                              ▼
                                                          Presented
                                                              │
                                            ┌─────────────────┴─────────────────┐
                                        accept                              refuse
                                            ▼                                   ▼
                                        Examined ──release──▶ Paid          Refused
                                                                                │
                                                                    (documents may be
                                                                     corrected and
                                                                     re-presented)
```

Guards that must hold server-side:

- documents can only be presented from `Confirmed`;
- a presentation requires a **current** pre-check — any document change invalidates it;
- payment can only be released from `Examined` with `examination === 'accepted'`;
- a refusal must enumerate every discrepancy (UCP 600 Article 16);
- `Expired` is reachable from any pre-`Paid` state once `expiresAt` passes.

### Payout method status

```
pending_verification ──test deposit confirmed──▶ verified
            └──failed──▶ failed (re-linkable)
```

Only a `verified` method may be default or receive a payout.

---

## 26. Non-functional requirements

### Performance budgets

| Endpoint class | p50 | p95 |
|---|---:|---:|
| Reference data (cached) | 20 ms | 80 ms |
| Lot / auction listings | 80 ms | 300 ms |
| Single resource reads | 50 ms | 200 ms |
| Writes (orders, bids, offers) | 120 ms | 400 ms |
| LC pre-check | 300 ms | 1 s |
| Document / PDF generation | — | `202` + poll |

`POST /orders/quote` is called on every quantity keystroke and
`POST /auctions/{id}/bids` competes in a live auction — both must stay inside the
write budget.

### Caching

| Resource | Policy |
|---|---|
| `/reference/*` | `public, max-age=3600`, `ETag` |
| `/content/*` | `public, max-age=600`, `ETag` |
| `/market/rates` | `public, max-age=30` |
| `/lots`, `/lots/{id}` | `public, max-age=60`, `ETag` |
| `/passports/{id}` | `public, max-age=300` |
| Everything authenticated | `private, no-store` |

The client's `staleTime` is 30 s, so anything shorter than that on the server
side is wasted.

### Rate limits

| Scope | Limit |
|---|---|
| Anonymous, per IP | 120 req/min |
| Authenticated, per user | 600 req/min |
| `POST /auth/otp/*` | 3 per identifier / 15 min; 10 per IP / hour |
| `POST /auctions/{id}/bids` | 30/min per user |
| `GET /passports/{id}` | 30/min per IP |
| `POST /uploads` | 60/hour per user |

Over the limit: `429` with `Retry-After`.

### Security

- TLS 1.2 minimum, HSTS with `max-age=31536000; includeSubDomains`.
- CORS: an explicit origin allowlist. `Access-Control-Allow-Credentials: true` is required for the refresh cookie, which makes `Access-Control-Allow-Origin: *` impossible — list the origins.
- The access token is never written to `localStorage`, `sessionStorage` or a readable cookie. The client already guarantees this; the server must not suggest otherwise by returning it in a `Set-Cookie`.
- **Never log** access tokens, refresh tokens, OTP codes, full payout references, wallet addresses or KYC images. `X-Request-Id` is the correlation handle.
- KYC images and liveness selfies: encrypted at rest with a separate key, access audited, retained only as long as the AML retention period requires.
- Every money-moving and compliance action writes an immutable audit record: actor, action, resource, before/after, IP, request id.
- Enumerable namespaces (`/passports/{id}`, `/lots/{id}`) are rate-limited; authenticated resources answer `403` rather than `404` for a resource the caller is not party to, so existence does not leak.

### Versioning

The version lives in the path (`/v1`). Within `v1`, additive changes only: new
optional fields and new endpoints are fine; removing a field, renaming one,
narrowing an enum or tightening validation is a breaking change and needs `/v2`.
Enum additions are breaking for the client where it exhaustively switches
(`RouteKey`, `KycStage`, `SortKey`), so new enum members ship behind an explicit
frontend release.

### Observability

Each response carries `X-Request-Id`. Trace context propagates via `traceparent`
(W3C). The alert set that matters here: bid-write latency, LC pre-check error
rate, OTP delivery success by channel, upload scan backlog, and `403
kyc/not-approved` volume — a spike in the last one means the client's prompt and
the server's gate have drifted apart.

---

## Appendix A — Frontend type ↔ wire type map

Where the shipped frontend type differs from the wire shape, the feature service
adapts. This is the full list of adapters a backend integration needs.

| Frontend (`src/types/index.ts`) | Wire | Adapter |
|---|---|---|
| `Product.price: string` `"$2,410"` | `price: Money` | format in the component |
| `Product.stock: string` `"745 g"` | `availableQuantity: Quantity` | format in the component |
| `Product.grad: string` (CSS) | `imageUrl` + `gradientFrom` + `gradientTo` | compose CSS in the component |
| `Product.region: string` | `origin: { city, country, countryName, display }` | use `origin.display` |
| `Order.progress: string` `"33%"` | `progressPercent: number` | append `%` |
| `Order.sc` / `Order.sbg` (hex) | `status` enum | map status → colours in the component |
| `Order.stage?: string` | `stage: { index, total, title, subtitle }` | use `stage.title` |
| `Auction.bidNum: number` | `currentBid: Money` | `amount / 100` |
| `Auction.yourBidNum: number` | `viewer.highestBid: Money` | same |
| `Auction.timeLabel: string` | `closesAt` + `serverTime` | live countdown |
| `Course.done: number` | `progress.lessonsCompleted` | direct |
| `ContractTerms.price: string` | `terms.unitPrice: Money` | parse / format |
| `ContractTerms.qty: string` | `terms.quantity: number` | parse / format |
| `NegotiationOffer.price: number` | `price: Money` | `amount / 100` |
| `NegotiationOffer.open?: boolean` | `state` + `actionable` | drop the client-side derivation |
| `PayoutMethod.ref: string` | `maskedReference: string` | direct; never un-mask |
| `AccountForm.pw: string` | — | never sent to or stored by the profile endpoint; `POST /auth/password/change` only |

## Appendix B — What the frontend hardcodes today and must stop

Each of these is a business rule currently living in a view model. The endpoint
that should own it is named.

| Hardcoded value | Where | Owning endpoint |
|---|---|---|
| 1% buyer platform fee (`sub * 0.01`) | `useProductViewModel` | `GET /lots/{id}` → `platformFeeRate`; `POST /orders/quote` |
| `INDICATIVE_RATE = 2410` | `useSellViewModel` | `POST /listings/quote` → `rateUsed` |
| `SELLER_FEE = 0.02` | `useSellViewModel` | `POST /listings/quote` → `sellerFeeRate` |
| The four settlement options (`PAYS`) | `useProductViewModel` | `GET /lots/{id}` → `settlementOptions` |
| `$500` bid increment | `useAuctionsViewModel` | `GET /auctions/{id}` → `minimumIncrement` |
| `"Ends in 02:14:38"` | `constants/auctions.ts` | `closesAt` + `serverTime` |
| The 7 LC document requirements (`LC_DOCS`) | `features/trade/constants` | `GET /lcs/{id}/documents` |
| LC discrepancy logic (`useLcState`) | `useLcViewModel` | `POST /lcs/{id}/precheck` |
| Bank examination values (`VAL`) | `useBankViewModel` | `GET /bank/presentations/{lcId}` → `extractedValue` |
| Bank action enablement | `useBankViewModel` | `GET /bank/lc-applications` → `availableActions` |
| `BL_DATES` demo toggle | `useLcViewModel` | `GET /lcs/{id}` → `billOfLading.onBoardDate` |
| `CONTRACT_HASH` placeholder | `useContractViewModel` | `POST /contracts/{id}/sign` → `anchor` |
| Pipeline stage definitions | `constants/catalog.ts` | `GET /content/pipelines`; `GET /orders/{id}/timeline` |
| Order document stage gating | `useOrderDetailViewModel` | `GET /orders/{id}/documents` → `availableFromStage` |
| Password policy | `useAccountEditViewModel` | `POST /auth/password/change` |
| `requiredSides` from `idType !== 'passport'` | `useKycViewModel` | `GET /kyc` → `requiredSides` |
| Device session list (`SESSION_DEFS`) | `useAccountEditViewModel` | `GET /auth/sessions` |
| `24h` KYC / document review SLA | several modals | `reviewSlaHours` on the respective endpoints |

Clearing Appendix B is what turns the click-through into a product.
