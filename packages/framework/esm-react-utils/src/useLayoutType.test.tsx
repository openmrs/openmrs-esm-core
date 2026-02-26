import { describe, expect, it, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLayoutType, isDesktop } from './useLayoutType';

describe('useLayoutType', () => {
  afterEach(() => {
    document.body.classList.remove(
      'omrs-breakpoint-lt-tablet',
      'omrs-breakpoint-gt-tablet',
      'omrs-breakpoint-gt-small-desktop',
    );
  });

  it('should return default layout (tablet) when no breakpoint classes are present', () => {
    const { result } = renderHook(() => useLayoutType());
    expect(result.current).toBe('tablet');
  });

  it('should return phone layout when `omrs-breakpoint-lt-tablet` class is present', () => {
    document.body.classList.add('omrs-breakpoint-lt-tablet');
    const { result } = renderHook(() => useLayoutType());
    expect(result.current).toBe('phone');
  });

  it('should return small-desktop layout when `omrs-breakpoint-gt-tablet` class is present', () => {
    document.body.classList.add('omrs-breakpoint-gt-tablet');
    const { result } = renderHook(() => useLayoutType());
    expect(result.current).toBe('small-desktop');
  });

  it('should return large-desktop layout when `omrs-breakpoint-gt-small-desktop` class is present', () => {
    document.body.classList.add('omrs-breakpoint-gt-small-desktop');
    const { result } = renderHook(() => useLayoutType());
    expect(result.current).toBe('large-desktop');
  });

  it('should update state when window resize event is dispatched and body class changes', () => {
    const { result, unmount } = renderHook(() => useLayoutType());

    // Initially tablet
    expect(result.current).toBe('tablet');

    // Change to phone breakpoint
    document.body.classList.add('omrs-breakpoint-lt-tablet');

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('phone');

    // Change to large-desktop breakpoint
    document.body.classList.remove('omrs-breakpoint-lt-tablet');
    document.body.classList.add('omrs-breakpoint-gt-small-desktop');

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('large-desktop');

    unmount();
  });
});

describe('isDesktop', () => {
  it('should correctly identify desktop layouts', () => {
    expect(isDesktop('phone')).toBe(false);
    expect(isDesktop('tablet')).toBe(false);
    expect(isDesktop('small-desktop')).toBe(true);
    expect(isDesktop('large-desktop')).toBe(true);
  });
});
