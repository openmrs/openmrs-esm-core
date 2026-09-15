import React, { useCallback } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, render, renderHook } from '@testing-library/react';
import { getVisitStore } from '@openmrs/esm-emr-api';
import { useVisitContextStore } from './useVisitContextStore';

/** Counts calls to `setState` on the visit store for the duration of `run`. */
function countStoreWrites(run: () => void) {
  const store = getVisitStore();
  const setState = store.setState;
  let writes = 0;
  store.setState = ((...args: Parameters<typeof setState>) => {
    writes++;
    return setState(...args);
  }) as typeof setState;

  try {
    run();
  } finally {
    store.setState = setState;
  }

  return writes;
}

describe('useVisitContextStore', () => {
  it('invokes every registered callback when mutateVisit is called', () => {
    const first = vi.fn();
    const second = vi.fn();

    const { result } = renderHook(() => useVisitContextStore(first));
    renderHook(() => useVisitContextStore(second));

    act(() => result.current.mutateVisit());

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('stops invoking a callback once its component unmounts', () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useVisitContextStore());
    const { unmount } = renderHook(() => useVisitContextStore(callback));

    act(() => result.current.mutateVisit());
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();
    act(() => result.current.mutateVisit());
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not write to the store when registering or unregistering a callback', () => {
    let unmount = () => {};

    const mountWrites = countStoreWrites(() => {
      unmount = renderHook(() => useVisitContextStore(() => {})).unmount;
    });
    expect(mountWrites).toBe(0);

    expect(countStoreWrites(unmount)).toBe(0);
  });

  it('does not write to the store when mutateVisit is called', () => {
    const { result } = renderHook(() => useVisitContextStore(() => {}));

    expect(countStoreWrites(() => act(() => result.current.mutateVisit()))).toBe(0);
  });

  it('keeps mutate callbacks out of the persisted store state', () => {
    renderHook(() => useVisitContextStore(() => {}));

    act(() => {
      getVisitStore().setState({ patientUuid: 'patient-123' });
    });

    const persisted = JSON.parse(window.sessionStorage.getItem('openmrs:visitStoreState') ?? '{}');
    expect(persisted).toEqual({ patientUuid: 'patient-123', manuallySetVisitUuid: null });
  });

  it('does not re-render already-mounted consumers as more consumers mount', () => {
    const renderCounts: Array<number> = [];

    // Memoized so that re-rendering the parent to add a row does not itself re-render the
    // existing rows; anything counted here came from the store notifying its subscribers.
    const Row = React.memo(function Row({ index }: { index: number }) {
      renderCounts[index] = (renderCounts[index] ?? 0) + 1;
      const mutate = useCallback(() => {}, []);
      useVisitContextStore(mutate);
      return null;
    });

    function Screen({ count }: { count: number }) {
      return (
        <>
          {Array.from({ length: count }, (_, index) => (
            <Row index={index} key={index} />
          ))}
        </>
      );
    }

    const rows = 15;
    const { rerender } = render(<Screen count={0} />);
    for (let count = 1; count <= rows; count++) {
      rerender(<Screen count={count} />);
    }

    // Each row should have rendered exactly once: mounting a row must not notify the rows
    // already on screen, or filling a screen of N rows costs O(N²) renders.
    expect(renderCounts).toEqual(Array.from({ length: rows }, () => 1));
  });

  it('re-renders consumers when the visit context itself changes', () => {
    const { result } = renderHook(() => useVisitContextStore());

    act(() => {
      result.current.setVisitContext({
        uuid: 'visit-1',
        patient: { uuid: 'patient-123' },
      } as Parameters<typeof result.current.setVisitContext>[0]);
    });

    expect(result.current.manuallySetVisitUuid).toBe('visit-1');
    expect(result.current.patientUuid).toBe('patient-123');
  });
});
