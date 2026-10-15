import type { SortKey } from '@/types';

/** Search, filtering and sorting for the catalog and the home listing. */
export interface CatalogSlice {
  query: string;
  homeFilter: string;
  gradeF: string;
  sellerF: string;
  sort: SortKey;
  showFilters: boolean;
}

export const catalogInitial: CatalogSlice = {
  query: '',
  homeFilter: 'all',
  gradeF: '',
  sellerF: '',
  sort: 'featured',
  showFilters: true,
};

export const CATALOG_KEYS = [
  'query',
  'homeFilter',
  'gradeF',
  'sellerF',
  'sort',
  'showFilters',
] as const satisfies readonly (keyof CatalogSlice)[];
