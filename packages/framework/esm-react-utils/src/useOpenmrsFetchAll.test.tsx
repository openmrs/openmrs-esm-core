import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOpenmrsFetchAll } from './useOpenmrsFetchAll';
import { type OpenMRSPaginatedResponse } from './useOpenmrsPagination';

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

describe('useOpenmrsFetchAll', () => {
  it('should render all rows on if number of rows < pageSize', async () => {
    const expectedRowCount = 17;
    const { result } = renderHook(() =>
      useOpenmrsFetchAll(`http://localhost/1`, {
        fetcher: (url) => getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(result.current.totalCount).toEqual(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, 17));
  });

  it('should render all rows on if number of rows > pageSize with no partialData', async () => {
    const expectedRowCount = 150;
    const { result } = renderHook(() =>
      useOpenmrsFetchAll(`http://localhost/2`, {
        fetcher: (url) => getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(result.current.totalCount).toEqual(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, expectedRowCount));
  });
});
