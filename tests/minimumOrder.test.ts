import { describe, expect, it } from 'vitest';
import { lotToProduct } from '@/features/catalog/services/catalogService';
import { minimumOrderWarning } from '@/features/product/minimumOrder';

describe('minimum order', () => {
  it('names the configured minimum when 20 g is below 50 g', () => {
    expect(minimumOrderWarning(20, 'g', 50, 'g')).toBe(
      '20 g is below the minimum order of 50 g. Increase the quantity to at least 50 g.',
    );
    expect(minimumOrderWarning(50, 'g', 50, 'g')).toBeNull();
    expect(minimumOrderWarning(0.05, 'kg', 50, 'g')).toBeNull();
  });

  it('compares carats with carats and prices a carat lot in carats', () => {
    expect(minimumOrderWarning(50, 'ct', 50, 'ct')).toBeNull();
    expect(minimumOrderWarning(50, 'ct', 50, 'g')).toBe(
      '50 ct is below the minimum order of 250 ct. Increase the quantity to at least 250 ct.',
    );
    const product = lotToProduct({
      id: 'prd_opal',
      title: 'Black Opal',
      listPrice: 4000,
      priceUnit: 'ct',
      unitPrice: { price: { amount: 400000, currency: 'USD' } },
      available: { value: 0, unit: 'ct' },
      minOrder: { value: 250, unit: 'ct' },
    });
    expect(product.price).toBe('$4,000.00');
    expect(product.unit).toBe('ct');
    expect(product.minOrderValue).toBe(250);
    expect(product.minOrderUnit).toBe('ct');
  });

  it('keeps the lot minimum on the product shown to the buyer', () => {
    const product = lotToProduct({
      id: 'prd_pVLKyi8zejYSnNAi',
      title: 'Gold Dore Bars',
      listPrice: 74,
      priceUnit: 'g',
      unitPrice: { price: { amount: 7400, currency: 'USD' } },
      available: { value: 0, unit: 'g' },
      minOrder: { value: 50, unit: 'g' },
    });

    expect(product.price).toBe('$74.00');
    expect(product.unit).toBe('g');
    expect(product.minOrderValue).toBe(50);
    expect(product.minOrderUnit).toBe('g');
    expect(product.availableValue).toBe(0);
  });
});
