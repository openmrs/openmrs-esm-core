import { renderHook, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import useAbortController from './useAbortController';

describe('useAbortController', () => {
  afterEach(cleanup);

  it('returns an AbortController', () => {
    const { result } = renderHook(() => useAbortController());
    expect(result.current).not.toBeNull();
  });

  it('returns a consistent AbortController across re-renders', () => {
    const { result, rerender } = renderHook(() => useAbortController());
    const firstAc = result.current;

    rerender();

    expect(result.current).toBe(firstAc);
  });

  it('returns a new AbortController after the previous controller has been aborted', () => {
    const { result, rerender } = renderHook(() => useAbortController());
    const firstAc = result.current;

    firstAc.abort();

    rerender();

    expect(result.current).not.toBe(firstAc);
  });

  it('aborts the AbortController when the component is unmounted', () => {
    const { result, unmount } = renderHook(() => useAbortController());

    expect(result.current.signal.aborted).toBe(false);

    unmount();

    expect(result.current.signal.aborted).toBe(true);
  });
});
