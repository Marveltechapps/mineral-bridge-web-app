import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { CHIP } from '@/constants/tokens';
import { chipStyle, money } from '@/utils/format';
import { BASE_MESSAGES, CONVS, stepDot, tradeBtn } from '@/features/trade/constants';
import type { NegotiationMessage, NegotiationOffer } from '@/types';

const isOffer = (m: NegotiationMessage): m is NegotiationOffer => m.k === 'offer';

const statusChip = (s: string) =>
  (({ Agreed: CHIP.GREEN, 'Offer received': CHIP.AMBER, 'Awaiting reply': CHIP.BLUE }) as Record<
    string,
    readonly [string, string]
  >)[s] || CHIP.GREY;

/** View model for the negotiation room: conversations, offers and the summary rail. */
export function useNegotiationViewModel() {
  const { state, setState, go } = useAppState();

  return useMemo(() => {
    const all = (id: string): NegotiationMessage[] =>
      (BASE_MESSAGES[id] || []).concat(state.negExtra[id] || []);

    const cid = state.negId;
    const conv = CONVS.find((c) => c.id === cid) || CONVS[0];
    const raw = all(cid);
    const accId = state.negAccepted[cid];

    const isOpen = (m: NegotiationMessage): boolean =>
      isOffer(m) && !!m.open && !m.closed && !state.negCountered[m.id] && !accId;

    const statusOf = (id: string): string => {
      if (state.negAccepted[id]) return 'Agreed';
      const lo = [...all(id)].reverse().find(isOffer);
      return lo && lo.who === 'me' ? 'Awaiting reply' : 'Offer received';
    };

    const push = (item: NegotiationMessage) =>
      setState((s) => ({
        negExtra: { ...s.negExtra, [cid]: [...(s.negExtra[cid] || []), item] },
      }));

    const counter = (m: NegotiationOffer) => {
      const step = m.price > 100 ? 10 : m.price > 10 ? 5 : 0.05;
      setState((s) => ({
        negCountered: { ...s.negCountered, [m.id]: true },
        negExtra: {
          ...s.negExtra,
          [cid]: [
            ...(s.negExtra[cid] || []),
            {
              k: 'offer' as const,
              who: 'me' as const,
              id: 'x' + Date.now(),
              price: Math.round((m.price - step) * 100) / 100,
              unit: m.unit,
              qty: m.qty,
              inc: m.inc,
              win: m.win,
              from: m.from,
              to: m.to,
              time: 'Now',
              open: true,
            },
          ],
        },
      }));
    };

    const msgs = raw.map((m, idx) => {
      const mine = 'who' in m && m.who === 'me';
      const wrap =
        'display:flex; justify-content:' +
        (m.k === 'system' ? 'center' : mine ? 'flex-end' : 'flex-start') +
        ';';

      if (m.k === 'system') {
        return { key: 'sys' + idx, wrap, isSystem: true, isText: false, isOffer: false, text: m.text };
      }
      if (m.k === 'text') {
        return {
          key: 'txt' + idx,
          wrap,
          isSystem: false,
          isText: true,
          isOffer: false,
          text: m.text,
          time: m.time,
          timeColor: mine ? 'rgba(255,255,255,.7)' : '#8b95b4',
          bubble:
            'max-width:72%; padding:12px 16px; border-radius:16px; font-size:14px; line-height:1.55; ' +
            (mine
              ? 'background:#1e2a5a; color:#fff;'
              : 'background:#fff; color:#141a2e; border:1px solid #e7eaf3;'),
        };
      }

      const acc = m.id === accId;
      const open = isOpen(m);
      const label = acc
        ? 'Accepted'
        : open
          ? mine
            ? 'Awaiting reply'
            : 'Open'
          : m.closed || (state.negCountered[m.id] ? 'Countered' : 'Closed');
      const c = acc ? CHIP.GREEN : open ? (mine ? CHIP.BLUE : CHIP.AMBER) : CHIP.GREY;

      return {
        key: m.id,
        wrap,
        isSystem: false,
        isText: false,
        isOffer: true,
        from: mine ? 'YOUR OFFER' : 'OFFER FROM ' + conv.party.toUpperCase(),
        price: money(m.price) + ' / ' + m.unit,
        qty: m.qty.toLocaleString('en-US') + ' ' + m.unit,
        inc: m.inc,
        win: m.win,
        total: money(m.price * m.qty),
        time: m.time,
        statusLabel: label.toUpperCase(),
        statusStyle: chipStyle(c[0], c[1]),
        canAct: open && !mine,
        cardStyle:
          'width:100%; max-width:430px; background:#fff; border:1.5px solid ' +
          (acc ? '#16a34a' : '#e7eaf3') +
          '; border-radius:16px; overflow:hidden; box-shadow:0 3px 10px rgba(20,26,46,.05);',
        accept: () =>
          setState((s) => ({
            negAccepted: { ...s.negAccepted, [cid]: m.id },
            negExtra: {
              ...s.negExtra,
              [cid]: [
                ...(s.negExtra[cid] || []),
                {
                  k: 'system' as const,
                  text: 'Offer accepted — terms locked. A draft contract is ready.',
                },
              ],
            },
          })),
        counter: () => counter(m),
      };
    });

    const theirOpen = [...raw].reverse().find((m) => isOpen(m) && 'who' in m && m.who !== 'me') as
      | NegotiationOffer
      | undefined;
    const agreed = raw.find((m) => isOffer(m) && m.id === accId) as NegotiationOffer | undefined;
    const terms = agreed || ([...raw].reverse().find(isOffer) as NegotiationOffer | undefined);

    const signedThis = state.ctSigned && state.ctFor === cid;
    const stp: [string, boolean][] = [
      ['Terms agreed', !!agreed],
      ['Contract drafted', !!agreed],
      ['Contract signed', signedThis],
      ['LC opened', signedThis && state.lcStatus !== 'Applied'],
    ];
    const firstOpen = stp.findIndex((x) => !x[1]);

    return {
      conv,
      draft: state.negDraft,
      msgs,
      convs: CONVS.map((c) => {
        const on = c.id === cid;
        const s = statusOf(c.id);
        const cc = statusChip(s);
        return {
          ...c,
          status: s,
          chip: chipStyle(cc[0], cc[1]) + ' margin-top:7px;',
          select: () => setState({ negId: c.id, negDraft: '' }),
          style:
            'display:flex; align-items:flex-start; gap:12px; width:100%; padding:15px 18px; border:none; border-bottom:1px solid #f2f4fa; cursor:pointer; text-align:left; background:' +
            (on ? '#f4f6fc' : '#fff') +
            '; box-shadow:' +
            (on ? 'inset 3px 0 0 #c8962f' : 'none') +
            ';',
        };
      }),
      onDraft: (e: React.ChangeEvent<HTMLInputElement>) => setState({ negDraft: e.target.value }),
      send: () => {
        const t = (state.negDraft || '').trim();
        if (!t) return;
        setState({ negDraft: '' });
        push({ k: 'text', who: 'me', text: t, time: 'Now' });
      },
      offerBlocked: !theirOpen,
      makeOffer: () => {
        if (theirOpen) counter(theirOpen);
      },
      offerStyle:
        'height:46px; padding:0 16px; border-radius:12px; font-size:13.5px; font-weight:800; white-space:nowrap; border:1px solid ' +
        (theirOpen ? '#d5dbef' : '#eef1f8') +
        '; background:' +
        (theirOpen ? '#fff' : '#f4f5f9') +
        '; color:' +
        (theirOpen ? '#1e2a5a' : '#5b638a') +
        '; cursor:' +
        (theirOpen ? 'pointer' : 'not-allowed') +
        ';',
      sum: {
        party: conv.party,
        lot: conv.lot,
        notAgreed: !agreed,
        statusLabel: agreed ? 'TERMS AGREED' : 'IN NEGOTIATION',
        statusStyle: agreed
          ? chipStyle(CHIP.GREEN[0], CHIP.GREEN[1])
          : chipStyle(CHIP.AMBER[0], CHIP.AMBER[1]),
        rows: terms
          ? [
              { k: 'Price', v: money(terms.price) + ' / ' + terms.unit },
              { k: 'Quantity', v: terms.qty.toLocaleString('en-US') + ' ' + terms.unit },
              { k: 'Incoterm', v: terms.inc },
              { k: 'Shipment window', v: terms.win },
              { k: 'Settlement', v: 'Letter of Credit' },
            ]
          : [],
        total: terms ? money(terms.price * terms.qty) : '—',
        steps: stp.map((x, i) => {
          const s = x[1] ? 'done' : i === firstOpen ? 'cur' : 'todo';
          return { label: x[0], dot: stepDot(s), color: s === 'todo' ? '#8b95b4' : '#141a2e' };
        }),
        ctaLabel: !agreed
          ? 'Accept an offer to continue'
          : signedThis
            ? 'View signed contract'
            : 'Open Contract Builder',
        ctaStyle: tradeBtn(!!agreed) + ' width:100%; margin-top:18px;',
        hint: agreed
          ? 'The contract is prefilled from the accepted offer.'
          : 'Accept the counterparty’s offer to lock terms and draft the contract.',
        openContract: () => {
          if (!agreed) return;
          if (state.ctFor !== cid) {
            const p = agreed.inc.split(' ');
            setState((s) => ({
              ctFor: cid,
              ctSigned: false,
              ct: {
                ...s.ct,
                seller: conv.party,
                lot: conv.lot,
                incoterm: p[0],
                port: p.slice(1).join(' '),
                price: String(agreed.price),
                qty: String(agreed.qty),
                unit: agreed.unit,
                from: agreed.from,
                to: agreed.to,
              },
            }));
          }
          go('contract');
        },
      },
    };
  }, [
    state.negId,
    state.negExtra,
    state.negDraft,
    state.negAccepted,
    state.negCountered,
    state.ctSigned,
    state.ctFor,
    state.lcStatus,
    setState,
    go,
  ]);
}
