import { describe, expect, it, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLayoutType, isDesktop } from './useLayoutType';

const BREAKPOINT_CLASSES = [
  'omrs-breakpoint-lt-tablet',
  'omrs-breakpoint-gt-tablet',
  'omrs-breakpoint-gt-small-desktop',
];

function renderWithLayoutClass(className?: string) {
  if (className) {
    document.body.classList.add(className);
  }
  return renderHook(() => useLayoutType());
}

describe('useLayoutType', () => {
  afterEach(() => {
    document.body.classList.remove(...BREAKPOINT_CLASSES);
  });

  it('returns tablet by default when no breakpoint classes are present', () => {
    const { result } = renderWithLayoutClass();
    expect(result.current).toBe('tablet');
  });

  it.each([
    ['omrs-breakpoint-lt-tablet', 'phone'],
    ['omrs-breakpoint-gt-tablet', 'small-desktop'],
    ['omrs-breakpoint-gt-small-desktop', 'large-desktop'],
  ])('maps %s to %s', (className, expectedLayout) => {
    const { result } = renderWithLayoutClass(className);
    expect(result.current).toBe(expectedLayout);
  });

  it('updates layout when resize event is dispatched', () => {
    const { result, unmount } = renderHook(() => useLayoutType());

    expect(result.current).toBe('tablet');

    document.body.classList.add('omrs-breakpoint-lt-tablet');

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('phone');

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
  it.each([
    ['phone', false],
    ['tablet', false],
    ['small-desktop', true],
    ['large-desktop', true],
  ])('returns %s for %s', (layout, expected) => {
    expect(isDesktop(layout as any)).toBe(expected);
  });
});
