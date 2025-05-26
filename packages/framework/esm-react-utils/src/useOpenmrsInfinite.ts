/** @module @category UI */
import { type FetchResponse, openmrsFetch } from '@openmrs/esm-api';
import { useCallback } from 'react';
import useSWRInfinite, { type SWRInfiniteConfiguration, type SWRInfiniteResponse } from 'swr/infinite';
import {
  openmrsServerPaginationHandlers,
  type ServerPaginationHandlers,
  type OpenMRSPaginatedResponse,
} from './useOpenmrsPagination';

// "swr/infinite" doesn't export InfiniteKeyedMutator directly
type InfiniteKeyedMutator<T> = SWRInfiniteResponse<T extends (infer I)[] ? I : T>['mutate'];

export interface UseServerInfiniteOptions<R> {
  /**
   * The fetcher to use. Defaults to openmrsFetch
   */
  fetcher?: (key: string) => Promise<FetchResponse<R>>;

  /**
   * If true, sets these options in swrInfintieConfig to false:
   * revalidateIfStale, revalidateOnFocus, revalidateOnReconnect
   * This should be the counterpart of using useSWRImmutable` for `useSWRInfinite`
   */
  immutable?: boolean;

  swrInfiniteConfig?: SWRInfiniteConfiguration;
}

export interface UseServerInfiniteReturnObject<T, R> {
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
  mutate: InfiniteKeyedMutator<FetchResponse<R>[]>;

  /**
   * from useSWRInfinite
   */
  isValidating: boolean;

  /**
   * from useSWRInfinite
   */
  isLoading: boolean;
  /**
   * from useSWRInfinite
   */
  nextUri: string | null;
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
 * provide infinite loading / scrolling of results. Unlike `useOpenmrsPagination`, this hook does not allow random access
 * (and lazy-loading) of any arbitrary page; rather, it fetches pages sequentially starting form the initial page, and the next page
 * is fetched by calling `loadMore`. See: https://swr.vercel.app/docs/pagination#useswrinfinite
 *
 * @see `useOpenmrsPagination`
 * @see `useOpenmrsFetchAll`
 * @see `useFhirInfinite`
 *
 * @param url The URL of the paginated rest endpoint. Note that the `limit` GET param can be set to specify
 *            the page size; if not set, the page size defaults to the `webservices.rest.maxResultsDefault` value defined
 *            server-side.
 *            Similar to useSWRInfinite, this param can be null to disable fetching.
 * @param options The options object
 * @returns a UseServerInfiniteReturnObject object
 */
export function useOpenmrsInfinite<T>(
  url: string | URL,
  options: UseServerInfiniteOptions<OpenMRSPaginatedResponse<T>> = {},
): UseServerInfiniteReturnObject<T, OpenMRSPaginatedResponse<T>> {
  return useServerInfinite<T, OpenMRSPaginatedResponse<T>>(url, openmrsServerPaginationHandlers, options);
}

export function useServerInfinite<T, R>(
  url: string | URL,
  serverPaginationHandlers: ServerPaginationHandlers<T, R>,
  options: UseServerInfiniteOptions<R> = {},
): UseServerInfiniteReturnObject<T, R> {
  const { swrInfiniteConfig, immutable } = options;
  const { getNextUrl, getTotalCount, getData } = serverPaginationHandlers;
  const fetcher: (key: string) => Promise<FetchResponse<R>> = options.fetcher ?? openmrsFetch;
  const getKey = useCallback(
    (pageIndex: number, previousPageData: FetchResponse<R>): string | null => {
      if (pageIndex == 0) {
        return url?.toString() ?? null;
      } else {
        return serverPaginationHandlers.getNextUrl(previousPageData.data);
      }
    },
    [url],
  );

  const { data, size, setSize, ...rest } = useSWRInfinite<FetchResponse<R>>(getKey, fetcher, {
    ...swrInfiniteConfig,
    // `useSWR` has a useSWRImmutable counterpart, but `useSWRInfinite` does not seem to.
    // Setting the revalidate params manually if immutable is true, see: https://swr.vercel.app/docs/revalidation
    ...(immutable
      ? {
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }
      : {}),
  });
  const nextUri = getNextUrl(data?.[data.length - 1].data);

  const hasMore = nextUri != null;
  const loadMore = () => {
    setSize((data?.length ?? 0) + 1);
  };
  const totalCount = getTotalCount(data?.[0]?.data);

  return {
    data: data?.flatMap((d) => getData(d.data) as T[]),
    totalCount,
    hasMore,
    loadMore,
    nextUri,
    ...rest,
  };
}
