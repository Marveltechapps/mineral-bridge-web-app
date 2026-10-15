import type { AuctionState } from '@/types';

/** Auction browsing and the viewer's current bid. */
export interface AuctionsSlice {
  aucTab: AuctionState;
  aucId: string;
  bidValue: number;
  outbidDismissed: boolean;
}

export const auctionsInitial: AuctionsSlice = {
  aucTab: 'live',
  aucId: 'a1',
  bidValue: 185000,
  outbidDismissed: false,
};

export const AUCTIONS_KEYS = [
  'aucTab',
  'aucId',
  'bidValue',
  'outbidDismissed',
] as const satisfies readonly (keyof AuctionsSlice)[];
