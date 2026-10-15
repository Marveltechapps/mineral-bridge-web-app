import { describe, expect, it } from 'vitest';
import { initialState, type AppState } from '@/store/appState';
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
} from '@/store/slices';

/**
 * These guard the one way the slice split can rot: a field added to a slice's
 * interface and initial value but not to its `*_KEYS` array. The key arrays are
 * what the slice contexts subscribe on, so a missing key means a field that
 * silently never triggers a re-render.
 */
const slices = [
  { name: 'academy', keys: ACADEMY_KEYS, initial: academyInitial },
  { name: 'account', keys: ACCOUNT_KEYS, initial: accountInitial },
  { name: 'asm', keys: ASM_KEYS, initial: asmInitial },
  { name: 'auctions', keys: AUCTIONS_KEYS, initial: auctionsInitial },
  { name: 'catalog', keys: CATALOG_KEYS, initial: catalogInitial },
  { name: 'howItWorks', keys: HOW_IT_WORKS_KEYS, initial: howItWorksInitial },
  { name: 'kyc', keys: KYC_KEYS, initial: kycInitial },
  { name: 'navigation', keys: NAVIGATION_KEYS, initial: navigationInitial },
  { name: 'orders', keys: ORDERS_KEYS, initial: ordersInitial },
  { name: 'passport', keys: PASSPORT_KEYS, initial: passportInitial },
  { name: 'product', keys: PRODUCT_KEYS, initial: productInitial },
  { name: 'sell', keys: SELL_KEYS, initial: sellInitial },
  { name: 'session', keys: SESSION_KEYS, initial: sessionInitial },
  { name: 'trade', keys: TRADE_KEYS, initial: tradeInitial },
  { name: 'ui', keys: UI_KEYS, initial: uiInitial },
] as const satisfies readonly {
  name: string;
  keys: readonly (keyof AppState)[];
  initial: object;
}[];

describe('state slices', () => {
  it.each(slices.map((s) => [s.name, s] as const))(
    '%s: its key array matches its initial value exactly',
    (_name, slice) => {
      expect([...slice.keys].sort()).toEqual(Object.keys(slice.initial).sort());
    },
  );

  it('together cover every field of AppState, with none left over', () => {
    const fromSlices = slices.flatMap((s) => [...s.keys]).sort();
    expect(fromSlices).toEqual(Object.keys(initialState).sort());
  });

  it('assign every field to exactly one slice', () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const slice of slices) {
      for (const key of slice.keys) {
        const owner = seen.get(key);
        if (owner) duplicates.push(`${key} (in ${owner} and ${slice.name})`);
        else seen.set(key, slice.name);
      }
    }
    expect(duplicates).toEqual([]);
  });

  it('compose initialState from the slice initial values', () => {
    for (const slice of slices) {
      for (const [key, value] of Object.entries(slice.initial)) {
        // `route` and `hiwOverlay` are environment-dependent at construction.
        if (key === 'route' || key === 'hiwOverlay') continue;
        expect(initialState[key as keyof AppState]).toEqual(value);
      }
    }
  });
});
