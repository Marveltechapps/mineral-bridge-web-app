import type { Order } from '@/types';

/** Order book transcribed verbatim from the source design. */
export const ORDERS: Order[] = [
  {
    id: 'MB-ORDER-33056',
    mineral: 'Gold Concentrate',
    side: 'BUY',
    qty: '745 g',
    date: '12 Jun 2026',
    stage: 'Pricing confirmation',
    progress: '33%',
    status: 'In review',
    sc: '#b45309',
    sbg: '#fdecd6',
    grad: 'url("https://commons.wikimedia.org/wiki/Special:FilePath/Gold-crystals.jpg?width=1200") center / contain no-repeat, #eef1f6',
  },
  {
    id: 'MB-SELL-41982',
    mineral: 'Silver Bullion',
    side: 'SELL',
    qty: '12 kg',
    date: '09 Jun 2026',
    progress: '66%',
    status: 'Active',
    sc: '#2563eb',
    sbg: '#dbeafe',
    grad: 'url("https://commons.wikimedia.org/wiki/Special:FilePath/Silver%20crystal.jpg?width=1200") center / contain no-repeat, #eef1f6',
  },
  {
    id: 'MB-ORDER-32890',
    mineral: 'Platinum Sponge',
    side: 'BUY',
    qty: '320 g',
    date: '01 Jun 2026',
    stage: 'Settlement',
    progress: '100%',
    status: 'Complete',
    sc: '#16a34a',
    sbg: '#dcf3e8',
    grad: 'url("https://commons.wikimedia.org/wiki/Special:FilePath/Platinum%20crystals.jpg?width=1200") center / contain no-repeat, #eef1f6',
  },
  {
    id: 'MB-ORDER-31544',
    mineral: 'Quartz Lot',
    side: 'BUY',
    qty: '2,000 MT',
    date: '18 May 2026',
    stage: 'Third-party verification',
    progress: '33%',
    status: 'Rejected',
    rejected: true,
    reason:
      'The seller’s export permit had lapsed at the time of verification, so the lot could not be assured. No payment was taken and your escrow hold has been released.',
    sc: '#dc2626',
    sbg: '#fdecec',
    grad: 'url("https://commons.wikimedia.org/wiki/Special:FilePath/Quartz%20Br%C3%A9sil.jpg?width=1200") center / contain no-repeat, #eef1f6',
  },
  {
    id: 'MB-SELL-41120',
    mineral: 'Emerald Lot',
    side: 'SELL',
    qty: '610 ct',
    date: '24 May 2026',
    progress: '83%',
    status: 'Active',
    sc: '#2563eb',
    sbg: '#dbeafe',
    grad: 'url("https://commons.wikimedia.org/wiki/Special:FilePath/Smaragd.jpg?width=1200") center / contain no-repeat, #eef1f6',
  },
];

/** An order is closed once it is rejected or fully settled. */
export const isClosed = (o: Order): boolean => !!o.rejected || o.status === 'Complete';
