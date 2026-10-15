import type {
  AccountForm,
  AsmForm,
  AsmStep,
  AuctionState,
  AuthMethod,
  AuthMode,
  AuthStage,
  ContractTerms,
  KycStage,
  KycStatus,
  ModalSpec,
  NegotiationMessage,
  PayoutMethod,
  RouteKey,
  SellForm,
  SortKey,
} from '@/types';

/**
 * The application state, mirroring the `state` object of the source design's
 * `Component extends DCLogic` class field-for-field.
 */
export interface AppState {
  authed: boolean;
  route: RouteKey;
  query: string;
  homeFilter: string;
  gradeF: string;
  sellerF: string;
  sort: SortKey;
  activeId: string;
  qty: number;
  authStage: AuthStage;
  authMethod: AuthMethod;
  pendingResume: RouteKey | null;
  authOpen: boolean;
  authMode: AuthMode;
  authRole: string;
  authVerifying: boolean;
  sellStep: number;
  sellForm: SellForm;
  orderFilter: string;
  orderTab: 'active' | 'completed';
  accountTab: string;
  showFilters: boolean;
  trackId: string;
  aucTab: AuctionState;
  aucId: string;
  bidValue: number;
  outbidDismissed: boolean;
  acTrack: 'asm' | 'platform';
  courseId: string;
  lessonIdx: number;
  lessonDone: Record<string, number>;
  playing: boolean;
  accToggles: Record<string, boolean>;
  hiwChapter: number;
  hiwPlaying: boolean;
  hiwTopic: string | null;
  hiwOverlay: boolean;
  kycStage: KycStage;
  kycIdType: string;
  kycShots: Record<string, boolean>;
  kycSelfie: boolean;
  kycStatus: KycStatus;
  /** `false`, or the route to return to once verification is dealt with. */
  kycReturn: RouteKey | boolean;
  accEditKind: string;
  accDocName: string;
  accDocUploaded: boolean;
  accPayType: string;
  accPayNetwork: string;
  accRevoked: Record<string, boolean>;
  negId: string;
  negExtra: Record<string, NegotiationMessage[]>;
  negDraft: string;
  negAccepted: Record<string, string>;
  negCountered: Record<string, boolean>;
  ct: ContractTerms;
  ctSigned: boolean;
  ctFor: string | null;
  lcStatus: string;
  bankStatus: Record<string, string>;
  lcDocs: Record<string, boolean>;
  lcBLDate: 'ontime' | 'late';
  lcCheck: boolean;
  lcPresented: boolean;
  lcExam: 'accepted' | 'refused' | null;
  lcPaid: boolean;
  bankTab: 'apps' | 'exam';
  passportQ: string;
  passportShown: boolean;
  payMethod: string;
  accSaved: AccountForm | null;
  accDocSubmitted: boolean;
  accPayouts: PayoutMethod[];
  accForm: AccountForm;
  asmStep: AsmStep;
  asmElig: Record<number, boolean>;
  asmMin: Record<string, boolean>;
  asmDocs: Record<string, boolean>;
  asmGps: boolean;
  asmForm: AsmForm;
  modal: ModalSpec | null;
}

/** Session-storage key recording that the "How it works" intro has been seen. */
export const HIW_SEEN_KEY = 'mb_hiw_seen';

const hiwSeen = (): boolean => {
  try {
    return sessionStorage.getItem(HIW_SEEN_KEY) !== '1';
  } catch {
    return true;
  }
};

export const markHiwSeen = (): void => {
  try {
    sessionStorage.setItem(HIW_SEEN_KEY, '1');
  } catch {
    /* storage unavailable — the overlay simply reappears next session */
  }
};

export const initialState: AppState = {
  authed: false,
  route: 'home',
  query: '',
  homeFilter: 'all',
  gradeF: '',
  sellerF: '',
  sort: 'featured',
  activeId: 'gold',
  qty: 10,
  authStage: 'form',
  authMethod: 'mobile',
  pendingResume: null,
  authOpen: false,
  authMode: 'login',
  authRole: 'Buyer',
  authVerifying: false,
  sellStep: 1,
  sellForm: {
    mineral: '',
    customMineral: '',
    category: 'Precious Metals',
    qty: '',
    unit: 'g',
    form: 'Raw',
    slot: 'Flexible',
    payout: 'Bank transfer',
    city: '',
    country: '',
  },
  orderFilter: 'all',
  orderTab: 'active',
  accountTab: 'profile',
  showFilters: true,
  trackId: 'MB-ORDER-33056',
  aucTab: 'live',
  aucId: 'a1',
  bidValue: 185000,
  outbidDismissed: false,
  acTrack: 'asm',
  courseId: 'c1',
  lessonIdx: 0,
  lessonDone: {},
  playing: false,
  accToggles: { twofa: true, bio: true, alerts: true, ledger: false },
  hiwChapter: 0,
  hiwPlaying: false,
  hiwTopic: 'sell',
  hiwOverlay: hiwSeen(),
  kycStage: 'why',
  kycIdType: 'national',
  kycShots: {},
  kycSelfie: false,
  kycStatus: 'unverified',
  kycReturn: false,
  accEditKind: 'profile',
  accDocName: '',
  accDocUploaded: false,
  accPayType: 'Bank transfer',
  accPayNetwork: 'TRC-20',
  accRevoked: {},
  negId: 'c1',
  negExtra: {},
  negDraft: '',
  negAccepted: { c3: 'o9' },
  negCountered: {},
  ct: {
    seller: 'Ashanti Refining Co.',
    lot: 'Gold Concentrate · 2.4 kg',
    incoterm: 'CIF',
    port: 'Durban',
    price: '2360',
    qty: '77',
    unit: 'oz',
    from: '2026-10-01',
    to: '2026-10-15',
    lcType: 'Irrevocable',
    tenor: 'At sight',
    bank: 'Standard Bank of South Africa',
    presentation: '21',
  },
  ctSigned: false,
  ctFor: null,
  lcStatus: 'Advised',
  bankStatus: {},
  lcDocs: { invoice: true, bl: true, packing: true, origin: true },
  lcBLDate: 'ontime',
  lcCheck: false,
  lcPresented: false,
  lcExam: null,
  lcPaid: false,
  bankTab: 'apps',
  passportQ: '',
  passportShown: false,
  payMethod: 'escrow',
  accSaved: null,
  accDocSubmitted: false,
  accPayouts: [],
  accForm: {
    name: 'Marvel Tech',
    email: 'marvel@company.com',
    mobile: '+27 82 445 1120',
    country: 'South Africa',
    company: 'Marvel Trading Co.',
    role: 'Buyer',
    docRef: '',
    docExp: '',
    payAccount: '',
    payBank: '',
    paySwift: '',
    payDefault: false,
    pw: '',
  },
  asmStep: 'elig',
  asmElig: {},
  asmMin: {},
  asmDocs: {},
  asmGps: false,
  asmForm: { site: '', country: '', region: '', workers: 12 },
  modal: null,
};
