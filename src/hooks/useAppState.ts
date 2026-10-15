import { useContext, type Context } from 'react';
import {
  AppActionsContext,
  AppStateContext,
  type AppActionsContextValue,
  type AppStateContextValue,
} from '@/context/AppStateContext';
import {
  AcademyContext,
  AccountContext,
  AsmContext,
  AuctionsContext,
  CatalogContext,
  HowItWorksContext,
  KycContext,
  NavigationContext,
  OrdersContext,
  PassportContext,
  ProductContext,
  SellContext,
  SessionContext,
  TradeContext,
  UiContext,
} from '@/context/sliceContexts';
import type {
  AcademySlice,
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
  UiSlice,
} from '@/store/slices';

/**
 * Access the whole application state, its updater and the navigation helper.
 *
 * This subscribes to **every** field, so it re-renders on any state change.
 * Prefer a slice hook below — `useCatalogState()`, `useTradeState()` and so on —
 * and reach for this only where a component genuinely spans most of the state.
 */
export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside an AppStateProvider');
  return ctx;
}

/**
 * The updater and the navigation helper on their own, with no state
 * subscription — for components that only dispatch and never read.
 */
export function useAppActions(): AppActionsContextValue {
  const ctx = useContext(AppActionsContext);
  if (!ctx) throw new Error('useAppActions must be used inside an AppStateProvider');
  return ctx;
}

/**
 * Read one slice plus the writers. A component re-renders only when a field of
 * that slice changes; `setState` still patches any field, across slices, so
 * flows that update several areas at once keep working unchanged.
 */
function useSlice<T>(context: Context<T | null>, name: string): T & AppActionsContextValue {
  const slice = useContext(context);
  const { setState, go } = useAppActions();
  if (!slice) throw new Error(`${name} must be used inside an AppStateProvider`);
  return { ...slice, setState, go };
}

export const useSessionState = (): SessionSlice & AppActionsContextValue =>
  useSlice(SessionContext, 'useSessionState');

export const useNavigationState = (): NavigationSlice & AppActionsContextValue =>
  useSlice(NavigationContext, 'useNavigationState');

export const useUiState = (): UiSlice & AppActionsContextValue =>
  useSlice(UiContext, 'useUiState');

export const useKycState = (): KycSlice & AppActionsContextValue =>
  useSlice(KycContext, 'useKycState');

export const useCatalogState = (): CatalogSlice & AppActionsContextValue =>
  useSlice(CatalogContext, 'useCatalogState');

export const useProductState = (): ProductSlice & AppActionsContextValue =>
  useSlice(ProductContext, 'useProductState');

export const useSellState = (): SellSlice & AppActionsContextValue =>
  useSlice(SellContext, 'useSellState');

export const useOrdersState = (): OrdersSlice & AppActionsContextValue =>
  useSlice(OrdersContext, 'useOrdersState');

export const useAuctionsState = (): AuctionsSlice & AppActionsContextValue =>
  useSlice(AuctionsContext, 'useAuctionsState');

export const useAcademyState = (): AcademySlice & AppActionsContextValue =>
  useSlice(AcademyContext, 'useAcademyState');

export const useHowItWorksState = (): HowItWorksSlice & AppActionsContextValue =>
  useSlice(HowItWorksContext, 'useHowItWorksState');

export const useAccountState = (): AccountSlice & AppActionsContextValue =>
  useSlice(AccountContext, 'useAccountState');

export const useAsmState = (): AsmSlice & AppActionsContextValue =>
  useSlice(AsmContext, 'useAsmState');

export const useTradeState = (): TradeSlice & AppActionsContextValue =>
  useSlice(TradeContext, 'useTradeState');

export const usePassportState = (): PassportSlice & AppActionsContextValue =>
  useSlice(PassportContext, 'usePassportState');
