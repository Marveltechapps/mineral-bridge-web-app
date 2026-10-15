import type { KycStage, KycStatus, RouteKey } from '@/types';

/**
 * Identity verification. `kycStatus` is the gate every trading action consults;
 * `kycReturn` is the screen to come back to once verification is dealt with.
 */
export interface KycSlice {
  kycStage: KycStage;
  kycIdType: string;
  kycShots: Record<string, boolean>;
  kycSelfie: boolean;
  kycStatus: KycStatus;
  /** `false`, or the route to return to once verification is dealt with. */
  kycReturn: RouteKey | boolean;
}

export const kycInitial: KycSlice = {
  kycStage: 'why',
  kycIdType: 'national',
  kycShots: {},
  kycSelfie: false,
  kycStatus: 'unverified',
  kycReturn: false,
};

export const KYC_KEYS = [
  'kycStage',
  'kycIdType',
  'kycShots',
  'kycSelfie',
  'kycStatus',
  'kycReturn',
] as const satisfies readonly (keyof KycSlice)[];
