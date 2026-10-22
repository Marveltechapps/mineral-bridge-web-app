const GRAMS_PER_UNIT: Record<string, number> = {
  g: 1,
  kg: 1_000,
  t: 1_000_000,
  MT: 1_000_000,
  oz: 31.1034768,
  ct: 0.2,
};

function toGrams(value: number, unit: string): number | null {
  const factor = GRAMS_PER_UNIT[unit];
  if (!factor || !(value > 0)) return null;
  return value * factor;
}

function formatQuantity(value: number): string {
  const rounded = Number(value.toFixed(4));
  return String(rounded);
}

/** The same minimum, written in the unit the customer is ordering. */
export function minimumInUnit(
  minValue: number,
  minUnit: string,
  displayUnit: string,
): { value: number; unit: string } | null {
  const grams = toGrams(minValue, minUnit);
  const factor = GRAMS_PER_UNIT[displayUnit];
  if (grams == null || !factor) return null;
  return { value: Number((grams / factor).toFixed(4)), unit: displayUnit };
}

/** Why this quantity cannot be ordered, or null when it meets the lot minimum. */
export function minimumOrderWarning(
  quantity: number,
  quantityUnit: string,
  minValue?: number,
  minUnit?: string,
): string | null {
  if (minValue == null || !(minValue > 0) || !minUnit) return null;
  const requested = toGrams(quantity, quantityUnit);
  const minimum = toGrams(minValue, minUnit);
  if (requested == null || minimum == null || requested + 1e-6 >= minimum) return null;
  const shown = minimumInUnit(minValue, minUnit, quantityUnit);
  const minText = shown ? `${formatQuantity(shown.value)} ${shown.unit}` : `${minValue} ${minUnit}`;
  return `${formatQuantity(quantity)} ${quantityUnit} is below the minimum order of ${minText}. Increase the quantity to at least ${minText}.`;
}
