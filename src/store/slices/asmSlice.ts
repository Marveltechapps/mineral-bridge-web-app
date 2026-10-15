import type { AsmForm, AsmStep } from '@/types';

/** Artisanal and small-scale mining registration. */
export interface AsmSlice {
  asmStep: AsmStep;
  /** Eligibility answers, by question index. */
  asmElig: Record<number, boolean>;
  asmMin: Record<string, boolean>;
  asmDocs: Record<string, boolean>;
  asmGps: boolean;
  asmForm: AsmForm;
}

export const asmInitial: AsmSlice = {
  asmStep: 'elig',
  asmElig: {},
  asmMin: {},
  asmDocs: {},
  asmGps: false,
  asmForm: { site: '', country: '', region: '', workers: 12 },
};

export const ASM_KEYS = [
  'asmStep',
  'asmElig',
  'asmMin',
  'asmDocs',
  'asmGps',
  'asmForm',
] as const satisfies readonly (keyof AsmSlice)[];
