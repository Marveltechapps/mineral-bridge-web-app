import { useMemo } from 'react';
import { useAuctionsState, useSessionState } from '@/hooks/useAppState';
import { useActions } from '@/hooks/useActions';
import { AUCS } from '@/constants/auctions';
import { FIELD } from '@/constants/tokens';
import { money } from '@/utils/format';
import type { AuctionState } from '@/types';

const aucChip = (on: boolean) =>
  'padding:9px 20px; border-radius:10px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:13px; font-weight:700; cursor:pointer;';

const bidLabelFor = (s: AuctionState) =>
  s === 'live' ? 'CURRENT BID' : s === 'upcoming' ? 'STARTING BID' : 'SOLD FOR';

const flagFor = (s: AuctionState) => {
  if (s === 'live')
    return {
      flag: '● LIVE',
      flagStyle:
        'position:absolute; top:12px; left:12px; background:#dc2626; color:#fff; font-size:10px; font-weight:800; letter-spacing:.6px; padding:5px 10px; border-radius:8px;',
    };
  if (s === 'upcoming')
    return {
      flag: 'UPCOMING',
      flagStyle:
        'position:absolute; top:12px; left:12px; background:rgba(255,255,255,.94); color:#b45309; font-size:10px; font-weight:800; letter-spacing:.6px; padding:5px 10px; border-radius:8px;',
    };
  return {
    flag: 'ENDED',
    flagStyle:
      'position:absolute; top:12px; left:12px; background:rgba(20,26,46,.8); color:#c9d0e0; font-size:10px; font-weight:800; letter-spacing:.6px; padding:5px 10px; border-radius:8px;',
  };
};

/** View model for the auction list and the auction detail screen. */
export function useAuctionsViewModel() {
  const { aucTab, aucId, bidValue, outbidDismissed, setState, go } = useAuctionsState();
  const { authed } = useSessionState();
  const h = useActions();

  return useMemo(() => {
    const aucList = AUCS.filter((a) => a.state === aucTab).map((a) => {
      const won = a.state === 'ended' && a.yourBidNum > 0 && a.yourBidNum >= a.bidNum;
      return {
        ...a,
        ...flagFor(a.state),
        bidLabel: bidLabelFor(a.state),
        bid: money(a.bidNum),
        yourBid: a.yourBidNum ? money(a.yourBidNum) : '',
        yourBidColor:
          a.state === 'ended'
            ? won
              ? '#16a34a'
              : '#dc2626'
            : a.yourBidNum >= a.bidNum
              ? '#16a34a'
              : '#b45309',
        cta: a.state === 'live' ? 'Place bid' : a.state === 'upcoming' ? 'View lot' : 'View result',
        ctaBg: a.state === 'live' ? '#1e2a5a' : '#eef1fb',
        ctaColor: a.state === 'live' ? '#fff' : '#1e2a5a',
        open: () => {
          setState({ aucId: a.id, bidValue: a.bidNum + 500 });
          go('auctionDetail');
        },
      };
    });

    const av = AUCS.find((a) => a.id === aucId) || AUCS[0];
    const avWon = av.state === 'ended' && av.yourBidNum > 0 && av.yourBidNum >= av.bidNum;

    const auc = {
      ...av,
      ...flagFor(av.state),
      bidLabel: bidLabelFor(av.state),
      bid: money(av.bidNum),
      canBid: av.state === 'live',
      isUpcoming: av.state === 'upcoming',
      isEnded: av.state === 'ended',
      stateLabel:
        av.state === 'live' ? 'OPEN' : av.state === 'upcoming' ? 'SCHEDULED' : 'CLOSED',
      stateChip:
        'font-size:10.5px; font-weight:800; letter-spacing:.6px; padding:5px 11px; border-radius:8px; ' +
        (av.state === 'live'
          ? 'background:#fdecec; color:#dc2626;'
          : av.state === 'upcoming'
            ? 'background:#fdecd6; color:#b45309;'
            : 'background:#eef1f8; color:#6b7290;'),
      timerBg: av.state === 'live' ? '#fdecec' : '#f4f5f9',
      timerColor: av.state === 'live' ? '#dc2626' : '#6b7290',
      endedHeadline: avWon
        ? 'You won this lot'
        : av.yourBidNum > 0
          ? 'You were outbid on this lot'
          : 'This auction has closed',
      endedSub: avWon
        ? 'Settlement is underway — track it in My Orders.'
        : av.yourBidNum > 0
          ? 'Your final bid of ' + money(av.yourBidNum) + ' did not win. Similar lots are released weekly.'
          : 'Sold for ' + money(av.bidNum) + '.',
      specs: [
        { k: 'Lot quantity', v: av.qty },
        { k: 'Assay grade', v: av.grade },
        { k: 'Origin', v: av.origin },
        { k: 'Minimum increment', v: av.increment },
        { k: 'Settlement', v: 'Escrow · 48h after close' },
      ],
      bids: [
        {
          who: 'Bidder #4471',
          initials: 'B4',
          time: '12 min ago',
          amount: money(av.bidNum),
          amountColor: '#141a2e',
          avBg: '#eef1fb',
          avColor: '#1e2a5a',
        },
        {
          who: 'You',
          initials: 'MT',
          time: '26 min ago',
          amount: av.yourBidNum ? money(av.yourBidNum) : '—',
          amountColor: '#2563eb',
          avBg: '#dbeafe',
          avColor: '#2563eb',
        },
        {
          who: 'Bidder #2210',
          initials: 'B2',
          time: '1 hr ago',
          amount: money(av.bidNum - 1200),
          amountColor: '#8b95b4',
          avBg: '#eef1fb',
          avColor: '#1e2a5a',
        },
        {
          who: 'Opening bid',
          initials: 'MB',
          time: 'Auction start',
          amount: money(av.bidNum - 8400),
          amountColor: '#8b95b4',
          avBg: '#f4f5f9',
          avColor: '#8b95b4',
        },
      ],
    };

    const outbidLot = AUCS.find(
      (a) => a.state === 'live' && a.yourBidNum > 0 && a.yourBidNum < a.bidNum,
    );

    return {
      lbl: FIELD.lbl,
      aucTabs: (
        [
          { k: 'live', label: 'Live' },
          { k: 'upcoming', label: 'Upcoming' },
          { k: 'ended', label: 'Ended' },
        ] as const
      ).map((t) => ({
        k: t.k,
        label: t.label,
        style: aucChip(aucTab === t.k),
        select: () => setState({ aucTab: t.k }),
      })),
      aucList,
      auc,
      bidValue: String(bidValue || 0),
      aucOutbid: !!outbidLot && !outbidDismissed,
      aucOutbidLot: outbidLot ? outbidLot.name : '',
      aucOutbidAmount: outbidLot ? money(outbidLot.bidNum) : '',
      dismissOutbid: () => setState({ outbidDismissed: true }),
      bidDec: () => setState((s) => ({ bidValue: Math.max(0, (s.bidValue || 0) - 500) })),
      bidInc: () => setState((s) => ({ bidValue: (s.bidValue || 0) + 500 })),
      setBid: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ bidValue: parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10) || 0 }),
      placeBid: () => {
        if (!authed) {
          setState({
            modal: {
              title: 'Sign in to bid',
              body: 'Bidding requires a verified account.',
              confirmLabel: 'Sign in',
              confirm: () =>
                setState({
                  modal: null,
                  authOpen: true,
                  authMode: 'login',
                  authStage: 'form',
                  pendingResume: 'auctionDetail',
                }),
            },
          });
          return;
        }
        h.requireKyc(
          'place a bid',
          () =>
            setState({
              modal: {
                title: 'Bid placed',
                body: 'Your bid has been recorded. We will alert you if you are outbid before the lot closes.',
                confirmLabel: 'Done',
                confirm: () => setState({ modal: null }),
              },
            }),
          'auctionDetail',
        );
      },
      setMaxBid: () =>
        setState({
          modal: {
            title: 'Auto-bid limit',
            body: 'We will bid on your behalf in minimum increments up to your limit, and stop there.',
            confirmLabel: 'Got it',
            confirm: () => setState({ modal: null }),
          },
        }),
      remindMe: () =>
        setState({
          modal: {
            title: 'Reminder set',
            body: 'We will notify you when this lot opens for bidding.',
            confirmLabel: 'Done',
            confirm: () => setState({ modal: null }),
          },
        }),
    };
  }, [
    aucTab,
    aucId,
    bidValue,
    outbidDismissed,
    authed,
    setState,
    go,
    h,
  ]);
}
