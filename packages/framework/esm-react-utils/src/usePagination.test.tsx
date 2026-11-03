import React, { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, render, renderHook } from '@testing-library/react';
import { usePagination } from './usePagination';

function rows(length: number) {
  return Array.from({ length }, (_, i) => i);
}

describe('usePagination', () => {
  describe('callback identity', () => {
    it('keeps the same callbacks as the data grows', () => {
      const { result, rerender } = renderHook(({ data }) => usePagination(data, 20), {
        initialProps: { data: rows(50) },
      });

      const { goTo, goToNext, goToPrevious } = result.current;
      expect(result.current.totalPages).toBe(3);

      for (const length of [100, 150, 200, 250, 300, 350, 373]) {
        rerender({ data: rows(length) });
      }

      expect(result.current.totalPages).toBe(19);
      expect(result.current.goTo).toBe(goTo);
      expect(result.current.goToNext).toBe(goToNext);
      expect(result.current.goToPrevious).toBe(goToPrevious);
    });

    it('keeps the same callbacks as the page changes', () => {
      const { result } = renderHook(() => usePagination(rows(100), 20));

      const { goTo, goToNext, goToPrevious } = result.current;

      act(() => result.current.goTo(3));
      act(() => result.current.goToNext());
      act(() => result.current.goToPrevious());

      expect(result.current.currentPage).toBe(3);
      expect(result.current.goTo).toBe(goTo);
      expect(result.current.goToNext).toBe(goToNext);
      expect(result.current.goToPrevious).toBe(goToPrevious);
    });

    it('does not reset the page when a consumer effect depends on goTo', () => {
      // Mirrors the advanced patient search, where results accumulate in 50-row batches while an
      // effect keyed on `goTo` resets to page 1 — the shape that produced the reported snap-back.
      const { result, rerender } = renderHook(
        ({ data }) => {
          const pagination = usePagination(data, 20);
          const { goTo } = pagination;
          useEffect(() => {
            goTo(1);
          }, [goTo]);
          return pagination;
        },
        { initialProps: { data: rows(50) } },
      );

      act(() => result.current.goTo(2));
      expect(result.current.currentPage).toBe(2);

      for (const length of [100, 150, 200, 250, 300, 350, 373]) {
        rerender({ data: rows(length) });
      }

      expect(result.current.currentPage).toBe(2);
      expect(result.current.results).toEqual(rows(40).slice(20));
    });
  });

  describe('clamping', () => {
    it('clamps the page and results when the data shrinks', () => {
      const { result, rerender } = renderHook(({ data }) => usePagination(data, 20), {
        initialProps: { data: rows(100) },
      });

      act(() => result.current.goTo(5));
      expect(result.current.currentPage).toBe(5);
      expect(result.current.results).toEqual(rows(100).slice(80));

      rerender({ data: rows(10) });

      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.results).toEqual(rows(10));
      expect(result.current.showPreviousButton).toBe(false);
    });

    it('clamps to page 1 when the data empties', () => {
      const { result, rerender } = renderHook(({ data }) => usePagination(data, 20), {
        initialProps: { data: rows(100) },
      });

      act(() => result.current.goTo(4));
      rerender({ data: [] });

      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.results).toEqual([]);
    });

    it('never goes below page 1', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { result } = renderHook(() => usePagination(rows(100), 20));

      act(() => result.current.goTo(0));
      expect(result.current.currentPage).toBe(1);

      act(() => result.current.goTo(-5));
      expect(result.current.currentPage).toBe(1);

      act(() => result.current.goToPrevious());
      expect(result.current.currentPage).toBe(1);
      warn.mockRestore();
    });

    it('rejects a non-integer page rather than letting NaN through', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { result } = renderHook(() => usePagination(rows(100), 20));

      act(() => result.current.goTo(Number('nope')));
      expect(result.current.currentPage).toBe(1);
      expect(result.current.results).toEqual(rows(20));
      expect(warn).toHaveBeenCalled();

      act(() => result.current.goTo(2.5));
      expect(result.current.currentPage).toBe(1);

      // the hook is still usable afterwards
      act(() => result.current.goTo(3));
      expect(result.current.currentPage).toBe(3);
      warn.mockRestore();
    });
  });

  describe('out-of-range requests do not linger', () => {
    it('does not follow the tail of a growing data set after an out-of-range goTo', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { result, rerender } = renderHook(({ data }) => usePagination(data, 20), {
        initialProps: { data: rows(60) },
      });

      act(() => result.current.goTo(999));
      expect(result.current.currentPage).toBe(3);

      rerender({ data: rows(200) });
      expect(result.current.currentPage).toBe(3);

      rerender({ data: rows(2000) });
      expect(result.current.currentPage).toBe(3);
      warn.mockRestore();
    });

    it('does not advance later when Next is pressed at the last page and the data then grows', () => {
      const { result, rerender } = renderHook(({ data }) => usePagination(data, 20), {
        initialProps: { data: rows(60) },
      });

      act(() => result.current.goTo(3));
      expect(result.current.showNextButton).toBe(false);

      act(() => result.current.goToNext());
      expect(result.current.currentPage).toBe(3);

      rerender({ data: rows(100) });
      expect(result.current.currentPage).toBe(3);
    });

    it('does not restore an old page when the data shrinks and grows again', () => {
      const { result, rerender } = renderHook(({ data }) => usePagination(data, 20), {
        initialProps: { data: rows(380) },
      });

      act(() => result.current.goTo(19));
      rerender({ data: rows(40) });
      expect(result.current.currentPage).toBe(2);

      rerender({ data: rows(380) });
      expect(result.current.currentPage).toBe(2);
    });
  });

  describe('stepping', () => {
    it('holds the last page when Next is pressed at the end, and Previous then moves one page', () => {
      const { result } = renderHook(() => usePagination(rows(60), 20));

      act(() => result.current.goTo(3));
      expect(result.current.currentPage).toBe(3);
      expect(result.current.showNextButton).toBe(false);

      act(() => result.current.goToNext());
      expect(result.current.currentPage).toBe(3);

      act(() => result.current.goToNext());
      expect(result.current.currentPage).toBe(3);

      act(() => result.current.goToPrevious());
      expect(result.current.currentPage).toBe(2);
    });

    it('moves Previous one page from what is displayed after a large shrink', () => {
      const { result, rerender } = renderHook(({ data }) => usePagination(data, 20), {
        initialProps: { data: rows(380) },
      });

      act(() => result.current.goTo(19));
      expect(result.current.currentPage).toBe(19);

      rerender({ data: rows(40) });
      expect(result.current.currentPage).toBe(2);

      act(() => result.current.goToPrevious());
      expect(result.current.currentPage).toBe(1);
    });

    // Batching the two calls into one commit is what distinguishes stepping from the latest queued page
    // from stepping from a page captured when the callback was created; the latter is a commit behind.
    it('steps from the latest queued page when batched with a goTo', () => {
      const { result } = renderHook(() => usePagination(rows(200), 20));
      const { goTo, goToNext } = result.current;

      act(() => {
        goTo(3);
        goToNext();
      });

      expect(result.current.currentPage).toBe(4);
    });

    it('steps back from the latest queued page when batched with a goTo', () => {
      const { result } = renderHook(() => usePagination(rows(200), 20));
      const { goTo, goToPrevious } = result.current;

      act(() => {
        goTo(5);
        goToPrevious();
      });

      expect(result.current.currentPage).toBe(4);
    });

    it('steps correctly when called from a child effect during a shrink', () => {
      const seen: Array<number> = [];
      const box: { goTo?: (n: number) => void } = {};
      let armed = false;

      function Child({ onPrev }: { onPrev: () => void }) {
        useEffect(() => {
          if (armed) {
            armed = false;
            onPrev();
          }
        });
        return null;
      }

      function Parent({ data }: { data: Array<number> }) {
        const { currentPage, goTo, goToPrevious } = usePagination(data, 20);
        seen.push(currentPage);
        box.goTo = goTo;
        return <Child onPrev={goToPrevious} />;
      }

      const { rerender } = render(<Parent data={rows(380)} />);
      act(() => box.goTo!(19));
      expect(seen[seen.length - 1]).toBe(19);

      // the data shrinks to 2 pages and Previous is pressed in that same commit
      armed = true;
      rerender(<Parent data={rows(40)} />);

      expect(seen[seen.length - 1]).toBe(1);
    });
  });

  describe('returned shape', () => {
    it('paginates and reports flags as before', () => {
      const { result } = renderHook(() => usePagination(rows(45), 20));

      expect(result.current.totalPages).toBe(3);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.paginated).toBe(true);
      expect(result.current.showNextButton).toBe(true);
      expect(result.current.showPreviousButton).toBe(false);
      expect(result.current.results).toEqual(rows(20));

      act(() => result.current.goToNext());
      expect(result.current.results).toEqual(rows(40).slice(20));
      expect(result.current.showPreviousButton).toBe(true);

      act(() => result.current.goToNext());
      expect(result.current.results).toEqual(rows(45).slice(40));
      expect(result.current.showNextButton).toBe(false);
    });

    it('is not paginated when the data fits on one page', () => {
      const { result } = renderHook(() => usePagination(rows(5), 20));

      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginated).toBe(false);
      expect(result.current.results).toEqual(rows(5));
    });

    // Characterises a long-standing quirk rather than endorsing it: an unusable `resultsPerPage` reports
    // a single page but slices no rows out of it, so the caller gets an empty list with no diagnostic.
    it('reports one page and no results when resultsPerPage is not a usable number', () => {
      const { result } = renderHook(() => usePagination(rows(50), 0));

      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.results).toEqual([]);
    });
  });
});
