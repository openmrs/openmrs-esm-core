import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLayoutType, isDesktop, type LayoutType } from './useLayoutType';

const LAYOUT_CASES: Array<[string, LayoutType]> = [
  ['omrs-breakpoint-lt-tablet', 'phone'],
  ['omrs-breakpoint-gt-tablet', 'small-desktop'],
  ['omrs-breakpoint-gt-small-desktop', 'large-desktop'],
];

const ALL_BREAKPOINT_CLASSES = LAYOUT_CASES.map(([className]) => className);

function setBreakpoint(className?: string) {
  document.body.classList.remove(...ALL_BREAKPOINT_CLASSES);
  if (className) {
    document.body.classList.add(className);
  }
}

function fireResize() {
  window.dispatchEvent(new Event('resize'));
}

describe('useLayoutType', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.classList.remove(...ALL_BREAKPOINT_CLASSES);
    vi.useRealTimers();
  });

  it('returns "tablet" by default when no breakpoint class is present', () => {
    const { result } = renderHook(() => useLayoutType());
    expect(result.current).toBe('tablet');
  });

  it.each(LAYOUT_CASES)('maps class "%s" to layout "%s" after resize', (className, expectedLayout) => {
    setBreakpoint(className);
    const { result } = renderHook(() => useLayoutType());
    expect(result.current).toBe(expectedLayout);
  });

  it('updates layout after debounce fires on resize', () => {
    const { result } = renderHook(() => useLayoutType());
    expect(result.current).toBe('tablet');

    act(() => {
      setBreakpoint('omrs-breakpoint-lt-tablet');
      fireResize();
    });
    // layout has not changed yet — debounce is pending
    expect(result.current).toBe('tablet');

    act(() => {
      vi.runAllTimers();
    });
    expect(result.current).toBe('phone');
  });

  it('debounces rapid resize events — only applies the last breakpoint', () => {
    const { result } = renderHook(() => useLayoutType());

    act(() => {
      setBreakpoint('omrs-breakpoint-lt-tablet');
      fireResize();
      setBreakpoint('omrs-breakpoint-gt-tablet');
      fireResize();
      setBreakpoint('omrs-breakpoint-gt-small-desktop');
      fireResize();
    });
    // still on the initial value before debounce settles
    expect(result.current).toBe('tablet');

    act(() => {
      vi.runAllTimers();
    });
    // only the last breakpoint state is applied
    expect(result.current).toBe('large-desktop');
  });

  it('falls back to "tablet" when all breakpoint classes are removed', () => {
    const { result } = renderHook(() => useLayoutType());

    act(() => {
      setBreakpoint('omrs-breakpoint-gt-tablet');
      fireResize();
      vi.runAllTimers();
    });
    expect(result.current).toBe('small-desktop');

    act(() => {
      setBreakpoint();
      fireResize();
      vi.runAllTimers();
    });
    expect(result.current).toBe('tablet');
  });

  it('cancels a pending debounce timeout when the hook unmounts', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { result, unmount } = renderHook(() => useLayoutType());

    act(() => {
      setBreakpoint('omrs-breakpoint-lt-tablet');
      fireResize();
      // debounce is now pending — do NOT run timers
    });
    // layout has not updated yet
    expect(result.current).toBe('tablet');

    unmount();

    // the pending timeout must have been cancelled on unmount
    expect(clearTimeoutSpy).toHaveBeenCalled();

    // running timers after unmount must not cause a state-update warning
    act(() => {
      vi.runAllTimers();
    });

    clearTimeoutSpy.mockRestore();
  });

  it('ignores unrelated window events', () => {
    const { result } = renderHook(() => useLayoutType());

    act(() => {
      setBreakpoint('omrs-breakpoint-lt-tablet');
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('click'));
      vi.runAllTimers();
    });

    // DOM changed but no resize fired — hook should not update
    expect(result.current).toBe('tablet');
  });
});

describe('isDesktop', () => {
  it.each<[LayoutType, boolean]>([
    ['phone', false],
    ['tablet', false],
    ['small-desktop', true],
    ['large-desktop', true],
  ])('returns %s for layout "%s"', (layout, expected) => {
    expect(isDesktop(layout)).toBe(expected);
  });
});
