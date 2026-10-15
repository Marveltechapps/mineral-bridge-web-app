import {
  academyInitial,
  accountInitial,
  asmInitial,
  auctionsInitial,
  catalogInitial,
  howItWorksInitial,
  kycInitial,
  navigationInitial,
  ordersInitial,
  passportInitial,
  productInitial,
  sellInitial,
  sessionInitial,
  tradeInitial,
  uiInitial,
  type AcademySlice,
  type AccountSlice,
  type AsmSlice,
  type AuctionsSlice,
  type CatalogSlice,
  type HowItWorksSlice,
  type KycSlice,
  type NavigationSlice,
  type OrdersSlice,
  type PassportSlice,
  type ProductSlice,
  type SellSlice,
  type SessionSlice,
  type TradeSlice,
  type UiSlice,
} from './slices';

/**
 * The application state: the union of every slice in `./slices`.
 *
 * This mirrors the `state` object of the source design's `Component extends
 * DCLogic` class field-for-field, and is still one flat object at runtime — so
 * `setState` shallow-merges and a single patch may span slices. The slices give
 * each feature ownership of its fields and let components subscribe narrowly
 * (see `@/hooks/useAppState`).
 */
export interface AppState
  extends AcademySlice,
    AccountSlice,
    AsmSlice,
    AuctionsSlice,
    CatalogSlice,
    HowItWorksSlice,
    KycSlice,
    NavigationSlice,
    OrdersSlice,
    PassportSlice,
    ProductSlice,
    SellSlice,
    SessionSlice,
    TradeSlice,
    UiSlice {}

export const initialState: AppState = {
  ...academyInitial,
  ...accountInitial,
  ...asmInitial,
  ...auctionsInitial,
  ...catalogInitial,
  ...howItWorksInitial,
  ...kycInitial,
  ...navigationInitial,
  ...ordersInitial,
  ...passportInitial,
  ...productInitial,
  ...sellInitial,
  ...sessionInitial,
  ...tradeInitial,
  ...uiInitial,
};

export { HIW_SEEN_KEY, markHiwSeen } from './slices/howItWorksSlice';
