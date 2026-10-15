/**
 * State slices.
 *
 * `AppState` is the union of every slice below (see `@/store/appState`). The
 * slices exist so each feature owns its own fields and so a component can
 * subscribe to one area without re-rendering on unrelated changes.
 *
 * The runtime state is still a single object, so `setState` keeps its
 * shallow-merge semantics and a patch may span slices atomically — which several
 * flows rely on (signing in sets session, KYC and navigation fields at once).
 *
 * Adding a field: put it in the slice that owns it, add it to that slice's
 * initial value and to its `*_KEYS` array. `tests/store/slices.test.ts` fails if
 * the three ever disagree.
 */
export * from './academySlice';
export * from './accountSlice';
export * from './asmSlice';
export * from './auctionsSlice';
export * from './catalogSlice';
export * from './howItWorksSlice';
export * from './kycSlice';
export * from './navigationSlice';
export * from './ordersSlice';
export * from './passportSlice';
export * from './productSlice';
export * from './sellSlice';
export * from './sessionSlice';
export * from './tradeSlice';
export * from './uiSlice';
