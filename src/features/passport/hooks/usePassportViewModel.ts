import { useMemo, useState } from 'react';
import { usePassportState } from '@/hooks/useAppState';
import { isApiConfigured } from '@/lib/api/config';
import { http } from '@/lib/api/client';
import { ApiError } from '@/lib/api/ApiError';
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
  const api = isApiConfigured();
  const [remote, setRemote] = useState<{ name: string; origin: string; grade: string } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  return useMemo(() => {
    const q = (passportQ || '').trim().toUpperCase();
    const hit = api ? null : PRODUCTS.find((p) => passportId(p) === q);
    const foundRemote = api && passportShown && remote && !lookupError;

    return {
      q: passportQ,
      id: q,
      idle: !passportShown,
      found: api ? Boolean(foundRemote) : passportShown && !!hit,
      notFound: api ? passportShown && !foundRemote && q.length > 0 : passportShown && !hit,
      lookupError,
      onQ: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ passportQ: e.target.value, passportShown: false }),
      verify: () => {
        setState({ passportShown: true });
        if (!api) return;
        setRemote(null);
        setLookupError(null);
        const id = (passportQ || '').trim();
        if (!id) return;
        void http
          .get<{ mineral?: string; origin?: string; purity?: string | null }>(`/passports/${encodeURIComponent(id)}`)
          .then((record) => setRemote({ name: record.mineral || '', origin: record.origin || '', grade: record.purity || '' }))
          .catch((error: unknown) => {
            setRemote(null);
            setLookupError(error instanceof ApiError && error.status === 404 ? null : error instanceof Error ? error.message : 'Lookup failed');
          });
      },
      showDemo: !api,
      tryDemo: () => setState({ passportQ: 'MBP-2026-0419-AU', passportShown: true }),
      proves: [
        { v: 'Where the mineral was extracted' },
        { v: 'Independent assay of purity and weight' },
        { v: 'Every custody handover, sealed and signed' },
        { v: 'That the record has not been altered' },
      ],
      rows: foundRemote && remote
        ? [
            { k: 'Lot', v: remote.name },
            { k: 'Origin', v: remote.origin },
            { k: 'Assay', v: remote.grade || '—' },
          ]
        : hit
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
  }, [passportQ, passportShown, setState, api, remote, lookupError]);
}
