import { http } from '@/lib/api/client';
import type { Paginated } from '@/lib/api/types';
import type { Auction, AuctionState } from '@/types';

interface Money {
  amount: number;
  currency: string;
}

interface WebAuction {
  id: string;
  name: string;
  state: AuctionState;
  quantity: { value: number; unit: string };
  grade: string;
  origin: string;
  currentBid: Money;
  minimumIncrement: Money;
  opensAt: string;
  closesAt: string;
  imageUrl?: string | null;
  viewer?: { highestBid: Money | null; outbid?: boolean } | null;
}

function major(money: Money | null | undefined): number {
  return money ? money.amount / 100 : 0;
}

export function webAuctionToAuction(auction: WebAuction): Auction {
  const image = auction.imageUrl ? `url("${auction.imageUrl}") center / contain no-repeat, #eef1f6` : '';
  const closes = new Date(auction.closesAt);
  const timeLabel = Number.isNaN(closes.getTime()) ? '' : closes.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  return {
    id: auction.id,
    name: auction.name,
    state: auction.state,
    qty: `${auction.quantity.value} ${auction.quantity.unit}`,
    grade: auction.grade,
    origin: auction.origin,
    bidNum: major(auction.currentBid),
    yourBidNum: major(auction.viewer?.highestBid),
    unit: auction.quantity.unit,
    increment: `$${major(auction.minimumIncrement).toLocaleString('en-US')}`,
    timeLabel,
    grad: image || 'linear-gradient(140deg,#1e2a5a,#141a2e)',
  };
}

export async function listAuctions(signal?: AbortSignal): Promise<Auction[]> {
  const page = await http.get<Paginated<WebAuction>>('/auctions', {
    query: { state: ['live', 'upcoming', 'ended'], perPage: 100 },
    signal,
  });
  return page.items.map(webAuctionToAuction);
}

export function placeBid(auctionId: string, amountMinor: number) {
  return http.post(`/auctions/${encodeURIComponent(auctionId)}/bids`, {
    amount: { amount: amountMinor, currency: 'USD' },
  }, { headers: { 'Idempotency-Key': crypto.randomUUID() } });
}
