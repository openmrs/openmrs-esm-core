import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  const DEFAULT_DELAY = 300;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns the initial value and updates it after the default delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    // Immediately returns initial value
    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });

    // Should not update synchronously
    expect(result.current).toBe('initial');

    // Advance part of the debounce interval
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');

    // Advance remaining time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('updated');
  });

  it('emits only the last value during rapid successive updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 1 } }
    );

    rerender({ value: 2 });
    rerender({ value: 3 });
    rerender({ value: 4 });

    // No update should occur until delay completes
    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(DEFAULT_DELAY);
    });

    expect(result.current).toBe(4);
  });

  it('respects a custom delay value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    );

    expect(result.current).toBe('a');

    rerender({ value: 'b', delay: 500 });

    // Advancing less than custom delay should not update
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('a');

    // Advance remaining time to reach 500ms total
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('b');
  });

  it('clears the pending timeout on unmount (verifies cleanup logic)', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'start' } }
    );

    rerender({ value: 'changed' });

    // Unmount before debounce delay completes
    unmount();

    // Ensure cleanup cleared the scheduled timeout
    expect(clearTimeoutSpy).toHaveBeenCalled();

    // Advancing timers should not cause state update warnings or errors
    expect(() => {
      act(() => {
        vi.advanceTimersByTime(DEFAULT_DELAY);
      });
    }).not.toThrow();
  });

  it('preserves generic typing and reference identity after debounce', () => {
    const initialObj = { id: 1, name: 'Test' };
    const updatedObj = { id: 1, name: 'Test Updated' };

    const { result, rerender } = renderHook(
      ({ value }) =>
        useDebounce<{ id: number; name: string }>(value),
      { initialProps: { value: initialObj } }
    );

    // Initially returns original reference
    expect(result.current).toBe(initialObj);

    rerender({ value: updatedObj });

    // Still old reference until delay completes
    expect(result.current).toBe(initialObj);

    act(() => {
      vi.advanceTimersByTime(DEFAULT_DELAY);
    });

    // After debounce completes, reference should match new object
    expect(result.current).toBe(updatedObj);
  });
});
