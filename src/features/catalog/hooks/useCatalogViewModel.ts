import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCatalogState } from '@/hooks/useAppState';
import { isApiConfigured } from '@/lib/api/config';
import { CATS, PRODUCTS } from '@/constants/catalog';
import {
  backBrowse,
  browseLevel,
  formsUnderSubcategory,
  openCategory,
  openSubcategory,
  subcategoriesFor,
  type BrowseLevel,
  type HierarchyCategory,
} from '@/features/catalog/hierarchySelection';
import { catalogKeys, displayImageUrl, getHierarchy, getLots } from '@/features/catalog/services/catalogService';
import type { Product } from '@/types';

const EMPTY_PRODUCTS: Product[] = [];
const EMPTY_HIERARCHY: HierarchyCategory[] = [];

function fixtureHierarchy(): HierarchyCategory[] {
  return CATS.map((category) => ({
    slug: category.key,
    name: category.name,
    imageUrl: null,
    subcategories: category.sub.map((name) => ({
      slug: name,
      name,
      imageUrl: null,
      mineralTypes: [
        {
          slug: name,
          name,
          imageUrl: null,
          productForms: PRODUCTS.filter((product) => product.catKey === category.key && product.subCategory === name).map((product) => ({
            slug: product.id,
            name: product.name,
            imageUrl: null,
          })),
        },
      ],
    })),
  }));
}

export interface BrowseCard {
  slug: string;
  name: string;
  meta: string;
  imageUrl?: string | null;
  background?: string;
  price?: string;
  unit?: string;
  open?: () => void;
}

/** Three-level catalog: categories, then subcategories, then product forms. */
export function useCatalogViewModel() {
  const { homeFilter, subcategory, mineralType, productForm, query, setState, go } = useCatalogState();
  const api = isApiConfigured();
  const level: BrowseLevel = browseLevel({ homeFilter, subcategory });
  const lotsQuery = useQuery({
    queryKey: catalogKeys.lots({ category: homeFilter, subcategory, perPage: 100 }),
    queryFn: ({ signal }) => getLots({ category: homeFilter, subcategory, perPage: 100 }, signal),
    enabled: api && level === 'items',
  });
  const hierarchyQuery = useQuery({
    queryKey: ['reference', 'hierarchy'],
    queryFn: ({ signal }) => getHierarchy(signal),
    enabled: api,
  });
  const hierarchy: HierarchyCategory[] = api ? (hierarchyQuery.data ?? EMPTY_HIERARCHY) : fixtureHierarchy();
  const products = api ? (lotsQuery.data?.items ?? EMPTY_PRODUCTS) : PRODUCTS;
  const loading = api && hierarchyQuery.isLoading;
  const failed = api && hierarchyQuery.isError;
  const itemsFailed = api && level === 'items' && lotsQuery.isError && hierarchyQuery.isSuccess && formsUnderSubcategory(hierarchy, homeFilter, subcategory).length === 0;

  return useMemo(() => {
    const category = hierarchy.find((row) => row.slug === homeFilter);
    const subs = subcategoriesFor(hierarchy, homeFilter);
    const subcategoryRow = subs.find((row) => row.slug === subcategory);
    const forms = formsUnderSubcategory(hierarchy, homeFilter, subcategory);
    const q = query.trim().toLowerCase();
    const backgroundFor = (slug: string, kind: 'category' | 'item') => {
      if (api) return undefined;
      if (kind === 'category') return CATS.find((row) => row.key === slug)?.grad;
      return PRODUCTS.find((row) => row.id === slug)?.grad;
    };

    const firstImage = (urls: Array<string | null | undefined>) => {
      for (const url of urls) {
        const next = displayImageUrl(url);
        if (next) return next;
      }
      return undefined;
    };

    const cards: BrowseCard[] =
      level === 'categories'
        ? hierarchy.map((row) => ({
            slug: row.slug,
            name: row.name,
            meta: `${row.subcategories.length} subcategories`,
            imageUrl: firstImage([
              row.imageUrl,
              ...row.subcategories.flatMap((sub) => [
                sub.imageUrl,
                ...sub.mineralTypes.flatMap((type) => type.productForms.map((form) => form.imageUrl)),
              ]),
            ]),
            background: backgroundFor(row.slug, 'category'),
            open: () => setState({ ...openCategory(row.slug), query: '' }),
          }))
        : level === 'subcategories'
          ? subs.map((row) => ({
              slug: row.slug,
              name: row.name,
              meta: `${row.mineralTypes.reduce((count, type) => count + type.productForms.length, 0)} product forms`,
              imageUrl: firstImage([
                row.imageUrl,
                ...row.mineralTypes.flatMap((type) => type.productForms.map((form) => form.imageUrl)),
              ]),
              open: () => setState({ ...openSubcategory({ homeFilter, subcategory, mineralType, productForm }, row.slug), query: '' }),
            }))
          : forms
              .filter((form) => !q || form.name.toLowerCase().includes(q))
              .map((form) => {
                const lot = products.find((product) => product.productFormSlug === form.slug || product.id === form.slug || product.name === form.name);
                const imageUrl = displayImageUrl(form.imageUrl) || displayImageUrl(lot?.imageUrl);
                return {
                  slug: form.slug,
                  name: form.name,
                  meta: lot?.grade || '',
                  imageUrl,
                  background: imageUrl ? undefined : backgroundFor(form.slug, 'item') || lot?.grad,
                  price: lot?.price,
                  unit: lot?.unit,
                  open: lot
                    ? () => {
                        setState({ activeId: lot.id, qty: 10 });
                        go('product');
                      }
                    : undefined,
                };
              });

    const title =
      level === 'categories' ? 'Browse by category' : level === 'subcategories' ? category?.name || 'Subcategories' : subcategoryRow?.name || 'Product forms';
    const context =
      level === 'items' && category ? category.name : level === 'subcategories' ? 'Subcategories' : 'Choose a category';

    return {
      level,
      title,
      context,
      countLabel:
        level === 'categories'
          ? `${hierarchy.length} categories`
          : level === 'subcategories'
            ? `${subs.length} subcategories`
            : `${cards.length} product forms`,
      backLabel: level === 'items' ? 'Subcategories' : level === 'subcategories' ? 'Categories' : '',
      back: () => setState({ ...backBrowse({ homeFilter, subcategory, mineralType, productForm }), query: '' }),
      cards,
      search: query,
      setSearch: (value: string) => setState({ query: value }),
      loading,
      failed: failed || itemsFailed,
      empty: !loading && !(failed || itemsFailed) && cards.length === 0,
      emptyTitle: level === 'items' && q ? 'No product forms match that search' : level === 'items' ? 'No product forms for this subcategory' : 'Nothing is published under this selection',
      emptyBody: level === 'items' && q ? 'Try a different name from this subcategory.' : level === 'items' ? 'This subcategory has no product forms in the catalog.' : 'Choose another category to continue.',
      retry: () => {
        void hierarchyQuery.refetch();
        if (level === 'items') void lotsQuery.refetch();
      },
    };
  }, [
    hierarchy,
    homeFilter,
    subcategory,
    mineralType,
    productForm,
    query,
    level,
    products,
    api,
    loading,
    failed,
    itemsFailed,
    setState,
    go,
    hierarchyQuery,
    lotsQuery,
  ]);
}
