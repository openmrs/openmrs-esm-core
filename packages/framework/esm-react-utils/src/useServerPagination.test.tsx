import { renderHook, cleanup, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useServerPagination, type OpenMRSPaginatedResponse } from './useServerPagination';

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

describe('useServerPagination', () => {
  afterEach(cleanup);

  it('should render all rows on 1 page if number of rows < pageSize', async () => {
    const pageSize = 20;
    const expectedRowCount = 17;
    const { result } = renderHook(() =>
      useServerPagination('/1', pageSize, (url) =>
        getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      ),
    );
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(result.current.totalPages).toEqual(1);

    expect(result.current.currentPage).toEqual(1);
    expect(result.current.data?.length).toBe(expectedRowCount);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, 17));
  });

  it('should render 2 pages if pageSize < number of rows <= 2 * pageSize', async () => {
    const pageSize = 20;
    const expectedRowCount = 40;
    const { result } = renderHook(() =>
      useServerPagination('/2', pageSize, (url) =>
        getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      ),
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

  it('should render n pages for n >> 1', async () => {
    const pageSize = 20;
    const expectedRowCount = 1337;
    const expectedTotalPages = Math.ceil(expectedRowCount / pageSize);
    const { result } = renderHook(() =>
      useServerPagination('/3', pageSize, (url) =>
        getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      ),
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
});
