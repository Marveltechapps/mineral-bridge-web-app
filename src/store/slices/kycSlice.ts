import type { KycStage, KycStatus, RouteKey } from '@/types';

/** A local preview of one document side. */
export interface KycShotPreview {
  url: string;
  /** True once the server has accepted this photo. */
  ready: boolean;
  /** True only while the upload request is in flight. */
  uploading?: boolean;
}

/**
 * `true` means the server already stored this side and there is no local preview yet.
 * A preview object is the photo the user just captured or chose.
 */
export type KycShot = boolean | KycShotPreview;

/**
 * Identity verification. `kycStatus` is the gate every trading action consults;
 * `kycReturn` is the screen to come back to once verification is dealt with.
 */
export interface KycSlice {
  kycStage: KycStage;
  kycIdType: string;
  kycShots: Record<string, KycShot>;
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
