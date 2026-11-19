import type { CSSProperties } from 'react';
import type { ViewModel } from '../../types/platform';

const kebabToCamel = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** Turns an inline CSS declaration string into a React style object, the way the design runtime does. */
export function css(value: unknown): CSSProperties | undefined {
  if (value == null) return undefined;
  if (typeof value !== 'string') return value as CSSProperties;
  const out: Record<string, string> = {};
  for (const decl of value.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    out[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  return out as CSSProperties;
}

/** Renders a bound value as a string for a style property (null and undefined become empty). */
export function str(value: unknown): string {
  return value == null ? '' : String(value);
}

/** Loop source: anything that is not an array renders as an empty list. */
export function list(value: unknown): ViewModel[] {
  return Array.isArray(value) ? (value as ViewModel[]) : [];
}
