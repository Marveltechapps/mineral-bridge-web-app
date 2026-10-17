import { describe, expect, it } from 'vitest';
import { backBrowse, browseLevel, formsFor, formsUnderSubcategory, openCategory, openSubcategory, selectCategory, selectMineralType, selectProductForm, selectSubcategory } from '@/features/catalog/hierarchySelection';
import { lotToProduct } from '@/features/catalog/services/catalogService';

const tree = [
  {
    slug: 'precious-metal',
    name: 'Precious Metal',
    subcategories: [
      {
        slug: 'precious-metal-gold',
        name: 'Gold',
        mineralTypes: [
          {
            slug: 'precious-metal-gold',
            name: 'Gold',
            productForms: [
              { slug: 'precious-metal-gold-gold-bullion-bars', name: 'Gold Bullion Bars' },
              { slug: 'precious-metal-gold-gold-dust', name: 'Gold Dust' },
            ],
          },
        ],
      },
      { slug: 'precious-metal-silver', name: 'Silver', mineralTypes: [{ slug: 'precious-metal-silver', name: 'Silver', productForms: [{ slug: 'silver-bar', name: 'Silver Bar' }] }] },
    ],
  },
  { slug: 'gemstone', name: 'Gemstone', subcategories: [] },
];

describe('catalog hierarchy selection', () => {
  it('clears child selections when a parent changes', () => {
    const gold = selectProductForm(
      selectMineralType(selectSubcategory(selectCategory({ homeFilter: 'all', subcategory: '', mineralType: '', productForm: '' }, 'precious-metal'), 'precious-metal-gold'), 'precious-metal-gold'),
      'precious-metal-gold-gold-bullion-bars',
    );
    expect(formsFor(tree, gold).map((f) => f.name)).toEqual(['Gold Bullion Bars', 'Gold Dust']);
    const gem = selectCategory(gold, 'gemstone');
    expect(gem).toEqual({ homeFilter: 'gemstone', subcategory: '', mineralType: '', productForm: '' });
    expect(formsFor(tree, gem)).toEqual([]);
  });

  it('moves one level at a time and clears the previous child', () => {
    expect(browseLevel({ homeFilter: 'all', subcategory: '' })).toBe('categories');
    const category = openCategory('precious-metal');
    expect(browseLevel(category)).toBe('subcategories');
    const gold = openSubcategory(category, 'precious-metal-gold');
    expect(browseLevel(gold)).toBe('items');
    expect(formsUnderSubcategory(tree, gold.homeFilter, gold.subcategory).map((form) => form.name)).toEqual(['Gold Bullion Bars', 'Gold Dust']);
    const back = backBrowse(gold);
    expect(back).toEqual({ homeFilter: 'precious-metal', subcategory: '', mineralType: '', productForm: '' });
    expect(formsUnderSubcategory(tree, 'gemstone', 'precious-metal-gold')).toEqual([]);
    expect(browseLevel(openCategory('gemstone'))).toBe('subcategories');
  });

  it('maps the lot contract without renaming the sheet product form', () => {
    const product = lotToProduct({
      id: 'prd_1',
      title: 'Gold Bullion Bars',
      categoryName: 'Precious Metal',
      subcategoryName: 'Gold',
      mineralTypeName: 'Gold',
      productFormName: 'Gold Bullion Bars',
      imageUrl: 'https://cdn.example/MIN0120-Gold+Bullion+Bars.png',
      mineral: { category: 'precious-metal', subcategory: 'precious-metal-gold', type: 'precious-metal-gold', productForm: 'precious-metal-gold-gold-bullion-bars' },
    });
    expect(product.productForm).toBe('Gold Bullion Bars');
    expect(product.imageUrl).toContain('MIN0120');
    expect(product.name).toBe('Gold Bullion Bars');
  });
});
