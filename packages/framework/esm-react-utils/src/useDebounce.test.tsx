import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial'));
    expect(result.current).toBe('initial');
  });

  it('updates value after default delay (300ms)', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'updated' });

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 400 },
    );
  });

  it('only emits final value on rapid updates', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 1 } },
    );

    rerender({ value: 2 });
    rerender({ value: 3 });
    rerender({ value: 4 });

    await waitFor(
      () => {
        expect(result.current).toBe(4);
      },
      { timeout: 400 },
    );
  });

  it('respects custom delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } },
    );

    rerender({ value: 'b', delay: 500 });

    await waitFor(
      () => {
        expect(result.current).toBe('b');
      },
      { timeout: 600 },
    );
  });

  it('preserves object reference identity', async () => {
    const updatedObj = { id: 1, name: 'Updated' };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: { id: 1, name: 'Initial' } } },
    );

    rerender({ value: updatedObj });

    await waitFor(
      () => {
        expect(result.current).toBe(updatedObj);
      },
      { timeout: 400 },
    );
  });
});
