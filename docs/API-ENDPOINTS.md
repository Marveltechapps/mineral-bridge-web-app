# Mineral Bridge — API Endpoints List

**Derived from:** `Mineral_Bridge_Web_Final` — Vite + React frontend, 22 routes, 15 state slices
**Date:** 16 October 2026
**Base URL:** `VITE_API_BASE_URL` (e.g. `https://api.mineralbridge.com/v1`)
**Companion document:** [API-CONTRACT.md](API-CONTRACT.md) — request/response schemas, error codes, status machines

---

## 1. Totals

| | Count |
|---|---:|
| **REST endpoints** | **136** |
| Realtime channels (WebSocket / SSE) | 3 |
| **Total surface** | **139** |

### By HTTP method

| Method | Count |
|---|---:|
| `GET` | 66 |
| `POST` | 53 |
| `PATCH` | 7 |
| `PUT` | 1 |
| `DELETE` | 9 |
| **Total** | **136** |

Reads outnumber writes roughly 2:1 — expected for a marketplace whose screens are mostly listings, timelines and document views.

### By domain

| # | Domain | Endpoints | Frontend owner |
|---|---|---:|---|
| 1 | Authentication & session | 11 | `sessionSlice`, `lib/auth/session` |
| 2 | KYC / identity verification | 6 | `kycSlice`, `useKycViewModel` |
| 3 | Reference data | 8 | `constants/*`, form selects |
| 4 | Catalog, lots & market data | 7 | `catalogSlice`, `productSlice` |
| 5 | Mineral passport | 2 | `passportSlice` |
| 6 | Orders (buy-side) | 9 | `ordersSlice` |
| 7 | Sell listings | 7 | `sellSlice` |
| 8 | Auctions & bidding | 8 | `auctionsSlice` |
| 9 | ASM Academy | 8 | `academySlice` |
| 10 | ASM site registration | 8 | `asmSlice` |
| 11 | Account, documents, payouts, security | 11 | `accountSlice` |
| 12 | Negotiation room | 9 | `tradeSlice` (negotiation) |
| 13 | Contract builder | 6 | `tradeSlice` (contract) |
| 14 | Letters of credit | 10 | `tradeSlice` (LC) |
| 15 | Bank portal | 9 | `tradeSlice` (bank) |
| 16 | Shipment tracking | 4 | `useShipmentViewModel` |
| 17 | Notifications | 4 | outbid banner, KYC banner |
| 18 | Support & help | 4 | account → support tab |
| 19 | Static content | 3 | `howItWorksSlice`, mining hub |
| 20 | File uploads | 2 | all upload controls |
| | **Total** | **136** | |

### Legend

- **Auth** — `—` public · `S` signed-in session required · `KYC` signed-in **and** KYC approved · `BANK` bank-operator role
- **Screen** — the route (`src/constants/routes.ts`) that consumes the endpoint
- **Handler** — the frontend function that triggers the call, where one exists today

> **KYC is enforced server-side.** `requireKyc` in `src/hooks/useActions.ts` is a prompt, never a gate — anyone can reach the network call without passing through it. Every `KYC` row below must return `403 kyc/not-approved` when `kycStatus !== 'verified'` (ARCHITECTURE.md §8.3).

---

## 2. Authentication & session — 11

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 1 | `POST` | `/auth/register` | — | `/auth` | Create account — `authMode: 'signup'`, `authRole` of `Buyer` \| `Seller / miner` \| `Both` |
| 2 | `POST` | `/auth/otp/request` | — | `/auth` | Send OTP via `mobile` \| `email` \| `whatsapp` — `sendOtp` |
| 3 | `POST` | `/auth/otp/verify` | — | `/auth` | Verify 4-digit OTP → `{ accessToken, expiresIn }` + refresh cookie — `verifyOtp` |
| 4 | `POST` | `/auth/otp/resend` | — | `/auth` | Resend the live OTP challenge |
| 5 | `POST` | `/auth/refresh` | cookie | global | Rotate refresh cookie → new access token — `lib/auth/session.performRefresh` |
| 6 | `POST` | `/auth/logout` | `S` | `/account` | End the session server-side — `confirmLogout` |
| 7 | `GET` | `/auth/me` | `S` | global | Hydrate on reload: profile, `kycStatus`, roles |
| 8 | `POST` | `/auth/password/change` | `S` | `/account/edit` | Change password — `accSave` with `accEditKind: 'password'` |
| 9 | `GET` | `/auth/sessions` | `S` | `/account/edit` | Active device list — `accEditKind: 'sessions'` |
| 10 | `DELETE` | `/auth/sessions/{sessionId}` | `S` | `/account/edit` | Revoke a device — `revoke` |
| 11 | `DELETE` | `/auth/account` | `S` | `/account` | Delete account — `confirmDelete`; blocked while orders are open |

## 3. KYC / identity verification — 6

Six-stage flow: `why → type → capture → live → review → pending`.

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 12 | `GET` | `/kyc` | `S` | `/kyc` | Current record: `status`, `stage`, `idType`, captured sides, selfie |
| 13 | `PATCH` | `/kyc` | `S` | `/kyc` | Choose document type `national` \| `passport` \| `licence` — `select` on `kycIdTypes` |
| 14 | `POST` | `/kyc/captures` | `S` | `/kyc` | Upload a document side `front` \| `back` \| `photo_page` — `capture` |
| 15 | `DELETE` | `/kyc/captures/{side}` | `S` | `/kyc` | Retake a side |
| 16 | `POST` | `/kyc/selfie` | `S` | `/kyc` | Liveness selfie — `kycSelfie` |
| 17 | `POST` | `/kyc/submit` | `S` | `/kyc` | Submit for review → `status: 'pending'` — `kycNextStage` at `review` |

## 4. Reference data — 8

Replaces the hardcoded option lists currently inlined in `constants/` and the view models.

| # | Method | Path | Auth | Screen | Purpose |
|---:|---|---|---|---|---|
| 18 | `GET` | `/reference/categories` | — | `/`, `/buy`, `/sell` | 5 categories + sub-types — replaces `CATS` |
| 19 | `GET` | `/reference/minerals` | — | `/sell` | Mineral picker, including the `__other` branch |
| 20 | `GET` | `/reference/units` | — | `/sell`, `/trade/contract` | `g` `kg` `oz` `ct` `MT` |
| 21 | `GET` | `/reference/countries` | — | `/sell`, `/account/edit`, `/mining/register` | ISO country list |
| 22 | `GET` | `/reference/incoterms` | — | `/trade/contract` | `EXW` `FCA` `FOB` `CIF` `DAP` + descriptions |
| 23 | `GET` | `/reference/id-types` | — | `/kyc` | KYC document types and which sides each requires |
| 24 | `GET` | `/reference/banks` | — | `/trade/contract`, `/account/edit` | Issuing / advising banks, SWIFT codes |
| 25 | `GET` | `/reference/payout-networks` | — | `/account/edit` | `TRC-20` `ERC-20` `BEP-20` |

## 5. Catalog, lots & market data — 7

| # | Method | Path | Auth | Screen | Purpose |
|---:|---|---|---|---|---|
| 26 | `GET` | `/lots` | — | `/`, `/buy` | Paginated listing — `category`, `grade`, `sellerType`, `q`, `sort`, `page`, `perPage`. **Already written:** `catalogService.getLots` |
| 27 | `GET` | `/lots/{lotId}` | — | `/product` | Single lot, specs, description. **Already written:** `catalogService.getLot` |
| 28 | `GET` | `/lots/{lotId}/provenance` | — | `/product` | Custody events with on-chain hashes |
| 29 | `GET` | `/lots/{lotId}/documents` | — | `/product` | CoA, provenance, export permit |
| 30 | `GET` | `/lots/facets` | — | `/buy` | Filter-rail counts per category / grade / seller type |
| 31 | `GET` | `/market/rates` | — | `/` | Hero price ticker with deltas |
| 32 | `GET` | `/market/stats` | — | `/` | Hero stats: mineral types, countries served, escrow coverage |

## 6. Mineral passport — 2

| # | Method | Path | Auth | Screen | Purpose |
|---:|---|---|---|---|---|
| 33 | `GET` | `/passports/{passportId}` | — | `/` | Verify `MBP-2026-0419-AU` → lot, origin, assay, block anchor — `verify` |
| 34 | `GET` | `/passports/{passportId}/events` | — | `/` | Full custody event chain |

## 7. Orders (buy-side) — 9

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 35 | `POST` | `/orders/quote` | — | `/product` | Subtotal + 1% platform fee + total for a quantity |
| 36 | `POST` | `/orders` | `KYC` | `/product` | Place purchase request — `buyNow`; `paymentMethod: escrow` \| `wire` \| `lc` \| `btc` |
| 37 | `GET` | `/orders` | `S` | `/orders` | Order book — `side=buy\|sell`, `status=active\|completed` |
| 38 | `GET` | `/orders/{orderId}` | `S` | `/orders/detail` | Header, progress, status, rejection reason |
| 39 | `GET` | `/orders/{orderId}/timeline` | `S` | `/orders/detail` | 6-stage pipeline with timestamps |
| 40 | `GET` | `/orders/{orderId}/logistics` | `S` | `/orders/detail` | 4-leg route — buy-side and sell-side differ |
| 41 | `GET` | `/orders/{orderId}/documents` | `S` | `/orders/detail` | Stage-gated document list |
| 42 | `GET` | `/orders/{orderId}/documents/{documentId}/download` | `S` | `/orders/detail` | Signed download URL — `download` |
| 43 | `POST` | `/orders/{orderId}/cancel` | `S` | `/orders/detail` | Cancel before escrow funding |

## 8. Sell listings — 7

Four-step wizard: mineral details → location → review → submitted.

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 44 | `POST` | `/listings/quote` | — | `/sell` step 3 | Indicative gross / 2% fee / net |
| 45 | `POST` | `/listings` | `KYC` | `/sell` step 3 | Submit lot for on-site verification — `sellNext` |
| 46 | `PATCH` | `/listings/{listingId}` | `S` | `/sell` | Save the draft between steps |
| 47 | `GET` | `/listings` | `S` | `/orders` | Seller's own submissions |
| 48 | `GET` | `/listings/{listingId}` | `S` | `/orders/detail` | Submission + verification-visit status |
| 49 | `POST` | `/listings/{listingId}/photos` | `S` | `/sell` step 1 | Attach lot photographs |
| 50 | `DELETE` | `/listings/{listingId}/photos/{photoId}` | `S` | `/sell` step 1 | Remove a photograph |

## 9. Auctions & bidding — 8

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 51 | `GET` | `/auctions` | — | `/auctions` | `state=live\|upcoming\|ended` + the viewer's own bid |
| 52 | `GET` | `/auctions/{auctionId}` | — | `/auctions/detail` | Lot specs, increment, timer, settlement terms |
| 53 | `GET` | `/auctions/{auctionId}/bids` | — | `/auctions/detail` | Bid history, bidders pseudonymised |
| 54 | `POST` | `/auctions/{auctionId}/bids` | `KYC` | `/auctions/detail` | Place bid — `placeBid`; `409` when outbid or closed |
| 55 | `PUT` | `/auctions/{auctionId}/auto-bid` | `KYC` | `/auctions/detail` | Set proxy-bid ceiling — `setMaxBid` |
| 56 | `DELETE` | `/auctions/{auctionId}/auto-bid` | `KYC` | `/auctions/detail` | Cancel auto-bid |
| 57 | `POST` | `/auctions/{auctionId}/reminder` | `S` | `/auctions/detail` | Notify when the lot opens — `remindMe` |
| 58 | `DELETE` | `/auctions/{auctionId}/reminder` | `S` | `/auctions/detail` | Cancel the reminder |

## 10. ASM Academy — 8

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 59 | `GET` | `/academy/courses` | — | `/academy` | `track=asm\|platform` with per-course progress |
| 60 | `GET` | `/academy/courses/{courseId}` | — | `/academy/course` | Description, outcomes, certification flag |
| 61 | `GET` | `/academy/courses/{courseId}/lessons` | — | `/academy/course` | Lesson list, durations, done flags |
| 62 | `GET` | `/academy/lessons/{lessonId}/media` | `S` | `/academy/course` | Signed video URL + saved playback position |
| 63 | `POST` | `/academy/lessons/{lessonId}/progress` | `S` | `/academy/course` | Playback heartbeat — `togglePlay` |
| 64 | `POST` | `/academy/lessons/{lessonId}/complete` | `S` | `/academy/course` | Mark complete — `completeLesson` |
| 65 | `POST` | `/academy/courses/{courseId}/certificate` | `S` | `/academy/course` | Claim badge — `claimCert`; `409` if lessons incomplete |
| 66 | `GET` | `/academy/certificates` | `S` | `/account` | Earned badges shown on the seller profile |

## 11. ASM site registration — 8

Five-step flow: eligibility → site → GPS → documents → done.

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 67 | `GET` | `/asm/eligibility-criteria` | — | `/mining/register` | The four eligibility statements |
| 68 | `GET` | `/asm/registrations` | `S` | `/mining` | The caller's registrations |
| 69 | `POST` | `/asm/registrations` | `S` | `/mining/register` | Start a registration with eligibility answers |
| 70 | `GET` | `/asm/registrations/{registrationId}` | `S` | `/mining/register` | Resume an in-progress registration |
| 71 | `PATCH` | `/asm/registrations/{registrationId}` | `S` | `/mining/register` | Site name, country, region, minerals, worker count |
| 72 | `POST` | `/asm/registrations/{registrationId}/gps` | `S` | `/mining/register` | Capture coordinates + accuracy — `asmGpsToggle` |
| 73 | `POST` | `/asm/registrations/{registrationId}/documents` | `S` | `/mining/register` | Upload `id` \| `licence` \| `photos` — `upload` |
| 74 | `POST` | `/asm/registrations/{registrationId}/submit` | `S` | `/mining/register` | Queue for a field visit — `asmNext` at `docs` |

## 12. Account, documents, payouts, security — 11

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 75 | `GET` | `/account/profile` | `S` | `/account` | Name, email, mobile, company, country, role |
| 76 | `PATCH` | `/account/profile` | `S` | `/account/edit` | Save profile — `accSave`; `name` is locked to the KYC record |
| 77 | `POST` | `/account/avatar` | `S` | `/account/edit` | Profile photo — `accPhoto` |
| 78 | `GET` | `/account/documents` | `S` | `/account` | Compliance documents + per-document status |
| 79 | `POST` | `/account/documents` | `S` | `/account/edit` | Submit mining licence / tax certificate — `accDocPick` then `accSave` |
| 80 | `GET` | `/account/documents/{documentId}` | `S` | `/account` | Document detail + reviewer notes |
| 81 | `DELETE` | `/account/documents/{documentId}` | `S` | `/account` | Withdraw a pending submission |
| 82 | `GET` | `/account/payout-methods` | `S` | `/account` | Escrow wallet, bank, mobile money, crypto |
| 83 | `POST` | `/account/payout-methods` | `S` | `/account/edit` | Link a method — `accSave`; triggers a test deposit |
| 84 | `PATCH` | `/account/payout-methods/{methodId}` | `S` | `/account` | Set default — `accPayDefault` |
| 85 | `DELETE` | `/account/payout-methods/{methodId}` | `S` | `/account` | Unlink a method |

Security toggles (`twofa`, `bio`, `alerts`, `ledger`) ride on **76** `PATCH /account/profile` under a `security` object; password change and device sessions are endpoints **8**–**10**.

## 13. Negotiation room — 9

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 86 | `GET` | `/negotiations` | `S` | `/trade/negotiation` | Conversation list + derived status chip |
| 87 | `POST` | `/negotiations` | `KYC` | `/product` | Open a negotiation against a lot |
| 88 | `GET` | `/negotiations/{negotiationId}` | `S` | `/trade/negotiation` | Counterparty, lot, grade, agreed terms |
| 89 | `GET` | `/negotiations/{negotiationId}/messages` | `S` | `/trade/negotiation` | Merged `text` \| `offer` \| `system` thread |
| 90 | `POST` | `/negotiations/{negotiationId}/messages` | `S` | `/trade/negotiation` | Send free text — `send` |
| 91 | `POST` | `/negotiations/{negotiationId}/offers` | `KYC` | `/trade/negotiation` | Make a structured offer — `makeOffer` |
| 92 | `POST` | `/negotiations/{negotiationId}/offers/{offerId}/accept` | `KYC` | `/trade/negotiation` | Accept → locks terms, drafts the contract — `accept` |
| 93 | `POST` | `/negotiations/{negotiationId}/offers/{offerId}/counter` | `KYC` | `/trade/negotiation` | Counter an open offer — `counter` |
| 94 | `POST` | `/negotiations/{negotiationId}/offers/{offerId}/reject` | `S` | `/trade/negotiation` | Decline without countering |

## 14. Contract builder — 6

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 95 | `GET` | `/contracts` | `S` | `/trade/contract` | Contracts visible to the caller |
| 96 | `POST` | `/contracts` | `KYC` | `/trade/negotiation` | Draft from an accepted offer — `openContract` |
| 97 | `GET` | `/contracts/{contractId}` | `S` | `/trade/contract` | Terms, signature state, hash |
| 98 | `PATCH` | `/contracts/{contractId}` | `KYC` | `/trade/contract` | Edit terms while `draft`; `409` once signed |
| 99 | `POST` | `/contracts/{contractId}/sign` | `KYC` | `/trade/contract` | Sign → lock terms, anchor hash — `sign` |
| 100 | `GET` | `/contracts/{contractId}/document` | `S` | `/trade/contract` | Rendered PDF of the live preview |

## 15. Letters of credit — 10

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 101 | `GET` | `/lcs` | `S` | `/trade/letter-of-credit` | LCs visible to the caller |
| 102 | `POST` | `/lcs` | `KYC` | `/trade/contract` | Apply, from a signed contract |
| 103 | `GET` | `/lcs/{lcId}` | `S` | `/trade/letter-of-credit` | Status, parties, amount, dates, presentation period |
| 104 | `GET` | `/lcs/{lcId}/milestones` | `S` | `/trade/letter-of-credit` | The 8-step timeline state |
| 105 | `GET` | `/lcs/{lcId}/documents` | `S` | `/trade/letter-of-credit` | The 7 required documents + upload state |
| 106 | `POST` | `/lcs/{lcId}/documents` | `KYC` | `/trade/letter-of-credit` | Upload a required document — `toggle` |
| 107 | `DELETE` | `/lcs/{lcId}/documents/{documentKey}` | `KYC` | `/trade/letter-of-credit` | Remove a document; invalidates the pre-check |
| 108 | `POST` | `/lcs/{lcId}/precheck` | `S` | `/trade/letter-of-credit` | UCP 600 discrepancy scan — `precheck` |
| 109 | `POST` | `/lcs/{lcId}/presentation` | `KYC` | `/trade/letter-of-credit` | Present documents to the issuing bank — `present` |
| 110 | `POST` | `/lcs/{lcId}/amendments` | `KYC` | `/trade/bank` | Request an amendment — `Amend` |

## 16. Bank portal — 9

Bank-operator role. Driven from `/trade/bank`.

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 111 | `GET` | `/bank/lc-applications` | `BANK` | `/trade/bank` | The application book with status per LC |
| 112 | `GET` | `/bank/lc-applications/{lcId}` | `BANK` | `/trade/bank` | Credit terms for examination |
| 113 | `POST` | `/bank/lc-applications/{lcId}/issue` | `BANK` | `/trade/bank` | `Applied → Issued` — `Issue` |
| 114 | `POST` | `/bank/lc-applications/{lcId}/advise` | `BANK` | `/trade/bank` | `Issued → Advised` — `Advise` |
| 115 | `POST` | `/bank/lc-applications/{lcId}/confirm` | `BANK` | `/trade/bank` | `Advised → Confirmed` — `Confirm` |
| 116 | `POST` | `/bank/lc-applications/{lcId}/amend` | `BANK` | `/trade/bank` | Draft an amendment to the applicant — `Amend` |
| 117 | `GET` | `/bank/presentations/{lcId}` | `BANK` | `/trade/bank` | Presented documents + discrepancy summary |
| 118 | `POST` | `/bank/presentations/{lcId}/examination` | `BANK` | `/trade/bank` | Record `accepted` \| `refused` — `accept` / `refuse` |
| 119 | `POST` | `/bank/presentations/{lcId}/payment` | `BANK` | `/trade/bank` | Release payment — `release`; returns the settlement hash |

## 17. Shipment tracking — 4

| # | Method | Path | Auth | Screen | Purpose |
|---:|---|---|---|---|---|
| 120 | `GET` | `/shipments` | `S` | `/trade/shipment` | Shipments linked to the caller's trades |
| 121 | `GET` | `/shipments/{shipmentId}` | `S` | `/trade/shipment` | Vessel, B/L, container, seal, insured value, ETA |
| 122 | `GET` | `/shipments/{shipmentId}/events` | `S` | `/trade/shipment` | Custody events with hashes |
| 123 | `GET` | `/shipments/{shipmentId}/documents` | `S` | `/trade/shipment` | B/L, packing list, insurance certificate |

## 18. Notifications — 4

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 124 | `GET` | `/notifications` | `S` | global | Outbid alerts, KYC decisions, LC events, order stages |
| 125 | `POST` | `/notifications/{notificationId}/read` | `S` | global | Dismiss one — `dismissOutbid` |
| 126 | `POST` | `/notifications/read-all` | `S` | global | Dismiss all |
| 127 | `PATCH` | `/notifications/preferences` | `S` | `/account` | Channel preferences — email / SMS / push |

## 19. Support & help — 4

| # | Method | Path | Auth | Screen | Purpose / handler |
|---:|---|---|---|---|---|
| 128 | `POST` | `/support/chat-sessions` | `S` | `/account` | Open live chat — `Live chat` |
| 129 | `POST` | `/support/tickets` | `S` | `/account` | Email support ticket — `Email support` |
| 130 | `POST` | `/support/callbacks` | `S` | `/account` | Priority callback request — `Priority callback` |
| 131 | `GET` | `/content/faq` | — | `/account` | Help-centre articles — `FAQ` |

## 20. Static content — 3

| # | Method | Path | Auth | Screen | Purpose |
|---:|---|---|---|---|---|
| 132 | `GET` | `/content/how-it-works` | — | `/how-it-works` | 5 video chapters + 4 expandable topics |
| 133 | `GET` | `/content/mining-hub` | — | `/mining` | Modules, requirements, benefits |
| 134 | `GET` | `/content/pipelines` | — | `/` | Buy and sell pipeline stage definitions |

## 21. File uploads — 2

| # | Method | Path | Auth | Screen | Purpose |
|---:|---|---|---|---|---|
| 135 | `POST` | `/uploads` | `S` | all upload controls | Request a presigned direct-upload URL |
| 136 | `GET` | `/files/{fileId}` | `S` | all document views | Signed, time-limited read URL |

---

## 22. Realtime channels — 3

| # | Transport | Channel | Auth | Screen | Events |
|---:|---|---|---|---|---|
| R1 | WebSocket | `/ws/auctions/{auctionId}` | `S` | `/auctions/detail` | `bid.placed`, `auction.closing`, `auction.closed`, `bidder.outbid` |
| R2 | WebSocket | `/ws/negotiations/{negotiationId}` | `S` | `/trade/negotiation` | `message.created`, `offer.created`, `offer.accepted`, `offer.countered` |
| R3 | SSE | `/events/notifications` | `S` | global | `notification.created`, `kyc.decided`, `lc.status_changed`, `order.stage_changed` |

Per ARCHITECTURE.md §5.2, socket payloads are written into the TanStack Query cache with `setQueryData` from inside `lib/api/`; components stay unaware of the transport.

---

## 23. KYC-gated endpoints — 16

These are the only endpoints that may answer `403 kyc/not-approved`. They line up exactly with the `requireKyc` call sites plus the trade-desk writes.

| Endpoint | Gate origin in the frontend |
|---|---|
| `POST /orders` | `buyNow` — "complete a purchase" |
| `POST /listings` | `sellNext` step 3 — "submit a listing" |
| `POST /auctions/{id}/bids` | `placeBid` — "place a bid" |
| `PUT /auctions/{id}/auto-bid` | `setMaxBid` |
| `DELETE /auctions/{id}/auto-bid` | `setMaxBid` |
| `POST /negotiations` | lot → negotiation |
| `POST /negotiations/{id}/offers` | `makeOffer` |
| `POST .../offers/{id}/accept` | `accept` |
| `POST .../offers/{id}/counter` | `counter` |
| `POST /contracts` | `openContract` |
| `PATCH /contracts/{id}` | contract term edits |
| `POST /contracts/{id}/sign` | `sign` |
| `POST /lcs` | LC application |
| `POST /lcs/{id}/documents` | `toggle` upload |
| `DELETE /lcs/{id}/documents/{key}` | `toggle` removal |
| `POST /lcs/{id}/presentation` | `present` |

---

## 24. Build order

A sequence that keeps the frontend shippable at every step. ARCHITECTURE.md §5.3 is the migration rule: add the service, add the query hook, switch the view model, then demote the constants file to `tests/fixtures/`.

| Phase | Endpoints | Unblocks |
|---|---|---|
| **1 — Browse** | 18–34 | `/`, `/buy`, `/product` off `constants/catalog.ts` |
| **2 — Identity** | 1–17 | Real sessions; the `demo` session status retires |
| **3 — Transact** | 35–58 | `/orders`, `/orders/detail`, `/sell`, `/auctions` |
| **4 — Account** | 75–85, 124–131 | `/account`, `/account/edit` |
| **5 — Trade desk** | 86–123, R1–R2 | The five `/trade/*` screens |
| **6 — Growth** | 59–74, 132–136, R3 | `/academy`, `/mining`, `/mining/register` |

---

## 25. Coverage check — every screen reaches its endpoints

| Route | Screen | Endpoints |
|---|---|---|
| `/` | Home | 18, 26, 31, 32, 33, 34, 134 |
| `/buy` | Catalog | 18, 26, 30 |
| `/product` | Lot detail | 27, 28, 29, 35, 36, 87 |
| `/sell` | Sell wizard | 19, 20, 21, 44–50 |
| `/mining` | ASM hub | 68, 133 |
| `/mining/register` | ASM registration | 21, 67, 69–74, 135 |
| `/orders` | Order book | 37, 47 |
| `/orders/detail` | Order tracking | 38–43, 48 |
| `/account` | Account | 66, 75, 78, 80, 81, 82, 84, 85, 124, 127–131 |
| `/account/edit` | Account sheets | 8, 9, 10, 20, 21, 25, 76, 77, 79, 83, 135 |
| `/auth` | Sign in / up | 1, 2, 3, 4 |
| `/auctions` | Auction list | 51 |
| `/auctions/detail` | Auction detail | 52–58, R1 |
| `/academy` | Academy | 59 |
| `/academy/course` | Course | 60–65 |
| `/how-it-works` | Explainer | 132 |
| `/kyc` | Verification | 12–17, 23, 135 |
| `/trade/negotiation` | Negotiation Room | 86, 88–94, 96, R2 |
| `/trade/contract` | Contract Builder | 22, 24, 95, 97–100, 102 |
| `/trade/letter-of-credit` | LC Workspace | 101, 103–109 |
| `/trade/bank` | Bank Portal | 110–119 |
| `/trade/shipment` | Shipment Tracking | 120–123 |
| — | Shell (Header, KycBanner, modal) | 5, 6, 7, 11, 124–126, 136, R3 |

All 22 routes are covered, and every endpoint is consumed by at least one screen.
