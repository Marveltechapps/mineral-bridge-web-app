import type { AsmForm, AsmStep } from '@/types';

/** Artisanal and small-scale mining registration. */
export interface AsmSlice {
  asmStep: AsmStep;
  /** Eligibility answers, by question index. */
  asmElig: Record<number, boolean>;
  asmMin: Record<string, boolean>;
  asmDocs: Record<string, boolean>;
  asmGps: boolean;
  asmCoords: string;
  asmGpsError: string;
  asmForm: AsmForm;
}

export const asmInitial: AsmSlice = {
  asmStep: 'elig',
  asmElig: {},
  asmMin: {},
  asmDocs: {},
  asmGps: false,
  asmCoords: '',
  asmGpsError: '',
  asmForm: { site: '', country: '', region: '', workers: 12 },
};

export const ASM_KEYS = [
  'asmStep',
  'asmElig',
  'asmMin',
  'asmDocs',
  'asmGps',
  'asmCoords',
  'asmGpsError',
  'asmForm',
] as const satisfies readonly (keyof AsmSlice)[];
