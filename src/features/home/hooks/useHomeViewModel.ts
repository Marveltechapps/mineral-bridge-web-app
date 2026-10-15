import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { BUY_STAGES, CATS, PRODUCTS, SELL_STAGES } from '@/constants/catalog';
import type { Product } from '@/types';

const filterChip = (on: boolean) =>
  'padding:9px 16px; border-radius:10px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:13px; font-weight:700; cursor:pointer; transition:border-color .15s ease;';

/** View model for the home screen, ported from the design's `renderVals()`. */
export function useHomeViewModel() {
  const { state, setState, go } = useAppState();

  return useMemo(() => {
    const heroStats = [
      { value: '190+', label: 'Mineral types' },
      { value: '54', label: 'Countries served' },
      { value: '100%', label: 'Escrow secured' },
    ];

    const heroRates = PRODUCTS.slice(0, 4).map((p, i, a) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      grad: p.grad,
      delta: i % 2 === 0 ? '+1.4%' : '-0.6%',
      deltaColor: i % 2 === 0 ? '#7fe3a1' : '#f3a6b8',
      rowStyle:
        'display:flex; align-items:center; gap:13px; padding:13px 0;' +
        (i < a.length - 1 ? ' border-bottom:1px solid rgba(255,255,255,.09);' : ''),
    }));

    const trustItems = [
      { title: 'Escrow settlement', sub: 'Funds released on custody transfer', ic: 'shield' },
      { title: 'Lab-assayed lots', sub: 'Fire assay & XRF verified', ic: 'flask' },
      { title: 'Bonded logistics', sub: 'Door-to-door insured transit', ic: 'truck' },
      { title: 'On-chain provenance', sub: 'Immutable audit trail', ic: 'chain' },
    ] as const;

    const homeCats = CATS.map((c) => ({
      name: c.name,
      grad: c.grad,
      count: c.types.length,
      open: () => {
        setState({ homeFilter: c.key });
        go('buy');
      },
    }));

    const homeFilters = [{ key: 'all', label: 'All' }]
      .concat(
        CATS.map((c) => ({
          key: c.key as string,
          label: c.name.replace(' Minerals', '').replace(' Metals', ''),
        })),
      )
      .map((f) => ({
        key: f.key,
        label: f.label,
        style: filterChip(state.homeFilter === f.key),
        select: () => setState({ homeFilter: f.key }),
      }));

    const q = state.query.trim().toLowerCase();
    const list = PRODUCTS.filter(
      (p) => state.homeFilter === 'all' || p.catKey === state.homeFilter,
    ).filter(
      (p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );

    const openBuy = (p: Product) => {
      setState({ modal: null, activeId: p.id, qty: 10 });
      go('product');
    };
    const openSell = (p: Product) => {
      setState((s) => ({
        modal: null,
        activeId: p.id,
        sellStep: 1,
        sellForm: { ...s.sellForm, mineral: p.name, category: p.category },
      }));
      go('sell');
    };

    const homeProducts = list.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      subCategory: p.subCategory || p.category,
      grade: p.grade,
      region: p.region,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      grad: p.grad,
      open: () => openBuy(p),
      buy: () => openBuy(p),
      sell: () => openSell(p),
    }));

    const sellPerks = [
      { v: 'On-site verification' },
      { v: 'We pack and ship' },
      { v: 'Support-arranged payment' },
    ];

    const pipelines = [
      {
        key: 'buy',
        label: 'BUYING',
        note: 'Escrow-protected — funds release on verified custody transfer.',
        steps: BUY_STAGES.map((s, i) => ({ n: String(i + 1), title: s.title, sub: s.sub })),
      },
      {
        key: 'sell',
        label: 'SELLING',
        note: 'Verified at your location — our support team arranges payment.',
        steps: SELL_STAGES.map((s, i) => ({ n: String(i + 1), title: s.title, sub: s.sub })),
      },
    ];

    return {
      heroStats,
      heroRates,
      trustItems,
      homeCats,
      homeFilters,
      homeProducts,
      homeListCount: String(list.length),
      sellPerks,
      pipelines,
    };
  }, [state.homeFilter, state.query, setState, go]);
}
