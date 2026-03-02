import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should return initial value and update after default delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });

    // Value should not update immediately
    expect(result.current).toBe('initial');

    // Advance by partial time, still shouldn't update
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');

    // Advance the rest of the 300ms default delay
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('updated');
  });

  it('should only emit the final value on rapid successive updates', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 1 },
    });

    rerender({ value: 2 });
    rerender({ value: 3 });
    rerender({ value: 4 });

    // Value should still be initial
    expect(result.current).toBe(1);

    // Advance full debounce delay
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe(4);
  });

  it('should respect custom delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'a', delay: 500 },
    });

    expect(result.current).toBe('a');

    rerender({ value: 'b', delay: 500 });

    // 300ms into the 500ms custom delay — should still be 'a'
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('a');

    // Remaining 200ms of the 500ms custom delay elapsed — should now be 'b'
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('b');
  });

  it('clears pending timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { rerender, unmount } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'start' },
    });

    rerender({ value: 'changed' });

    // Unmount before the debounce delay fires
    unmount();

    // The pending timeout should have been cleared on unmount
    expect(clearTimeoutSpy).toHaveBeenCalled();

    // Advancing time after unmount should not trigger any state updates
    act(() => {
      vi.advanceTimersByTime(300);
    });

    clearTimeoutSpy.mockRestore();
  });

  it('should preserve generic object typing and references correctly', () => {
    const initialObj = { id: 1, name: 'Test' };
    const updatedObj = { id: 1, name: 'Test Updated' };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce<{ id: number; name: string }>(value),
      { initialProps: { value: initialObj } },
    );

    expect(result.current).toEqual(initialObj);

    rerender({ value: updatedObj });
    expect(result.current).toEqual(initialObj);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(updatedObj);
    expect(result.current).toBe(updatedObj); // checks reference preservation
  });
});
