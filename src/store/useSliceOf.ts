import { useRef } from 'react';

/**
 * Project a stable sub-object out of a larger one.
 *
 * The returned object keeps its identity until one of `keys` actually changes
 * value, so a slice context only hands consumers a new value when their own
 * fields move — a change to an unrelated field does not re-render them.
 *
 * `keys` must be a module-level constant (the `*_KEYS` arrays in
 * `@/store/slices`); it is read on every render but never watched for change.
 */
export function useSliceOf<T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Pick<T, K> {
  const ref = useRef<Pick<T, K> | null>(null);
  const previous = ref.current;

  if (previous !== null) {
    let changed = false;
    for (const key of keys) {
      if (previous[key] !== source[key]) {
        changed = true;
        break;
      }
    }
    if (!changed) return previous;
  }

  const next = {} as Pick<T, K>;
  for (const key of keys) next[key] = source[key];
  ref.current = next;
  return next;
}
