import { useMemo } from 'react';
import { useCatalogState } from '@/hooks/useAppState';
import { CATS, PRODUCTS } from '@/constants/catalog';
import { num } from '@/utils/format';
import type { Product, SortKey } from '@/types';

const box = (on: boolean) =>
  'width:19px; height:19px; border-radius:6px; border:1.6px solid ' +
  (on ? '#1e2a5a' : '#cdd4e6') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; display:flex; align-items:center; justify-content:center; flex-shrink:0;';

const SORT_OPTIONS: { v: SortKey; label: string }[] = [
  { v: 'featured', label: 'Featured' },
  { v: 'low', label: 'Price: low to high' },
  { v: 'high', label: 'Price: high to low' },
  { v: 'name', label: 'Name: A–Z' },
];

/** View model for the "Browse minerals" catalog, with its filter rail and sort. */
export function useCatalogViewModel() {
  const { homeFilter, gradeF, sellerF, query, sort, showFilters, setState, go } = useCatalogState();

  return useMemo(() => {
    const q = query.trim().toLowerCase();
    const countIn = (fn: (p: Product) => boolean) => PRODUCTS.filter(fn).length;

    const filterGroups = [
      {
        title: 'Category',
        options: CATS.map((c) => ({
          label: c.name,
          on: homeFilter === c.key,
          count: countIn((p) => p.catKey === c.key),
          select: () =>
            setState({ homeFilter: homeFilter === c.key ? 'all' : c.key }),
        })),
      },
      {
        title: 'Grade',
        options: ['99.9%', '99.95%', 'Grade A', 'VS1'].map((g) => ({
          label: g,
          on: gradeF === g,
          count: countIn((p) => p.grade === g),
          select: () => setState({ gradeF: gradeF === g ? '' : g }),
        })),
      },
      {
        title: 'Seller type',
        options: ['Refinery', 'Cooperative', 'Artisanal', 'Trader'].map((s) => ({
          label: s,
          on: sellerF === s,
          count: countIn((p) => p.sellerType === s),
          select: () => setState({ sellerF: sellerF === s ? '' : s }),
        })),
      },
    ].map((g) => ({
      title: g.title,
      options: g.options.map((o) => ({
        label: o.label,
        on: o.on,
        box: box(o.on),
        count: String(o.count),
        select: o.select,
      })),
    }));

    let cat = PRODUCTS.filter((p) => homeFilter === 'all' || p.catKey === homeFilter)
      .filter((p) => !gradeF || p.grade === gradeF)
      .filter((p) => !sellerF || p.sellerType === sellerF)
      .filter(
        (p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      );

    if (sort === 'low') cat = cat.slice().sort((a, b) => num(a.price) - num(b.price));
    if (sort === 'high') cat = cat.slice().sort((a, b) => num(b.price) - num(a.price));
    if (sort === 'name') cat = cat.slice().sort((a, b) => a.name.localeCompare(b.name));

    const catalogProducts = cat.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      grade: p.grade,
      region: p.region,
      seller: p.seller,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      grad: p.grad,
      open: () => {
        setState({ activeId: p.id, qty: 10 });
        go('product');
      },
    }));

    const nActive =
      (homeFilter !== 'all' ? 1 : 0) + (gradeF ? 1 : 0) + (sellerF ? 1 : 0);

    return {
      filterGroups,
      catalogProducts,
      catalogTitle:
        homeFilter === 'all'
          ? 'Mineral Bridge Assured'
          : (CATS.find((c) => c.key === homeFilter) || { name: '' }).name,
      catalogCount: String(cat.length),
      catalogEmpty: cat.length === 0,
      sortOptions: SORT_OPTIONS.map((s) => ({ ...s, sel: sort === s.v })),
      sortValue: sort,
      filterBtnStyle:
        'display:flex; align-items:center; gap:9px; height:44px; padding:0 18px; border-radius:11px; cursor:pointer; font-size:13.5px; font-weight:800; border:1px solid ' +
        (showFilters ? '#1e2a5a' : '#dde2f0') +
        '; background:' +
        (showFilters ? '#1e2a5a' : '#fff') +
        '; color:' +
        (showFilters ? '#fff' : '#141a2e') +
        ';',
      filterRailStyle: showFilters
        ? 'position:sticky; top:96px; background:#fff; border:1px solid #e7eaf3; border-radius:18px; padding:22px; box-shadow:0 4px 14px rgba(20,26,46,.05);'
        : 'display:none;',
      activeFilterCount: nActive ? String(nActive) : '',
      catalogGrid: showFilters
        ? 'display:grid; grid-template-columns:264px 1fr; gap:28px; align-items:start;'
        : 'display:grid; grid-template-columns:1fr; gap:28px; align-items:start;',
      clearFilters: () => setState({ homeFilter: 'all', gradeF: '', sellerF: '', query: '' }),
      toggleFilters: () => setState((s) => ({ showFilters: !s.showFilters })),
      setSort: (e: React.ChangeEvent<HTMLSelectElement>) =>
        setState({ sort: e.target.value as SortKey }),
    };
  }, [
    homeFilter,
    gradeF,
    sellerF,
    query,
    sort,
    showFilters,
    setState,
    go,
  ]);
}
