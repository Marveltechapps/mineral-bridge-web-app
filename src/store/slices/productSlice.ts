/** The lot currently being viewed, the quantity being bought and how it is paid for. */
export interface ProductSlice {
  activeId: string;
  qty: number;
  payMethod: string;
}

export const productInitial: ProductSlice = {
  activeId: 'gold',
  qty: 10,
  payMethod: 'escrow',
};

export const PRODUCT_KEYS = [
  'activeId',
  'qty',
  'payMethod',
] as const satisfies readonly (keyof ProductSlice)[];
