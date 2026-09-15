import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { createGlobalStore } from '@openmrs/esm-state';
import { useStore, useStoreWithActions } from './useStore';

describe('useStore', () => {
  it('updates state, selects, and correctly binds actions', () => {
    const store = createGlobalStore('scoreboard', {
      good: { count: 0 },
      evil: { count: 0 },
    });
    const actions = {
      tally: (state, team, number) => ({
        [team]: { count: state[team].count + number },
      }),
    };

    const { result } = renderHook(() => useStore(store, (state) => state.good, actions));

    expect(result.current.count).toBe(0);
    act(() => {
      result.current.tally('good', 2);
    });
    expect(result.current.count).toBe(2);
  });
});

describe('useStore reference stability', () => {
  it('returns the store state itself when there are no actions to merge in', () => {
    const store = createGlobalStore('stability-plain', { renderings: new Map<string, number>() });
    const { result, rerender } = renderHook(() => useStore(store));

    // Not a copy: consumers of the extension renderings store depend on this, because the map
    // inside is mutated in place and only the state object around it changes identity.
    expect(result.current).toBe(store.getState());

    const before = result.current;
    rerender();
    expect(result.current).toBe(before);
  });

  it('keeps its reference across an unrelated re-render, so it can be a memo dependency', () => {
    const store = createGlobalStore('stability-memo', { a: 1, b: 2 });
    let memoRuns = 0;

    const { result, rerender } = renderHook(() => {
      const state = useStore(store);

      const derived = React.useMemo(() => ++memoRuns, [state]);
      return derived;
    });

    expect(memoRuns).toBe(1);
    rerender();
    expect(memoRuns).toBe(1);

    act(() => {
      store.setState({ a: 2 });
    });

    expect(memoRuns).toBe(2);
    expect(result.current).toBe(2);
  });
});

describe('useStoreWithActions', () => {
  it('should correctly bind actions', () => {
    const store = createGlobalStore('counter', { count: 0 });
    const actions = {
      increment: (state) => ({ count: state.count + 1 }),
      incrementBy: (state, number) => ({ count: state.count + number }),
    };

    const { result } = renderHook(() => useStoreWithActions(store, actions));

    expect(result.current.count).toBe(0);
    act(() => {
      result.current.increment();
    });
    expect(store.getState().count).toBe(1);
    expect(result.current.count).toBe(1);
    act(() => {
      result.current.incrementBy(3);
    });
    expect(result.current.count).toBe(4);
  });
});
