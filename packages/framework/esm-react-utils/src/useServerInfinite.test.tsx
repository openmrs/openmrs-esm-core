import '@testing-library/jest-dom';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { useServerInfinite } from './useServerInfinite';
import { getIntArray, getTestData } from './useServerPagination.test';

describe('useServerInfinite', () => {
  afterEach(cleanup);

  it('should load all rows with 1 fetch if number of rows < pageSize', async () => {
    const pageSize = 20;
    const expectedRowCount = 17;
    const { result } = renderHook(() =>
      useServerInfinite(`/1?limit=${pageSize}`, (url) =>
        getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      ),
    );
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.data?.length).toBe(expectedRowCount);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, 17));
    expect(result.current.hasMore).toBeFalsy();
  });

  it('should load all rows with 2 fetches if pageSize < number of rows <= 2 * pageSize', async () => {
    const pageSize = 20;
    const expectedRowCount = 40;
    const { result } = renderHook(() =>
      useServerInfinite(`/2?limit=${pageSize}`, (url) =>
        getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      ),
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(result.current.data?.length).toBe(pageSize);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, 20));
    expect(result.current.hasMore).toBeTruthy();

    // load more
    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.data?.length).toBe(expectedRowCount);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, 40));
    expect(result.current.hasMore).toBeFalsy();
  });

  it('should load all rows for n pages for n >> 1', async () => {
    const pageSize = 100;
    const expectedRowCount = 1337;
    const { result } = renderHook(() =>
      useServerInfinite(`/3?limit=${pageSize}`, (url) =>
        getTestData(url, expectedRowCount).then((data) => ({ data }) as any),
      ),
    );
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    // load everything
    while (result.current.hasMore) {
      act(() => result.current.loadMore());
      await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    }

    expect(result.current.data?.length).toBe(expectedRowCount);
    expect(result.current.totalCount).toBe(expectedRowCount);
    expect(result.current.data).toEqual(getIntArray(0, expectedRowCount));
  });
});
