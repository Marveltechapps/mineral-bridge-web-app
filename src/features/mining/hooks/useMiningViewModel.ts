import { useMemo } from 'react';
import type { IconName } from '@/types';

interface AsmModule {
  title: string;
  sub: string;
  bg: string;
  color: string;
  ic: IconName;
}

const MODULES: AsmModule[] = [
  {
    title: 'Site registration',
    sub: 'GPS-validated site and licence verification.',
    bg: '#dbeafe',
    color: '#2563eb',
    ic: 'chain',
  },
  {
    title: 'Safety & training',
    sub: 'Free ASM Academy modules and certification.',
    bg: '#dcf3e8',
    color: '#16a34a',
    ic: 'shield',
  },
  {
    title: 'Equipment access',
    sub: 'Request verified PPE and site equipment.',
    bg: '#fdecd6',
    color: '#b45309',
    ic: 'truck',
  },
  {
    title: 'Fair-trade proof',
    sub: 'Chain-of-custody and community records.',
    bg: '#eef1fb',
    color: '#1e2a5a',
    ic: 'flask',
  },
];

/** Static content for the artisanal & small-scale mining hub. */
export function useMiningViewModel() {
  return useMemo(
    () => ({
      asmModules: MODULES,
      asmReqs: [
        { v: 'Valid national ID (KYC verified)' },
        { v: 'Registered or cooperative mining site' },
        { v: 'GPS location within an eligible region' },
        { v: 'Completed Level 1 safety training' },
      ],
      asmBenefits: [
        { big: 'Free', label: 'Safety training & certification' },
        { big: '0%', label: 'Middleman markup on your lots' },
        { big: 'Direct', label: 'Support-arranged payment' },
      ],
    }),
    [],
  );
}
