import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { useActions } from '@/hooks/useActions';
import { PRODUCTS } from '@/constants/catalog';
import { passportId } from '@/features/passport/hooks/usePassportViewModel';
import { money, num } from '@/utils/format';

/** Settlement options offered on the purchase panel. */
const PAYS: [string, string, string, string][] = [
  ['escrow', 'Escrow (USDC)', 'Smart-contract escrow, released on custody transfer', ''],
  ['wire', 'Bank wire (SWIFT)', 'Paid into escrow by bank transfer', ''],
  ['lc', 'Letter of Credit', 'Bank-backed — agree terms in Contract Builder', ''],
  ['btc', 'Bitcoin (BTC)', 'Supported countries only', 'OPTIONAL'],
];

/** View model for the lot detail screen: specs, provenance and the buy panel. */
export function useProductViewModel() {
  const { state, setState, go } = useAppState();
  const h = useActions();

  return useMemo(() => {
    const ap = PRODUCTS.find((p) => p.id === state.activeId) || PRODUCTS[0];

    const active = {
      ...ap,
      sellerInitials: ap.seller
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      specs: [
        { k: 'Mineral form', v: ap.name },
        { k: 'Assay grade', v: ap.grade },
        { k: 'Origin', v: ap.region },
        { k: 'Available quantity', v: ap.stock },
        { k: 'Test method', v: 'Fire assay + XRF' },
        { k: 'Documentation', v: 'CoA, provenance, export permit' },
      ],
      desc: `${ap.name} sourced from ${ap.region}. Every lot is inspected on site by a Mineral Bridge agent, sampled, and independently lab-assayed before listing. Chain-of-custody documents and export permits are attached to the order and settlement is escrow-backed.`,
    };

    const qtyN = state.qty || 0;
    const sub = num(ap.price) * qtyN;
    const fee = sub * 0.01;

    const provEvents: [string, string, string, string][] = [
      ['Extracted and registered', `${ap.region} · GPS-verified site`, '01 Oct 2026', '0x2f81…a913'],
      [
        'Sealed by agent',
        'Mineral Bridge agent · seal MB-SEAL-00941',
        '01 Oct 2026',
        '0x41c2…9a07',
      ],
      ['Lab assayed', `Fire assay + XRF · ${ap.grade}`, '02 Oct 2026', '0x8e19…c3d4'],
      ['Vaulted and listed', 'Mineral Bridge vault · Johannesburg', '04 Oct 2026', '0xc7d0…5e22'],
    ];

    const prov = {
      passport: ap.id ? passportId(ap) : '',
      events: provEvents.map((e, i) => ({
        title: e[0],
        sub: e[1],
        time: e[2],
        hash: e[3],
        hasLine: i < provEvents.length - 1,
      })),
    };

    const settle = {
      isBtc: state.payMethod === 'btc',
      isLc: state.payMethod === 'lc',
      openLc: () => go('contract'),
      opts: PAYS.map(([k, t, s, tag]) => {
        const on = state.payMethod === k;
        return {
          k,
          t,
          s,
          tag,
          select: () => setState({ payMethod: k }),
          radio:
            'width:18px; height:18px; border-radius:9px; flex-shrink:0; border:' +
            (on ? '5px solid #1e2a5a' : '2px solid #cdd4e6') +
            '; background:#fff;',
          style:
            'display:flex; align-items:center; gap:11px; width:100%; padding:11px 13px; border-radius:12px; cursor:pointer; border:1.5px solid ' +
            (on ? '#1e2a5a' : '#e7eaf3') +
            '; background:' +
            (on ? '#f7f9ff' : '#fff') +
            ';',
        };
      }),
    };

    return {
      active,
      prov,
      settle,
      qty: String(qtyN),
      estSubtotal: money(sub),
      estFee: money(fee),
      estTotal: money(sub + fee),
      qtyDec: () => setState((s) => ({ qty: Math.max(0, (s.qty || 0) - 1) })),
      qtyInc: () => setState((s) => ({ qty: (s.qty || 0) + 1 })),
      setQty: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState({ qty: parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10) || 0 }),
      buyNow: () => {
        if (!state.authed) {
          setState({
            authOpen: true,
            authMode: 'login',
            authStage: 'form',
            pendingResume: 'orders',
          });
          return;
        }
        h.requireKyc('complete a purchase', () => go('orders'), 'product');
      },
    };
  }, [state.activeId, state.qty, state.payMethod, state.authed, setState, go, h]);
}
