import type { Conversation, NegotiationMessage } from '@/types';

/** Counterparties in the negotiation room. */
export const CONVS: Conversation[] = [
  {
    id: 'c1',
    party: 'Ashanti Refining Co.',
    initials: 'AR',
    lot: 'Gold Concentrate · 2.4 kg',
    grade: '91.6% Au',
  },
  {
    id: 'c2',
    party: 'Katanga Minerals',
    initials: 'KM',
    lot: 'Copper Cathode · 40 MT',
    grade: 'Grade A',
  },
  {
    id: 'c3',
    party: 'Kagem Mining Coop',
    initials: 'KC',
    lot: 'Emerald Lot · 610 ct',
    grade: 'Vivid',
  },
];

/** Seeded message history per conversation. */
export const BASE_MESSAGES: Record<string, NegotiationMessage[]> = {
  c1: [
    {
      k: 'text',
      who: 'them',
      text: 'Good morning — we can supply 2.4 kg of Gold Concentrate, assayed at 91.6%.',
      time: '09:12',
    },
    {
      k: 'offer',
      who: 'them',
      id: 'o1',
      price: 2380,
      unit: 'oz',
      qty: 77,
      inc: 'FOB Tema',
      win: '01–15 Oct 2026',
      from: '2026-10-01',
      to: '2026-10-15',
      time: '09:14',
      closed: 'Countered',
    },
    {
      k: 'text',
      who: 'me',
      text: 'We need CIF Durban, and a sharper rate at this volume.',
      time: '09:31',
    },
    {
      k: 'offer',
      who: 'me',
      id: 'o2',
      price: 2340,
      unit: 'oz',
      qty: 77,
      inc: 'CIF Durban',
      win: '01–15 Oct 2026',
      from: '2026-10-01',
      to: '2026-10-15',
      time: '09:33',
      closed: 'Countered',
    },
    {
      k: 'offer',
      who: 'them',
      id: 'o3',
      price: 2360,
      unit: 'oz',
      qty: 77,
      inc: 'CIF Durban',
      win: '01–15 Oct 2026',
      from: '2026-10-01',
      to: '2026-10-15',
      time: '10:02',
      open: true,
    },
  ],
  c2: [
    {
      k: 'offer',
      who: 'them',
      id: 'o5',
      price: 9.15,
      unit: 'kg',
      qty: 40000,
      inc: 'FCA Kolwezi',
      win: '20 Oct – 05 Nov 2026',
      from: '2026-10-20',
      to: '2026-11-05',
      time: 'Yesterday',
      open: true,
    },
    { k: 'text', who: 'me', text: 'Reviewing internally — we will revert today.', time: '08:05' },
  ],
  c3: [
    {
      k: 'text',
      who: 'them',
      text: 'Parcel is graded and sealed. Happy to proceed at the agreed rate.',
      time: 'Mon',
    },
    {
      k: 'offer',
      who: 'them',
      id: 'o9',
      price: 742,
      unit: 'ct',
      qty: 610,
      inc: 'CIF Dubai',
      win: '10–25 Oct 2026',
      from: '2026-10-10',
      to: '2026-10-25',
      time: 'Mon',
      open: true,
    },
    { k: 'system', text: 'Offer accepted — terms locked.' },
  ],
};

/** Letter-of-credit document set: [key, name, requirement]. */
export const LC_DOCS: [string, string, string][] = [
  ['invoice', 'Commercial invoice', 'Signed, matching the LC amount and goods description'],
  ['bl', 'Bill of lading', 'Full set, clean on-board, to order of the issuing bank'],
  ['packing', 'Packing list', 'Gross and net weight per sealed unit'],
  ['origin', 'Certificate of origin', 'Issued by the chamber of commerce'],
  ['assay', 'Assay certificate', 'Independent lab — purity and weight'],
  ['insurance', 'Insurance certificate', '110% of invoice value'],
  ['inspection', 'Inspection certificate', 'Pre-shipment, sealed by a Mineral Bridge agent'],
];

/** Shipment custody events: [title, who, where, time, hash]. */
export const SHIP_EVENTS: [string, string, string, string, string][] = [
  ['Sealed at mine site', 'MB agent · J. Mensah', 'Obuasi, Ghana', '01 Oct 2026 · 08:40', '0x41c2…9a07'],
  ['Assay lab custody', 'SGS Accra', 'Accra, Ghana', '02 Oct 2026 · 15:10', '0x8e19…c3d4'],
  ['Loaded on vessel', 'MSC Aurora · Voy 226W', 'Port of Tema', '06 Oct 2026 · 21:05', '0xb37a…11fe'],
  ['In transit', 'MSC Aurora', 'Gulf of Guinea', 'Updated 10 Oct 2026 · 06:00', ''],
  ['Discharged at destination', 'Transnet Port Terminals', 'Port of Durban', 'ETA 17 Oct 2026', ''],
  ['Delivered to buyer vault', 'Marvel Trading Co.', 'Johannesburg, ZA', 'Pending', ''],
];

/** Letter-of-credit lifecycle, in order. */
export const LC_STATUS_ORDER = ['Applied', 'Issued', 'Advised', 'Confirmed'];

/** Milestone labels across the LC workspace timeline. */
export const LC_MILESTONES = [
  'Application',
  'Issued',
  'Advised',
  'Confirmed',
  'Goods shipped',
  'Docs presented',
  'Examined',
  'Payment',
];

/** Shared control styles used across the five trade-desk screens. */
export const tradePill = (on: boolean, locked = false) =>
  'padding:10px 16px; border-radius:11px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:13px; font-weight:700; cursor:' +
  (locked ? 'default' : 'pointer') +
  ';';

export const tradeBtn = (on: boolean, bg?: string) =>
  'height:50px; padding:0 22px; border:none; border-radius:13px; font-size:14.5px; font-weight:800; background:' +
  (on ? bg || '#1e2a5a' : '#eef1f8') +
  '; color:' +
  (on ? '#fff' : '#5b638a') +
  '; cursor:' +
  (on ? 'pointer' : 'not-allowed') +
  ';';

/** Small status dot used in the contract-progress checklist. */
export const stepDot = (s: 'done' | 'cur' | 'todo') =>
  'width:12px; height:12px; border-radius:6px; flex-shrink:0; background:' +
  (s === 'done' ? '#16a34a' : s === 'cur' ? '#2563eb' : '#dde2f0') +
  ';';
