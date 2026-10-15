/** The mineral passport lookup panel. */
export interface PassportSlice {
  passportQ: string;
  passportShown: boolean;
}

export const passportInitial: PassportSlice = {
  passportQ: '',
  passportShown: false,
};

export const PASSPORT_KEYS = [
  'passportQ',
  'passportShown',
] as const satisfies readonly (keyof PassportSlice)[];
