import type { CSSProperties } from 'react';

/**
 * Turn a CSS declaration string into a React style object.
 *
 * The source design composes its styling as inline CSS strings built in its
 * logic layer (`'padding:9px 16px; border-radius:10px; …'`). Parsing those
 * strings rather than re-authoring them by hand is what keeps the port
 * pixel-identical: every declaration reaches the DOM exactly as designed.
 *
 * Results are cached because the same handful of style strings are rebuilt on
 * each render for every row, chip and card in a list.
 */
const cache = new Map<string, CSSProperties>();

/** `background-color` -> `backgroundColor`, `-webkit-appearance` -> `WebkitAppearance`. */
const toCamel = (prop: string): string => {
  const trimmed = prop.trim();
  if (trimmed.startsWith('--')) return trimmed;
  const leadingDash = trimmed.startsWith('-');
  const camel = (leadingDash ? trimmed.slice(1) : trimmed).replace(/-([a-z])/g, (_, c: string) =>
    c.toUpperCase(),
  );
  return leadingDash ? camel.charAt(0).toUpperCase() + camel.slice(1) : camel;
};

/**
 * Split on semicolons that separate declarations, ignoring any that sit inside
 * parentheses or quotes — `url("…;…")` and `linear-gradient(…)` must survive.
 */
const splitDeclarations = (input: string): string[] => {
  const out: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (quote) {
      if (ch === quote && input[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth += 1;
    } else if (ch === ')') {
      depth = Math.max(0, depth - 1);
    } else if (ch === ';' && depth === 0) {
      out.push(input.slice(start, i));
      start = i + 1;
    }
  }
  out.push(input.slice(start));
  return out;
};

export function css(style: string | undefined | null): CSSProperties {
  if (!style) return {};
  const cached = cache.get(style);
  if (cached) return cached;

  const result: Record<string, string> = {};
  for (const declaration of splitDeclarations(style)) {
    const separator = declaration.indexOf(':');
    if (separator === -1) continue;
    const prop = declaration.slice(0, separator);
    const value = declaration.slice(separator + 1).trim();
    if (!prop.trim() || !value) continue;
    result[toCamel(prop)] = value;
  }

  const frozen = result as CSSProperties;
  cache.set(style, frozen);
  return frozen;
}

/** Merge a design style string with extra React style properties. */
export const cssWith = (style: string | undefined | null, extra: CSSProperties): CSSProperties => ({
  ...css(style),
  ...extra,
});
