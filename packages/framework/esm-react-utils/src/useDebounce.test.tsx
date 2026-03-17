import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('updates value after default delay', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), { initialProps: { value: 'initial' } });

    rerender({ value: 'updated' });

    expect(result.current).toBe('initial');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(result.current).toBe('updated');
  });

  it('emits only final value on rapid updates', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), { initialProps: { value: 1 } });

    rerender({ value: 2 });
    rerender({ value: 3 });
    rerender({ value: 4 });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(result.current).toBe(4);
  });

  it('clears timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { rerender, unmount } = renderHook(({ value }) => useDebounce(value), { initialProps: { value: 'start' } });

    // Trigger a value change to schedule a pending timeout,
    // so there is actually something to clean up on unmount
    rerender({ value: 'changed' });

    const callsBefore = clearTimeoutSpy.mock.calls.length;

    unmount();

    expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(callsBefore);
  });

  it('preserves reference identity', async () => {
    const updatedObj = { id: 1 };

    const { result, rerender } = renderHook(({ value }) => useDebounce(value), { initialProps: { value: { id: 0 } } });

    rerender({ value: updatedObj });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(result.current).toBe(updatedObj);
  });

  it('respects custom delay', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(result.current).toBe('initial');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    expect(result.current).toBe('updated');
  });
});
