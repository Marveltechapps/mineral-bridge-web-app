import { useMemo } from 'react';
import { usePassportState } from '@/hooks/useAppState';
import { PRODUCTS } from '@/constants/catalog';
import type { Product } from '@/types';

/** Per-mineral passport code fragments, as the design defines them. */
const CODES: Record<string, [string, string]> = {
  gold: ['0419', 'AU'],
  silver: ['0422', 'AG'],
  platinum: ['0430', 'PT'],
  diamond: ['0388', 'DI'],
  emerald: ['0391', 'EM'],
  copper: ['0402', 'CU'],
  lithium: ['0371', 'LI'],
  quartz: ['0365', 'QZ'],
};

export const passportId = (p: Product): string => {
  const c = CODES[p.id] || ['0400', 'MN'];
  return `MBP-2026-${c[0]}-${c[1]}`;
};

/** Mineral Passport lookup shown on the home screen. */
export function usePassportViewModel() {
  const { passportQ, passportShown, setState } = usePassportState();

  return useMemo(() => {
    const q = (passportQ || '').trim().toUpperCase();
    const hit = PRODUCTS.find((p) => passportId(p) === q);

    return {
      q: passportQ,
      id: q,
      idle: !passportShown,
      found: passportShown && !!hit,
      notFound: passportShown && !hit,
      onQ: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ passportQ: e.target.value, passportShown: false }),
      verify: () => setState({ passportShown: true }),
      tryDemo: () => setState({ passportQ: 'MBP-2026-0419-AU', passportShown: true }),
      proves: [
        { v: 'Where the mineral was extracted' },
        { v: 'Independent assay of purity and weight' },
        { v: 'Every custody handover, sealed and signed' },
        { v: 'That the record has not been altered' },
      ],
      rows: hit
        ? [
            { k: 'Lot', v: hit.name },
            { k: 'Origin', v: hit.region },
            { k: 'Assay', v: hit.grade },
            { k: 'Custody events', v: '4 recorded' },
            { k: 'Minted', v: '01 Oct 2026' },
            { k: 'Anchored in', v: 'Block #19,402,118' },
          ]
        : [],
    };
  }, [passportQ, passportShown, setState]);
}
