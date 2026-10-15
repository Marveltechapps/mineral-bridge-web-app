import { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useSliceOf } from '@/store/useSliceOf';
import { CATALOG_KEYS, TRADE_KEYS } from '@/store/slices';
import { initialState, type AppState } from '@/store/appState';

/**
 * `useSliceOf` is what makes the slice split worth having: it must hand back the
 * *same* object when the fields it projects have not changed, so an unrelated
 * state change does not re-render that slice's consumers.
 */
describe('useSliceOf', () => {
  it('keeps the same object identity while its own fields do not change', () => {
    const seen: object[] = [];

    function Probe() {
      const [state, setState] = useState<AppState>(initialState);
      const trade = useSliceOf(state, TRADE_KEYS);
      seen.push(trade);
      return (
        <button onClick={() => setState((s) => ({ ...s, query: s.query + 'x' }))}>
          change catalog
        </button>
      );
    }

    render(<Probe />);
    const first = seen[0];

    act(() => {
      screen.getByRole('button').click();
    });

    expect(seen.length).toBeGreaterThan(1);
    // A catalog change must not produce a new trade slice.
    for (const value of seen) expect(value).toBe(first);
  });

  it('returns a new object when one of its own fields changes', async () => {
    const seen: object[] = [];

    function Probe() {
      const [state, setState] = useState<AppState>(initialState);
      const catalog = useSliceOf(state, CATALOG_KEYS);
      seen.push(catalog);
      return (
        <button onClick={() => setState((s) => ({ ...s, query: s.query + 'x' }))}>
          change catalog
        </button>
      );
    }

    render(<Probe />);
    const first = seen[0];

    await userEvent.click(screen.getByRole('button'));

    expect(seen.at(-1)).not.toBe(first);
    expect((seen.at(-1) as { query: string }).query).toBe('x');
  });

  it('projects exactly the requested keys', () => {
    let projected: object | null = null;

    function Probe() {
      projected = useSliceOf(initialState, CATALOG_KEYS);
      return null;
    }

    render(<Probe />);
    expect(Object.keys(projected ?? {}).sort()).toEqual([...CATALOG_KEYS].sort());
  });
});
