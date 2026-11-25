/**
 * BUG-004: zero tracked stock must show as available on request, not sold out.
 */
import type { ProductCard } from '../../src/api/types';
import { lotAvailabilityLabel, mapProduct } from '../../src/lib/mappers';

const baseCard = (over: Partial<ProductCard>): ProductCard => ({
  id: 'pid-1',
  reference: 'REF-1',
  productRef: 'REF-1',
  name: 'Gold dore',
  type: { slug: 'gold-dore', name: 'Gold doré' },
  categorySlug: 'precious',
  subcategorySlug: null,
  productFormSlug: null,
  productFormName: 'Doré bar',
  imageName: null,
  mineralCode: 'AU',
  purity: null,
  grade: '99.5%',
  origin: { country: 'GH' },
  seller: { name: 'Seller', verified: true },
  assured: false,
  verified: false,
  status: 'active',
  imageUrl: null,
  gradient: null,
  availability: {
    available: { value: 0, unit: 'g', grams: 0 },
    minOrder: { value: 10, unit: 'g', grams: 10 },
    step: { value: 1, unit: 'g', grams: 1 },
  },
  pricePerGram: { amount: 100, currency: 'USD' },
  createdAt: '2026-01-01T00:00:00.000Z',
  soldOut: false,
  availableOnRequest: true,
  inventoryTracked: false,
  ...over,
});

describe('BUG-004: catalogue availability mapping', () => {
  it('BUG-004: maps API on-request lot as not sold out', () => {
    const p = mapProduct(baseCard({ soldOut: false, availableOnRequest: true }));
    expect(p.soldOut).toBe(false);
    expect(p.availableOnRequest).toBe(true);
    expect(lotAvailabilityLabel(p)).toBe('Available on request');
  });

  it('BUG-004: sold out from API stays unavailable', () => {
    const p = mapProduct(
      baseCard({
        soldOut: true,
        availableOnRequest: false,
        status: 'sold',
        availability: { available: { value: 0, unit: 'g', grams: 0 }, minOrder: { value: 1, unit: 'g', grams: 1 }, step: { value: 1, unit: 'g', grams: 1 } },
      }),
    );
    expect(p.soldOut).toBe(true);
    expect(lotAvailabilityLabel(p)).toBe('Unavailable');
  });

  it('BUG-004 neighbouring: tracked stock label unchanged', () => {
    const p = mapProduct(
      baseCard({
        soldOut: false,
        availableOnRequest: false,
        inventoryTracked: true,
        availability: {
          available: { value: 12, unit: 'kg', grams: 12_000 },
          minOrder: { value: 1, unit: 'kg', grams: 1000 },
          step: { value: 1, unit: 'g', grams: 1 },
        },
      }),
    );
    expect(lotAvailabilityLabel(p)).toMatch(/12.*available/);
  });
});