import { createContext, type ReactNode } from 'react';
import type { AppState } from '@/store/appState';
import { useSliceOf } from '@/store/useSliceOf';
import {
  ACADEMY_KEYS,
  ACCOUNT_KEYS,
  ASM_KEYS,
  AUCTIONS_KEYS,
  CATALOG_KEYS,
  HOW_IT_WORKS_KEYS,
  KYC_KEYS,
  NAVIGATION_KEYS,
  ORDERS_KEYS,
  PASSPORT_KEYS,
  PRODUCT_KEYS,
  SELL_KEYS,
  SESSION_KEYS,
  TRADE_KEYS,
  UI_KEYS,
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
} from '@/store/slices';

/**
 * One context per slice.
 *
 * `AppStateProvider` owns the single state object and passes it here;
 * `SliceProviders` splits it so a consumer of, say, the catalog slice does not
 * re-render when a letter-of-credit field changes. The slice hooks in
 * `@/hooks/useAppState` are the public way to read these.
 */
export const AcademyContext = createContext<AcademySlice | null>(null);
export const AccountContext = createContext<AccountSlice | null>(null);
export const AsmContext = createContext<AsmSlice | null>(null);
export const AuctionsContext = createContext<AuctionsSlice | null>(null);
export const CatalogContext = createContext<CatalogSlice | null>(null);
export const HowItWorksContext = createContext<HowItWorksSlice | null>(null);
export const KycContext = createContext<KycSlice | null>(null);
export const NavigationContext = createContext<NavigationSlice | null>(null);
export const OrdersContext = createContext<OrdersSlice | null>(null);
export const PassportContext = createContext<PassportSlice | null>(null);
export const ProductContext = createContext<ProductSlice | null>(null);
export const SellContext = createContext<SellSlice | null>(null);
export const SessionContext = createContext<SessionSlice | null>(null);
export const TradeContext = createContext<TradeSlice | null>(null);
export const UiContext = createContext<UiSlice | null>(null);

/** Fan one state object out into the fifteen slice contexts. */
export function SliceProviders({ state, children }: { state: AppState; children: ReactNode }) {
  const academy = useSliceOf(state, ACADEMY_KEYS);
  const account = useSliceOf(state, ACCOUNT_KEYS);
  const asm = useSliceOf(state, ASM_KEYS);
  const auctions = useSliceOf(state, AUCTIONS_KEYS);
  const catalog = useSliceOf(state, CATALOG_KEYS);
  const howItWorks = useSliceOf(state, HOW_IT_WORKS_KEYS);
  const kyc = useSliceOf(state, KYC_KEYS);
  const navigation = useSliceOf(state, NAVIGATION_KEYS);
  const orders = useSliceOf(state, ORDERS_KEYS);
  const passport = useSliceOf(state, PASSPORT_KEYS);
  const product = useSliceOf(state, PRODUCT_KEYS);
  const sell = useSliceOf(state, SELL_KEYS);
  const session = useSliceOf(state, SESSION_KEYS);
  const trade = useSliceOf(state, TRADE_KEYS);
  const ui = useSliceOf(state, UI_KEYS);

  return (
    <SessionContext.Provider value={session}>
      <NavigationContext.Provider value={navigation}>
        <UiContext.Provider value={ui}>
          <KycContext.Provider value={kyc}>
            <CatalogContext.Provider value={catalog}>
              <ProductContext.Provider value={product}>
                <SellContext.Provider value={sell}>
                  <OrdersContext.Provider value={orders}>
                    <AuctionsContext.Provider value={auctions}>
                      <AcademyContext.Provider value={academy}>
                        <HowItWorksContext.Provider value={howItWorks}>
                          <AccountContext.Provider value={account}>
                            <AsmContext.Provider value={asm}>
                              <TradeContext.Provider value={trade}>
                                <PassportContext.Provider value={passport}>
                                  {children}
                                </PassportContext.Provider>
                              </TradeContext.Provider>
                            </AsmContext.Provider>
                          </AccountContext.Provider>
                        </HowItWorksContext.Provider>
                      </AcademyContext.Provider>
                    </AuctionsContext.Provider>
                  </OrdersContext.Provider>
                </SellContext.Provider>
              </ProductContext.Provider>
            </CatalogContext.Provider>
          </KycContext.Provider>
        </UiContext.Provider>
      </NavigationContext.Provider>
    </SessionContext.Provider>
  );
}
