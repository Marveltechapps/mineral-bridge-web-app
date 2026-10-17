import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCatalogState } from '@/hooks/useAppState';
import { isApiConfigured } from '@/lib/api/config';
import { BUY_STAGES, CATS, PRODUCTS, SELL_STAGES } from '@/constants/catalog';
import { catalogKeys, displayImageUrl, getCategories, getLots, getMarketStats } from '@/features/catalog/services/catalogService';
import type { Product } from '@/types';

const EMPTY_PRODUCTS: Product[] = [];

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
  const { homeFilter, subcategory, query, setState, go } = useCatalogState();
  const api = isApiConfigured();
  const lotsQuery = useQuery({
    queryKey: catalogKeys.lots({ perPage: 100 }),
    queryFn: ({ signal }) => getLots({ perPage: 100 }, signal),
    enabled: api,
  });
  const catsQuery = useQuery({
    queryKey: ['reference', 'categories'],
    queryFn: ({ signal }) => getCategories(signal),
    enabled: api,
  });
  const statsQuery = useQuery({
    queryKey: ['market', 'stats'],
    queryFn: ({ signal }) => getMarketStats(signal),
    enabled: api,
  });
  const products = api ? (lotsQuery.data?.items ?? EMPTY_PRODUCTS) : PRODUCTS;
  const sourceCats = api
    ? (catsQuery.data ?? []).map((c) => ({
        key: c.key,
        name: c.name,
        grad: displayImageUrl(c.imageUrl)
          ? `url("${displayImageUrl(c.imageUrl)}") center / contain no-repeat, #eef1f6`
          : 'linear-gradient(140deg,#1e2a5a,#141a2e)',
        types: c.subCategories ?? [],
      }))
    : CATS;
  const loading = api && lotsQuery.isLoading;
  const failed = api && (lotsQuery.isError || catsQuery.isError);

  return useMemo(() => {
    const stats = statsQuery.data;
    const heroStats = api
      ? [
          { value: String(stats?.mineralTypes ?? 0), label: 'Mineral types' },
          { value: String(stats?.originCountries ?? 0), label: 'Countries served' },
          { value: String(stats?.activeLots ?? 0), label: 'Assured lots' },
        ]
      : [
          { value: '190+', label: 'Mineral types' },
          { value: '54', label: 'Countries served' },
          { value: '100%', label: 'Escrow secured' },
        ];

    const heroRates = products.slice(0, 4).map((p, i, a) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      grad: p.grad,
      delta: api ? '' : i % 2 === 0 ? '+1.4%' : '-0.6%',
      deltaColor: api ? 'transparent' : i % 2 === 0 ? '#7fe3a1' : '#f3a6b8',
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

    const homeCats = sourceCats.map((c) => ({
      name: c.name,
      grad: products.find((p) => p.catKey === c.key && p.grad.includes('url('))?.grad || c.grad,
      count: c.types.length,
      open: () => {
        setState({ homeFilter: c.key, subcategory: '', mineralType: '', productForm: '' });
        go('buy');
      },
    }));

    const homeFilters = [{ key: 'all', label: 'All' }]
      .concat(
        sourceCats.map((c) => ({
          key: c.key as string,
          label: c.name.replace(' Minerals', '').replace(' Metals', ''),
        })),
      )
      .map((f) => ({
        key: f.key,
        label: f.label,
        style: filterChip(homeFilter === f.key),
        select: () => setState(f.key === 'all' || f.key === homeFilter
          ? { homeFilter: 'all', subcategory: '', mineralType: '', productForm: '' }
          : { homeFilter: f.key, subcategory: '', mineralType: '', productForm: '' }),
      }));
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) => homeFilter === 'all' || p.catKey === homeFilter,
    ).filter(
      (p) => !subcategory || p.subcategorySlug === subcategory || p.subCategory === subcategory,
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
      homeCategoryLead: api
        ? `${sourceCats.length} verified categories, ${stats?.mineralTypes ?? 0} mineral types.`
        : 'Five verified categories, 190+ mineral types.',
      homeListCount: loading ? '…' : String(list.length),
      homeNotice: failed
        ? 'The catalog could not be loaded. No sample minerals are shown.'
        : !loading && api && list.length === 0
          ? 'No minerals are published yet.'
          : '',
      retryCatalog: () => {
        void lotsQuery.refetch();
        void catsQuery.refetch();
      },
      sellPerks,
      pipelines,
    };
  }, [homeFilter, subcategory, query, setState, go, products, sourceCats, api, loading, failed, statsQuery.data, lotsQuery, catsQuery]);
}
