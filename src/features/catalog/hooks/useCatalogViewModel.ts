import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCatalogState } from '@/hooks/useAppState';
import { isApiConfigured } from '@/lib/api/config';
import { CATS, PRODUCTS } from '@/constants/catalog';
import { catalogKeys, getHierarchy, getLots, type HierarchyCategory } from '@/features/catalog/services/catalogService';
import type { Product, SortKey } from '@/types';

const EMPTY_PRODUCTS: Product[] = [];
const EMPTY_HIERARCHY: HierarchyCategory[] = [];

export interface FilterOption {
  value: string;
  label: string;
}

function uniqueOptions(options: FilterOption[]): FilterOption[] {
  const seen = new Set<string>();
  return options.filter((option) => {
    if (seen.has(option.value)) return false;
    seen.add(option.value);
    return true;
  });
}

function priceAmount(price: string): number {
  const amount = Number(price.replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

function fixtureHierarchy(): HierarchyCategory[] {
  return CATS.map((category) => ({
    slug: category.key,
    name: category.name,
    imageUrl: null,
    subcategories: category.sub.map((name) => ({
      slug: name,
      name,
      imageUrl: null,
      mineralTypes: (category.types.includes(name) ? [name] : category.types).slice(0, 1).map((type) => ({
        slug: type,
        name: type,
        imageUrl: null,
        productForms: PRODUCTS.filter((product) => product.catKey === category.key && product.subCategory === name).map((product) => ({
          slug: product.id,
          name: product.name,
          imageUrl: null,
        })),
      })),
    })),
  }));
}

/** Filterable assured-lot catalog: search, four filters and sort. */
export function useCatalogViewModel() {
  const { homeFilter, subcategory, mineralType, productForm, query, sort, setState, go } = useCatalogState();
  const api = isApiConfigured();
  const lotsQuery = useQuery({
    queryKey: catalogKeys.lots({ perPage: 100 }),
    queryFn: ({ signal }) => getLots({ perPage: 100 }, signal),
    enabled: api,
  });
  const hierarchyQuery = useQuery({
    queryKey: ['reference', 'hierarchy'],
    queryFn: ({ signal }) => getHierarchy(signal),
    enabled: api,
  });
  const hierarchy = api ? (hierarchyQuery.data ?? EMPTY_HIERARCHY) : fixtureHierarchy();
  const products = api ? (lotsQuery.data?.items ?? EMPTY_PRODUCTS) : PRODUCTS;
  const loading = api && (lotsQuery.isLoading || hierarchyQuery.isLoading);
  const failed = api && (lotsQuery.isError || hierarchyQuery.isError);

  return useMemo(() => {
    const categories: FilterOption[] = hierarchy.map((row) => ({ value: row.slug, label: row.name }));
    const category = hierarchy.find((row) => row.slug === homeFilter);
    const subcategoryRows = category ? category.subcategories : hierarchy.flatMap((row) => row.subcategories);
    const subcategories: FilterOption[] = uniqueOptions(subcategoryRows.map((row) => ({ value: row.slug, label: row.name })));
    const typeRows = (subcategory
      ? subcategoryRows.filter((row) => row.slug === subcategory)
      : subcategoryRows
    ).flatMap((row) => row.mineralTypes);
    const mineralTypes: FilterOption[] = uniqueOptions(typeRows.map((row) => ({ value: row.slug, label: row.name })));
    const formRows = (mineralType
      ? typeRows.filter((row) => row.slug === mineralType)
      : typeRows
    ).flatMap((row) => row.productForms);
    const forms: FilterOption[] = uniqueOptions(formRows.map((row) => ({ value: row.slug, label: row.name })));
    const selectedForm = forms.find((row) => row.value === productForm)?.label ?? '';

    const q = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (homeFilter !== 'all' && product.catKey !== homeFilter && product.category !== homeFilter) return false;
      if (subcategory && product.subcategorySlug !== subcategory && product.subCategory !== subcategory) return false;
      if (mineralType && product.mineralTypeSlug !== mineralType && product.mineralType !== mineralType && product.subCategory !== mineralType) return false;
      if (
        productForm &&
        product.productFormSlug !== productForm &&
        product.productForm !== productForm &&
        product.productForm !== selectedForm &&
        product.id !== productForm &&
        product.name !== productForm &&
        product.name !== selectedForm
      ) {
        return false;
      }
      if (q && !product.name.toLowerCase().includes(q) && !product.category.toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'low' || sort === 'high') {
        const delta = priceAmount(a.price) - priceAmount(b.price);
        return sort === 'high' ? -delta : delta;
      }
      return 0;
    });

    const clear = () =>
      setState({
        homeFilter: 'all',
        subcategory: '',
        mineralType: '',
        productForm: '',
        query: '',
        sort: 'featured' as SortKey,
      });

    return {
      loading,
      failed,
      search: query,
      setSearch: (value: string) => setState({ query: value }),
      category: homeFilter,
      subcategory,
      mineralType,
      productForm,
      sort: sort === 'low' || sort === 'high' ? 'price' : sort,
      categories,
      subcategories,
      mineralTypes,
      forms,
      setCategory: (value: string) =>
        setState({ homeFilter: value || 'all', subcategory: '', mineralType: '', productForm: '' }),
      setSubcategory: (value: string) => setState({ subcategory: value, mineralType: '', productForm: '' }),
      setMineralType: (value: string) => setState({ mineralType: value, productForm: '' }),
      setProductForm: (value: string) => setState({ productForm: value }),
      setSort: (value: string) => setState({ sort: value === 'price' ? 'low' : value === 'name' ? 'name' : 'featured' }),
      countLabel: loading
        ? 'Loading…'
        : `${sorted.length} assured ${sorted.length === 1 ? 'lot' : 'lots'}`,
      products: sorted.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        subCategory: product.subCategory || product.category,
        grade: product.grade,
        region: product.region,
        price: product.price,
        unit: product.unit,
        stock: product.stock,
        grad: product.grad,
        open: () => {
          setState({ activeId: product.id, qty: 10 });
          go('product');
        },
        buy: () => {
          setState({ activeId: product.id, qty: 10 });
          go('product');
        },
      })),
      empty: !loading && !failed && sorted.length === 0,
      emptyTitle: q ? 'No minerals match that search' : 'No minerals match these filters',
      emptyBody: 'Choose All or clear the search to see the full catalog.',
      clear,
      retry: () => {
        void lotsQuery.refetch();
        void hierarchyQuery.refetch();
      },
    };
  }, [
    hierarchy,
    products,
    homeFilter,
    subcategory,
    mineralType,
    productForm,
    query,
    sort,
    loading,
    failed,
    setState,
    go,
    lotsQuery,
    hierarchyQuery,
  ]);
}
