import { isApiConfigured } from '@/lib/api/config';
import type { ContractTerms, NegotiationMessage } from '@/types';

/**
 * The trade desk: negotiation, contract, letter of credit, bank examination and
 * shipment.
 *
 * These five screens are deliberately one slice rather than five. They are a
 * single sequential process — signing a contract moves the LC status, presenting
 * documents moves the bank status — so the fields genuinely co-change, and the
 * user walks the steps one at a time. Splitting them would leave most view
 * models subscribing to two or three sub-slices for no reduction in renders.
 */
export interface TradeSlice {
  /** Negotiation */
  negId: string;
  negExtra: Record<string, NegotiationMessage[]>;
  negDraft: string;
  negAccepted: Record<string, string>;
  negCountered: Record<string, boolean>;

  /** Contract */
  ct: ContractTerms;
  ctSigned: boolean;
  /** The conversation the signed contract belongs to. */
  ctFor: string | null;

  /** Letter of credit */
  lcStatus: string;
  lcDocs: Record<string, boolean>;
  lcBLDate: 'ontime' | 'late';
  lcCheck: boolean;
  lcPresented: boolean;
  lcExam: 'accepted' | 'refused' | null;
  lcPaid: boolean;

  /** Bank */
  bankStatus: Record<string, string>;
  bankTab: 'apps' | 'exam';
}

const demoContract: ContractTerms = {
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
};

/** Blank desk used when a real API is configured, so sample trades are not shown. */
const blankContract: ContractTerms = {
  seller: '',
  lot: '',
  incoterm: 'CIF',
  port: '',
  price: '',
  qty: '',
  unit: 'MT',
  from: '',
  to: '',
  lcType: 'Irrevocable',
  tenor: 'At sight',
  bank: '',
  presentation: '21',
};

const liveApi = isApiConfigured();

export const tradeInitial: TradeSlice = {
  negId: liveApi ? '' : 'c1',
  negExtra: {},
  negDraft: '',
  negAccepted: liveApi ? {} : { c3: 'o9' },
  negCountered: {},
  ct: liveApi ? blankContract : demoContract,
  ctSigned: false,
  ctFor: null,
  lcStatus: liveApi ? 'Applied' : 'Advised',
  lcDocs: liveApi ? {} : { invoice: true, bl: true, packing: true, origin: true },
  lcBLDate: 'ontime',
  lcCheck: false,
  lcPresented: false,
  lcExam: null,
  lcPaid: false,
  bankStatus: {},
  bankTab: 'apps',
};

export const TRADE_KEYS = [
  'negId',
  'negExtra',
  'negDraft',
  'negAccepted',
  'negCountered',
  'ct',
  'ctSigned',
  'ctFor',
  'lcStatus',
  'lcDocs',
  'lcBLDate',
  'lcCheck',
  'lcPresented',
  'lcExam',
  'lcPaid',
  'bankStatus',
  'bankTab',
] as const satisfies readonly (keyof TradeSlice)[];
