import { isApiConfigured } from '@/lib/api/config';
import type { AccountForm, PayoutMethod } from '@/types';

/** Profile, documents, payout methods and security settings. */
export interface AccountSlice {
  accountTab: string;
  accEditKind: string;
  accForm: AccountForm;
  /** The last saved profile, or `null` while nothing has been saved. */
  accSaved: AccountForm | null;
  accDocName: string;
  accDocUploaded: boolean;
  accDocSubmitted: boolean;
  accPayType: string;
  accPayNetwork: string;
  accPayouts: PayoutMethod[];
  accToggles: Record<string, boolean>;
  accRevoked: Record<string, boolean>;
}

export const accountInitial: AccountSlice = {
  accountTab: 'profile',
  accEditKind: 'profile',
  accForm: {
    name: isApiConfigured() ? '' : 'Marvel Tech',
    email: isApiConfigured() ? '' : 'marvel@company.com',
    mobile: isApiConfigured() ? '' : '+27 82 445 1120',
    country: isApiConfigured() ? '' : 'South Africa',
    company: isApiConfigured() ? '' : 'Marvel Trading Co.',
    role: 'Buyer',
    docRef: '',
    docExp: '',
    payAccount: '',
    payBank: '',
    paySwift: '',
    payDefault: false,
    pw: '',
  },
  accSaved: null,
  accDocName: '',
  accDocUploaded: false,
  accDocSubmitted: false,
  accPayType: 'Bank transfer',
  accPayNetwork: 'TRC-20',
  accPayouts: [],
  accToggles: { twofa: true, bio: true, alerts: true, ledger: false },
  accRevoked: {},
};

export const ACCOUNT_KEYS = [
  'accountTab',
  'accEditKind',
  'accForm',
  'accSaved',
  'accDocName',
  'accDocUploaded',
  'accDocSubmitted',
  'accPayType',
  'accPayNetwork',
  'accPayouts',
  'accToggles',
  'accRevoked',
] as const satisfies readonly (keyof AccountSlice)[];
