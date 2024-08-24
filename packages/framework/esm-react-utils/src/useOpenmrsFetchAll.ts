/** @module @category UI */
import { useEffect } from 'react';
import { useServerInfinite, type UseServerInfiniteOptions, type UseServerInfiniteReturnObject } from './useOpenmrsInfinite';
import {
  type OpenMRSPaginatedResponse,
  openmrsServerPaginationHandlers,
  type ServerPaginationHandlers,
} from './useOpenmrsPagination';

export interface UseServerFetchAllOptions<R> extends UseServerInfiniteOptions<R> {
  /**
   * If true, the data of any page as soon as they are fetched.
   * This is useful when you want to display data as soon as possible, even if not all pages are fetched.
   * If false, the returned data will be undefined until all pages are fetched. This is useful when you want to
   * display all data at once or reduce the number of re-renders (to avoid confusing users).
   */
  partialData?: boolean;
}

/**
 * Most OpenMRS REST endpoints that return a list of objects, such as getAll or search, are server-side paginated.
 * This hook handles fetching results from all pages of a paginated OpenMRS REST endpoint.
 * @param url The URL of the paginated OpenMRS REST endpoint. Note that the `limit` GET param can be set to specify
 *            the page size; if not set, the page size defaults to the `webservices.rest.maxResultsDefault` value defined
 *            server-side.
 * @param partialData If true, the hook will return the data of any page as soon as they are fetched.
 *            This is useful when you want to display data as soon as possible, even if not all pages are fetched.
 *            If false, the returned data will be undefined until all pages are fetched. This is useful when you want to
 *            display all data at once or reduce the number of re-renders (to avoid confusing users).
 * @param fetcher The fetcher to use. Defaults to openmrsFetch
 * @returns a UseOpenmrsInfiniteReturnObject object
 */
export function useOpenmrsFetchAll<T>(
  url: string | URL,
  options: UseServerFetchAllOptions<OpenMRSPaginatedResponse<T>> = {},
): UseServerInfiniteReturnObject<T, OpenMRSPaginatedResponse<T>> {
  return useServerFetchAll<T, OpenMRSPaginatedResponse<T>>(url, openmrsServerPaginationHandlers, options);
}

export function useServerFetchAll<T, R>(
  url: string | URL,
  serverPaginationHandlers: ServerPaginationHandlers<T, R>,
  options: UseServerFetchAllOptions<R> = {},
): UseServerInfiniteReturnObject<T, R> {
  const response = useServerInfinite<T, R>(url, serverPaginationHandlers, options);
  const { hasMore, error, data, loadMore, isLoading } = response;

  useEffect(() => {
    if (hasMore && !error) {
      loadMore();
    }
  });

  if (options.partialData) {
    return response;
  } else {
    return {
      ...response,
      data: hasMore || error ? undefined : data,
      isLoading: isLoading || hasMore,
    };
  }
}
