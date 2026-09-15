import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useOpenmrsPagination, type OpenMRSPaginatedResponse } from './useOpenmrsPagination';

// returns an sequentially increasing int array of specified length starting at the specified start integer.
export function getIntArray(start: number, length: number) {
  return new Array(length).fill(0).map((_, i) => start + i);
}

// This function mocks the return value of a server-side paginated API.
// It returns a slice (page) of the array of integers [0...totalCount-1],
// with the page defined  by the limit and startIndex in the url params.
export async function getTestData(url: string, totalCount: number): Promise<OpenMRSPaginatedResponse<number>> {
  const urlUrl = new URL(url, window.location.toString());
  const limit = Number.parseInt(urlUrl.searchParams.get('limit') ?? '50');
  const startIndex = Number.parseInt(urlUrl.searchParams.get('startIndex') ?? '0');

  const length = Math.max(0, Math.min(totalCount - startIndex, limit));
  const results = new Array(length).fill(0).map((_, i) => i + startIndex);
  const hasNext = startIndex + limit < totalCount;
  if (hasNext) {
    urlUrl.searchParams.set('startIndex', startIndex + limit + '');
  }
  const links = hasNext ? [{ rel: 'next', uri: urlUrl.toString() }] : [];
  return { results, links, totalCount } as OpenMRSPaginatedResponse<number>;
}

/** Whether any warning mentions `page`, so the exact wording stays free to change. */
function warned(warn: { mock: { calls: Array<Array<unknown>> } }, page: string) {
  return warn.mock.calls.some((call) => String(call[0]).includes(page));
}

describe('useOpenmrsPagination', () => {
  it('should not fetch anything if url is null', async () => {
    const { result } = renderHook(() =>
      useOpenmrsPagination(null as any, 50, {
        fetcher: (url) => getTestData(url, 100).then((data) => ({ data }) as any),
      }),
    );
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toBeUndefined();
  });

  it('should fetch all rows on 1 page if number of rows < pageSize', async () => {
    const pageSize = 20;
    const expectedRowCount = 17;
    const { result } = renderHook(() =>
      useOpenmrsPagination('http://localhost/1', pageSize, {
        fetcher: (url) => getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(result.current.totalPages).toEqual(1);

    expect(result.current.currentPage).toEqual(1);
    expect(result.current.data?.length).toBe(expectedRowCount);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, 17));
  });

  it('reports currentPageSize as a number, matching the rows on the current page', async () => {
    const pageSize = 20;
    const expectedRowCount = 50;
    const { result } = renderHook(() =>
      useOpenmrsPagination('http://localhost/page-size', pageSize, {
        fetcher: (url) => getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      }),
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(result.current.currentPageSize).toBe(20);

    // the last page is short, and the reported size follows it
    act(() => result.current.goTo(3));
    await waitFor(() => expect(result.current.currentPage).toBe(3));
    await waitFor(() => expect(result.current.currentPageSize).toBe(10));
  });

  it('should fetch 2 pages if pageSize < number of rows <= 2 * pageSize', async () => {
    const pageSize = 20;
    const expectedRowCount = 40;
    const { result } = renderHook(() =>
      useOpenmrsPagination('http://localhost/2', pageSize, {
        fetcher: (url) => getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      }),
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(result.current.totalPages).toEqual(2);

    expect(result.current.currentPage).toEqual(1);
    expect(result.current.data?.length).toBe(pageSize);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, 20));

    // go to next page (page 2)
    act(() => result.current.goToNext());
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.currentPage).toEqual(2);
    expect(result.current.data?.length).toBe(pageSize);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(20, 20));

    // go to previous page (page 1)
    act(() => result.current.goToPrevious());
    await waitFor(() => expect(result.current.isValidating).toBeFalsy());

    expect(result.current.currentPage).toEqual(1);
    expect(result.current.data?.length).toBe(pageSize);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, 20));
  });

  it('should fetch n pages for n >> 1', async () => {
    const pageSize = 20;
    const expectedRowCount = 1337;
    const expectedTotalPages = Math.ceil(expectedRowCount / pageSize);
    const { result } = renderHook(() =>
      useOpenmrsPagination('http://localhost/3', pageSize, {
        fetcher: (url) => getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      }),
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(result.current.totalPages).toEqual(expectedTotalPages);

    expect(result.current.currentPage).toEqual(1);
    expect(result.current.data?.length).toBe(pageSize);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, 20));

    // go to page 2
    act(() => result.current.goTo(2));
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.currentPage).toEqual(2);
    expect(result.current.data?.length).toBe(pageSize);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(20, 20));

    // go to next page (page 3)
    act(() => result.current.goToNext());
    await waitFor(() => expect(result.current.isValidating).toBeFalsy());

    expect(result.current.currentPage).toEqual(3);
    expect(result.current.data?.length).toBe(pageSize);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(40, 20));

    // go to last page
    act(() => result.current.goTo(expectedTotalPages));
    await waitFor(() => expect(result.current.isValidating).toBeFalsy());

    expect(result.current.currentPage).toEqual(expectedTotalPages);
    expect(result.current.data?.length).toBe(17);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(1320, 17));
  });

  describe('callback identity', () => {
    it('keeps the same callbacks when the total count arrives and when the page changes', async () => {
      const { result } = renderHook(() =>
        useOpenmrsPagination('http://localhost/identity', 20, {
          fetcher: (url) => getTestData(url, 1337).then((data) => ({ data }) as any),
        }),
      );

      // captured before any response, while totalCount is still NaN
      const { goTo, goToNext, goToPrevious } = result.current;
      expect(result.current.totalPages).toBeNaN();

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());
      expect(result.current.totalPages).toBe(67);

      act(() => result.current.goTo(4));
      await waitFor(() => expect(result.current.currentPage).toBe(4));

      act(() => result.current.goToNext());
      await waitFor(() => expect(result.current.currentPage).toBe(5));

      expect(result.current.goTo).toBe(goTo);
      expect(result.current.goToNext).toBe(goToNext);
      expect(result.current.goToPrevious).toBe(goToPrevious);
    });
  });

  describe('out of bounds navigation', () => {
    it('warns, stays put and issues no further request', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const fetcher = vi.fn((url: string) => getTestData(url, 40).then((data) => ({ data }) as any));

      const { result } = renderHook(() => useOpenmrsPagination('http://localhost/bounds', 20, { fetcher }));

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());
      expect(result.current.totalPages).toBe(2);

      const fetchCount = fetcher.mock.calls.length;

      act(() => result.current.goTo(999));
      act(() => result.current.goTo(0));

      expect(result.current.currentPage).toBe(1);
      // asserted as substrings so the wording can be improved without breaking these
      expect(warned(warn, '999')).toBe(true);
      expect(warned(warn, '0')).toBe(true);
      expect(fetcher.mock.calls.length).toBe(fetchCount);

      warn.mockRestore();
    });

    it('warns when going to the previous page from the first page', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useOpenmrsPagination('http://localhost/previous', 20, {
          fetcher: (url) => getTestData(url, 40).then((data) => ({ data }) as any),
        }),
      );

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      act(() => result.current.goToPrevious());

      expect(result.current.currentPage).toBe(1);
      expect(warned(warn, '0')).toBe(true);

      warn.mockRestore();
    });
  });

  describe('stepping', () => {
    // Batching the two calls into one commit is what distinguishes stepping from the page as it stands
    // from stepping from a page captured when the callback was created; the latter is a commit behind.
    it('steps from the latest requested page when batched with a goTo', async () => {
      const { result } = renderHook(() =>
        useOpenmrsPagination('http://localhost/batched-next', 20, {
          fetcher: (url) => getTestData(url, 200).then((data) => ({ data }) as any),
        }),
      );
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      const { goTo, goToNext } = result.current;
      act(() => {
        goTo(3);
        goToNext();
      });

      await waitFor(() => expect(result.current.isValidating).toBeFalsy());
      expect(result.current.currentPage).toBe(4);
      expect(result.current.data).toEqual(getIntArray(60, 20));
    });

    it('steps back from the latest requested page when batched with a goTo', async () => {
      const { result } = renderHook(() =>
        useOpenmrsPagination('http://localhost/batched-prev', 20, {
          fetcher: (url) => getTestData(url, 200).then((data) => ({ data }) as any),
        }),
      );
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      const { goTo, goToPrevious } = result.current;
      act(() => {
        goTo(5);
        goToPrevious();
      });

      await waitFor(() => expect(result.current.isValidating).toBeFalsy());
      expect(result.current.currentPage).toBe(4);
    });
  });

  describe('changing the url', () => {
    it('returns to page 1 and does not request the old offset against the new url', async () => {
      const urls: Array<string> = [];
      const fetcher = (url: string) => {
        urls.push(url);
        return getTestData(url, url.includes('wide') ? 1337 : 10).then((data) => ({ data }) as any);
      };

      const { result, rerender } = renderHook(({ url }) => useOpenmrsPagination(url, 20, { fetcher }), {
        initialProps: { url: 'http://localhost/search?q=wide' },
      });
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      act(() => result.current.goTo(5));
      await waitFor(() => expect(result.current.currentPage).toBe(5));

      rerender({ url: 'http://localhost/search?q=narrow' });
      await waitFor(() => expect(result.current.isValidating).toBeFalsy());

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalCount).toBe(10);
      expect(result.current.data).toEqual(getIntArray(0, 10));
      expect(urls.filter((u) => u.includes('narrow') && u.includes('startIndex=80'))).toEqual([]);
    });
  });

  describe('navigation before the first response', () => {
    it('applies a page requested while the total count is still unknown', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      let release: () => void;
      const firstResponse = new Promise<void>((resolve) => {
        release = resolve;
      });

      const { result } = renderHook(() =>
        useOpenmrsPagination('http://localhost/race', 20, {
          fetcher: async (url) => {
            await firstResponse;
            return { data: await getTestData(url, 1337) } as any;
          },
        }),
      );

      expect(result.current.totalCount).toBeNaN();
      expect(result.current.totalPages).toBeNaN();

      act(() => result.current.goTo(2));
      expect(result.current.currentPage).toBe(2);
      expect(warn).not.toHaveBeenCalled();

      release!();

      await waitFor(() => expect(result.current.data).toBeDefined());
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current.currentPage).toBe(2);
      expect(result.current.totalPages).toBe(67);
      expect(result.current.data).toEqual(getIntArray(20, 20));

      warn.mockRestore();
    });

    it('returns to the last real page when the requested one turns out not to exist', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      let release: () => void;
      const firstResponse = new Promise<void>((resolve) => {
        release = resolve;
      });

      const { result } = renderHook(() =>
        useOpenmrsPagination('http://localhost/strand', 20, {
          fetcher: async (url) => {
            await firstResponse;
            return { data: await getTestData(url, 40) } as any;
          },
        }),
      );

      act(() => result.current.goTo(999999));
      expect(result.current.currentPage).toBe(999999);

      release!();
      await waitFor(() => expect(result.current.totalPages).toBe(2));
      await waitFor(() => expect(result.current.currentPage).toBe(2));

      expect(result.current.data).toEqual(getIntArray(20, 20));
      expect(result.current.showPreviousButton).toBe(true);
      expect(warn).toHaveBeenCalled();

      // and the user is not stuck: navigation still works
      act(() => result.current.goToPrevious());
      await waitFor(() => expect(result.current.currentPage).toBe(1));

      warn.mockRestore();
    });

    it('rejects a non-integer page instead of putting NaN in the request url', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const urls: Array<string> = [];

      let release: () => void;
      const firstResponse = new Promise<void>((resolve) => {
        release = resolve;
      });

      const { result } = renderHook(() =>
        useOpenmrsPagination('http://localhost/nan', 20, {
          fetcher: async (url) => {
            urls.push(url);
            await firstResponse;
            return { data: await getTestData(url, 100) } as any;
          },
        }),
      );

      act(() => result.current.goTo(Number('nope')));
      expect(result.current.currentPage).toBe(1);
      expect(warn).toHaveBeenCalled();

      release!();
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(urls.some((u) => u.includes('startIndex=NaN'))).toBe(false);
      expect(result.current.currentPage).toBe(1);

      warn.mockRestore();
    });
  });

  describe('a server that reports no total count', () => {
    it('warns once and keeps navigation usable rather than silently dropping every request', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useOpenmrsPagination('http://localhost/nototal', 20, {
          fetcher: async (url) => {
            const u = new URL(url, window.location.toString());
            const startIndex = Number.parseInt(u.searchParams.get('startIndex') ?? '0');
            // no totalCount field, as a FHIR bundle without `total` would give
            return { data: { results: getIntArray(startIndex, 20), links: [] } } as any;
          },
        }),
      );

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());
      expect(result.current.totalCount).toBeNaN();

      await waitFor(() => expect(warn).toHaveBeenCalled());
      const missingTotalWarnings = warn.mock.calls.filter((c) => String(c[0]).includes('no total count'));
      expect(missingTotalWarnings).toHaveLength(1);

      // navigation still works, since there is no bound to check against
      act(() => result.current.goTo(3));
      await waitFor(() => expect(result.current.currentPage).toBe(3));

      warn.mockRestore();
    });
  });
});
