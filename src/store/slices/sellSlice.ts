import type { SellForm } from '@/types';

/** The multi-step "list a lot for sale" wizard. */
export interface SellSlice {
  sellStep: number;
  sellForm: SellForm;
}

export const sellInitial: SellSlice = {
  sellStep: 1,
  sellForm: {
    mineral: '',
    customMineral: '',
    category: 'Precious Metals',
    qty: '',
    unit: 'g',
    form: 'Raw',
    slot: 'Flexible',
    payout: 'Bank transfer',
    city: '',
    country: '',
    photos: [],
  },
};

export const SELL_KEYS = ['sellStep', 'sellForm'] as const satisfies readonly (keyof SellSlice)[];
