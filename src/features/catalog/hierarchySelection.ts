export interface CatalogSelection {
  homeFilter: string;
  subcategory: string;
  mineralType: string;
  productForm: string;
}

const cleared = { subcategory: '', mineralType: '', productForm: '' };

/** Choosing a category drops every child. Choosing it again clears the category too. */
export function selectCategory(current: CatalogSelection, category: string): CatalogSelection {
  if (current.homeFilter === category) return { homeFilter: 'all', ...cleared };
  return { homeFilter: category, ...cleared };
}

export function selectSubcategory(current: CatalogSelection, subcategory: string): CatalogSelection {
  if (current.subcategory === subcategory) return { ...current, subcategory: '', mineralType: '', productForm: '' };
  return { ...current, subcategory, mineralType: '', productForm: '' };
}

export function selectMineralType(current: CatalogSelection, mineralType: string): CatalogSelection {
  if (current.mineralType === mineralType) return { ...current, mineralType: '', productForm: '' };
  return { ...current, mineralType, productForm: '' };
}

export function selectProductForm(current: CatalogSelection, productForm: string): CatalogSelection {
  if (current.productForm === productForm) return { ...current, productForm: '' };
  return { ...current, productForm };
}

export interface HierarchyForm {
  slug: string;
  name: string;
  imageUrl?: string | null;
  imageName?: string | null;
}
export interface HierarchyType {
  slug: string;
  name: string;
  imageUrl?: string | null;
  productForms: HierarchyForm[];
}
export interface HierarchySubcategory {
  slug: string;
  name: string;
  imageUrl?: string | null;
  mineralTypes: HierarchyType[];
}
export interface HierarchyCategory {
  slug: string;
  name: string;
  imageUrl?: string | null;
  subcategories: HierarchySubcategory[];
}

export function subcategoriesFor(categories: HierarchyCategory[], categorySlug: string): HierarchySubcategory[] {
  if (!categorySlug || categorySlug === 'all') return [];
  return categories.find((c) => c.slug === categorySlug)?.subcategories ?? [];
}

export function typesFor(categories: HierarchyCategory[], categorySlug: string, subcategorySlug: string): HierarchyType[] {
  if (!subcategorySlug) return [];
  return subcategoriesFor(categories, categorySlug).find((s) => s.slug === subcategorySlug)?.mineralTypes ?? [];
}

export function formsFor(categories: HierarchyCategory[], selection: CatalogSelection): HierarchyForm[] {
  if (!selection.mineralType) return [];
  return typesFor(categories, selection.homeFilter, selection.subcategory).find((t) => t.slug === selection.mineralType)?.productForms ?? [];
}

export type BrowseLevel = 'categories' | 'subcategories' | 'items';

/** One screen at a time: categories, then that category's subcategories, then its product forms. */
export function browseLevel(selection: Pick<CatalogSelection, 'homeFilter' | 'subcategory'>): BrowseLevel {
  if (!selection.homeFilter || selection.homeFilter === 'all') return 'categories';
  if (!selection.subcategory) return 'subcategories';
  return 'items';
}

export function openCategory(category: string): CatalogSelection {
  return { homeFilter: category, ...cleared };
}

export function openSubcategory(current: CatalogSelection, subcategory: string): CatalogSelection {
  return { ...current, subcategory, mineralType: '', productForm: '' };
}

export function backBrowse(current: CatalogSelection): CatalogSelection {
  if (current.subcategory) return { ...current, subcategory: '', mineralType: '', productForm: '' };
  return { homeFilter: 'all', ...cleared };
}

/** Product forms under a subcategory, including every mineral type that belongs to it. */
export function formsUnderSubcategory(
  categories: HierarchyCategory[],
  categorySlug: string,
  subcategorySlug: string,
): HierarchyForm[] {
  return typesFor(categories, categorySlug, subcategorySlug).flatMap((type) => type.productForms);
}
