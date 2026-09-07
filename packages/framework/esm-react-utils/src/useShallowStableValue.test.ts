import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useShallowStableValue } from './useShallowStableValue';

describe('useShallowStableValue', () => {
  it('keeps its reference across an equal object literal', () => {
    const { result, rerender } = renderHook(({ value }) => useShallowStableValue(value), {
      initialProps: { value: { patientUuid: 'abc' } },
    });
    const first = result.current;

    rerender({ value: { patientUuid: 'abc' } });

    expect(result.current).toBe(first);
  });

  it('takes the new reference when a value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useShallowStableValue(value), {
      initialProps: { value: { patientUuid: 'abc' } },
    });
    const first = result.current;
    const next = { patientUuid: 'def' };

    rerender({ value: next });

    expect(result.current).not.toBe(first);
    expect(result.current).toBe(next);
  });

  it('takes the new reference when a key is added or removed', () => {
    const { result, rerender } = renderHook(({ value }) => useShallowStableValue(value), {
      initialProps: { value: { a: 1 } as Record<string, number> },
    });
    const first = result.current;

    rerender({ value: { a: 1, b: 2 } });
    expect(result.current).not.toBe(first);

    const both = result.current;
    rerender({ value: { a: 1 } });
    expect(result.current).not.toBe(both);
  });

  it('returns the latest of two equal values rather than the first one it ever saw', () => {
    const { result, rerender } = renderHook(({ value }) => useShallowStableValue(value), {
      initialProps: { value: { n: 1 } },
    });
    const first = result.current;

    rerender({ value: { n: 2 } });
    const third = { n: 1 };
    rerender({ value: third });

    // Equal to the first value, but the run of equal values was broken, so it is a new reference.
    expect(result.current).toBe(third);
    expect(result.current).not.toBe(first);
  });

  it('compares only one level deep', () => {
    const { result, rerender } = renderHook(({ value }) => useShallowStableValue(value), {
      initialProps: { value: { patient: { uuid: 'abc' } } },
    });
    const first = result.current;

    rerender({ value: { patient: { uuid: 'abc' } } });

    expect(result.current).not.toBe(first);
  });
});
