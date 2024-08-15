/** @module @category UI */
import { type FetchResponse, openmrsFetch } from '@openmrs/esm-api';
import useSWRInfinite from 'swr/infinite';
import { type OpenMRSPaginatedResponse } from './useServerPagination';
import { type KeyedMutator } from 'swr';
import { useCallback } from 'react';

export interface UseServerInfiniteReturnObject<T> {
  /**
   * The data fetched from the server so far. Note that this array contains
   * the aggregate of data from all fetched pages. Unless hasMore == false,
   * this array does not contain the complete data set.
   */
  data: T[] | undefined;

  /**
   * The total number of rows in the data set.
   */
  totalCount: number | undefined;

  /**
   * Whether there are more results in the data set that have not been fetched yet.
   */
  hasMore: boolean;

  /**
   * callback function to make another fetch of next page's data set.
   */
  loadMore: () => void;

  /**
   * from useSWRInfinite
   */
  error: any;

  /**
   * from useSWRInfinite
   */
  mutate: KeyedMutator<FetchResponse<OpenMRSPaginatedResponse<T>>[]>;

  /**
   * from useSWRInfinite
   */
  isValidating: boolean;

  /**
   * from useSWRInfinite
   */
  isLoading: boolean;
}

/**
 * Most REST endpoints that return a list of objects, such as getAll or search, are server-side paginated.
 * The server limits the max number of results being returned, and multiple requests are needed to get the full data set
 * if its size exceeds this limit.
 * The max number of results per request is configurable server-side
 * with the key "webservices.rest.maxResultsDefault". See: https://openmrs.atlassian.net/wiki/spaces/docs/pages/25469882/REST+Module
 *
 * This hook fetches data from a paginated rest endpoint, initially by fetching the first page of the results.
 * It provides a callback to load data from subsequent pages as needed. This hook is intended to serve UIs that
 * provide infinite loading / scrolling of results.
 *
 * While not ideal, this hook can be used to fetch the complete data set of results (from all pages) as follows:
 *
 *      useEffect(() => hasMore && loadMore(), [hasMore])
 *
 * The above should only be used when there is a need to fetch the complete data set onto the client side (ex:
 * need to support client-side sorting or filtering of data).
 *
 * @see `useServerPagination` for lazy-loading paginated data`
 *
 * @param url The URL of the paginated rest endpoint. Note that the `limit` GET param can be set to specify
 *            the page size; if not set, the page size defaults to the `webservices.rest.maxResultsDefault` value defined
 *            server-side.
 * @param fetcher The fetcher to use. Defaults to openmrsFetch
 * @returns a UseServerInfiniteReturnObject object
 */
export function useServerInfinite<T>(
  url: string | URL,
  fetcher: (key: string) => Promise<FetchResponse<OpenMRSPaginatedResponse<T>>> = openmrsFetch,
): UseServerInfiniteReturnObject<T> {
  const getNextUri = useCallback((data: FetchResponse<OpenMRSPaginatedResponse<T>>) => {
    return data?.data?.links?.find((link) => link.rel == 'next');
  }, []);

  const getKey = useCallback((pageIndex: number, previousPageData: FetchResponse<OpenMRSPaginatedResponse<T>>) => {
    if (pageIndex == 0) {
      return url;
    } else {
      return getNextUri(previousPageData)?.uri ?? null;
    }
  }, []);

  const { data, size, setSize, ...rest } = useSWRInfinite<FetchResponse<OpenMRSPaginatedResponse<T>>>(getKey, fetcher);
  const nextUri = data?.[data.length - 1].data?.links?.find((link) => link.rel == 'next');

  const hasMore = nextUri != null;
  const loadMore = () => {
    setSize(size + 1);
  };
  const totalCount = data?.[0]?.data?.totalCount;

  return {
    data: data?.flatMap((d) => d.data.results),
    totalCount,
    hasMore,
    loadMore,
    ...rest,
  };
}
