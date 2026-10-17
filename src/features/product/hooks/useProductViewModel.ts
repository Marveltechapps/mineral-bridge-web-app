import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useProductState, useSessionState } from '@/hooks/useAppState';
import { useActions } from '@/hooks/useActions';
import { isApiConfigured } from '@/lib/api/config';
import { PRODUCTS } from '@/constants/catalog';
import { catalogKeys, getLot, getLots } from '@/features/catalog/services/catalogService';
import { createOrder, quoteOrder } from '@/features/orders/services/ordersService';
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
const BLANK: (typeof PRODUCTS)[number] = {
  id: '',
  name: '',
  category: '',
  catKey: '',
  subCategory: '',
  seller: '',
  sellerType: 'Trader',
  grade: '',
  region: '',
  price: '$0',
  unit: 'g',
  stock: '—',
  grad: 'linear-gradient(140deg,#1e2a5a,#141a2e)',
};

export function useProductViewModel() {
  const { activeId, qty, payMethod, setState, go } = useProductState();
  const { authed } = useSessionState();
  const h = useActions();
  const api = isApiConfigured();
  const client = useQueryClient();
  const lotsQuery = useQuery({
    queryKey: catalogKeys.lots({ perPage: 100 }),
    queryFn: ({ signal }) => getLots({ perPage: 100 }, signal),
    enabled: api,
  });
  const detailQuery = useQuery({
    queryKey: catalogKeys.lot(activeId || 'none'),
    queryFn: ({ signal }) => getLot(activeId, signal),
    enabled: api && Boolean(activeId),
  });
  const catalog = api ? (lotsQuery.data?.items ?? []) : PRODUCTS;
  const selected = (api ? detailQuery.data : undefined) || catalog.find((p) => p.id === activeId) || (api ? BLANK : PRODUCTS[0]);
  const unit = (['g', 'kg', 'oz', 'ct', 'MT'] as const).find((u) => u === selected.unit) ?? 'g';
  const quoteQuery = useQuery({
    queryKey: ['orders', 'quote', selected.id, qty, payMethod],
    queryFn: ({ signal }) =>
      quoteOrder(
        {
          lotId: selected.id,
          quantity: { value: qty || 0, unit },
          paymentMethod: (payMethod || 'escrow') as 'escrow' | 'wire' | 'lc' | 'btc',
        },
        signal,
      ),
    enabled: api && Boolean(selected.id) && (qty || 0) > 0,
  });

  return useMemo(() => {
    const ap = selected;

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
      desc:
        ('description' in ap && typeof ap.description === 'string' && ap.description) ||
        (ap.name
          ? `${ap.name} sourced from ${ap.region || 'the listed origin'}.`
          : 'Select a mineral from the catalog.'),
    };

    const qtyN = qty || 0;
    const quoted = quoteQuery.data;
    const sub = quoted ? quoted.subtotal.amount / 100 : api ? 0 : num(ap.price) * qtyN;
    const fee = quoted ? quoted.platformFee.amount / 100 : api ? 0 : sub * 0.01;

    const provEvents: [string, string, string, string][] = api ? [] : [
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
      isBtc: payMethod === 'btc',
      isLc: payMethod === 'lc',
      openLc: () => go('contract'),
      opts: PAYS.map(([k, t, s, tag]) => {
        const on = payMethod === k;
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
        if (!authed) {
          setState({
            authOpen: true,
            authMode: 'login',
            authStage: 'form',
            pendingResume: 'orders',
          });
          return;
        }
        h.requireKyc(
          'complete a purchase',
          () => {
            if (!api || !ap.id) {
              go('orders');
              return;
            }
            void createOrder({
              lotId: ap.id,
              quantity: { value: qtyN || 1, unit },
              paymentMethod: (payMethod || 'escrow') as 'escrow' | 'wire' | 'lc' | 'btc',
              quoteId: quoted?.quoteId,
            })
              .then(() => {
                void client.invalidateQueries({ queryKey: ['orders'] });
                go('orders');
              })
              .catch((error: unknown) => {
                setState({
                  modal: {
                    title: 'Order was not placed',
                    body: error instanceof Error ? error.message : 'The order could not be saved.',
                    confirmLabel: 'Close',
                    confirm: () => setState({ modal: null }),
                  },
                });
              });
          },
          'product',
        );
      },
    };
  }, [qty, payMethod, authed, setState, go, h, selected, api, unit, client, quoteQuery.data]);
}
