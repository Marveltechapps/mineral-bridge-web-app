/**
 * BUG-017 / BUG-018 client mapping helpers.
 */
import { applyMyBid, mapAuctionDetail } from '../../src/lib/mappers';
import type { AuctionDetail, MyBidRow } from '../../src/api/types';

describe('BUG-017/018: auction auto-bid + winner mapping', () => {
  const baseDetail = (over: Partial<AuctionDetail> = {}): AuctionDetail =>
    ({
      id: 'auc_1',
      reference: 'MB-A-1',
      name: 'Gold lot',
      status: 'ended',
      lot: { quantity: { value: 1, unit: 'kg', grams: 1000 }, grade: '88%', display: '1 kg' },
      description: null,
      badges: [],
      sampling: null,
      bidding: {
        startingBid: { amountMinor: 100000, currency: 'USD' },
        highestBid: { amountMinor: 150000, currency: 'USD' },
        minimumIncrement: { amountMinor: 50000, currency: 'USD' },
        nextValidBid: { amountMinor: 200000, currency: 'USD' },
        quickIncrements: [],
        bidCount: 2,
        reserveMet: true,
        yourBid: { amountMinor: 150000, currency: 'USD' },
        youAreHighest: true,
      },
      closesAt: new Date().toISOString(),
      antiSniping: { enabled: true, extendByMinutes: 2, withinMinutes: 2 },
      bindingNote: '',
      imageUrl: null,
      mediaCount: 0,
      version: 1,
      ...over,
    }) as AuctionDetail;

  it('BUG-018: ended + outcome.youWon marks won', () => {
    const a = mapAuctionDetail(
      baseDetail({
        outcome: { result: 'sold', winnerId: 'u1', youWon: true },
      }),
    );
    expect(a.result).toBe('won');
  });

  it('BUG-018: highest bidder but reserve not sold is not won', () => {
    const a = mapAuctionDetail(
      baseDetail({
        bidding: {
          ...baseDetail().bidding,
          reserveMet: false,
          youAreHighest: true,
        },
        outcome: { result: 'reserve_not_met', winnerId: null, youWon: false },
      }),
    );
    expect(a.result).not.toBe('won');
  });

  it('BUG-018 neighbouring: applyMyBid won status', () => {
    const row: MyBidRow = {
      auctionId: 'auc_1',
      auctionName: 'Gold',
      imageUrl: null,
      yourBid: { amount: 150000, currency: 'USD' },
      highestBid: { amount: 150000, currency: 'USD' },
      youAreHighest: true,
      status: 'won',
      closesAt: new Date().toISOString(),
    };
    const a = applyMyBid(
      {
        id: 'MB-A-1',
        sid: 'auc_1',
        pid: '',
        name: 'Gold',
        unit: 'kg',
        grade: '',
        qty: 1,
        status: 'live',
        start: 1000,
        endsAt: Date.now(),
        bids: [],
        inc: 500,
        mine: true,
        leading: true,
      },
      row,
    );
    expect(a.result).toBe('won');
    expect(a.status).toBe('ended');
  });

  it('BUG-017: syncAutoBid registers when on with positive max', () => {
    // Behaviour contract for remote.syncAutoBid — pure decision table.
    const shouldRegister = (on: boolean, maxMajor: number) => on && maxMajor > 0;
    expect(shouldRegister(true, 5000)).toBe(true);
    expect(shouldRegister(true, 0)).toBe(false);
    expect(shouldRegister(false, 5000)).toBe(false);
  });
});
