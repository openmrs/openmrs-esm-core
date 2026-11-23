/** @module @category UI */
import { useEffect, useMemo, useState } from 'react';
import useSWR, { useSWRConfig, type Cache } from 'swr';
import { type SWRInfiniteConfiguration } from 'swr/infinite';
import {
  useServerInfiniteInternal,
  type UseServerInfiniteOptions,
  type UseServerInfiniteReturnObject,
} from './useOpenmrsInfinite';
import {
  type OpenMRSPaginatedResponse,
  openmrsServerPaginationHandlers,
  type ServerPaginationHandlers,
} from './useOpenmrsPagination';

// Several widgets can consume the same collection. SWR deduplicates reads, but
// setSize is a mutation, so coordinate automatic expansion within its cache.
const pendingPageLoads = new WeakMap<Cache, Map<string, Promise<unknown>>>();

export interface UseServerFetchAllOptions<R> extends UseServerInfiniteOptions<R> {
  /**
   * If true, the data of any page is returned as soon as they are fetched.
   * This is useful when you want to display data as soon as possible, even if not all pages are fetched.
   * If false, the returned data will be undefined until all pages are fetched. This is useful when you want to
   * display all data at once or reduce the number of re-renders (to avoid confusing users).
   */
  partialData?: boolean;
}

/**
 * Most OpenMRS REST endpoints that return a list of objects, such as getAll or search, are server-side paginated.
 * This hook handles fetching results from *all* pages of a paginated OpenMRS REST endpoint, making multiple requests
 * as needed.
 * Global URL-prefix mutation refreshes mounted collections. Clearing matching cache data while unmounted
 * refreshes all pages on the next mount, unless mount revalidation is explicitly disabled.
 * The returned bound mutate retains SWR Infinite's page-array and per-page revalidation contract.
 *
 * @see `useOpenmrsPagination`
 * @see `useOpenmrsInfinite`
 * @see `useFhirFetchAll`
 *
 * @param url The URL of the paginated OpenMRS REST endpoint. Note that the `limit` GET param can be set to specify
 *            the page size; if not set, the page size defaults to the `webservices.rest.maxResultsDefault` value defined
 *            server-side.
 *            Similar to useSWRInfinite, this param can be null to disable fetching.
 * @param options The options object
 * @returns a UseOpenmrsInfiniteReturnObject object
 */
export function useOpenmrsFetchAll<T>(
  url: string | URL | null,
  options: UseServerFetchAllOptions<OpenMRSPaginatedResponse<T>> = {},
): UseServerInfiniteReturnObject<T, OpenMRSPaginatedResponse<T>> {
  return useServerFetchAll<T, OpenMRSPaginatedResponse<T>>(url, openmrsServerPaginationHandlers, options);
}

export function useServerFetchAll<T, R>(
  url: string | URL | null,
  serverPaginationHandlers: ServerPaginationHandlers<T, R>,
  options: UseServerFetchAllOptions<R> = {},
): UseServerInfiniteReturnObject<T, R> {
  const urlKey = url?.toString() ?? null;
  const config = useSWRConfig();
  const { cache } = config;
  const [expandingUrl, setExpandingUrl] = useState<string | null>(null);

  // SWR's filtered global mutate skips infinite aggregate keys. This ordinary
  // URL-prefixed entry forwards explicit refreshes without duplicating the data.
  // A null marker also records that an unmounted collection has not been
  // invalidated: mutate(key, undefined) clears it for the next mount.
  const refreshKey = urlKey ? `${urlKey}#openmrs-fetch-all` : null;
  const initializeMarker = !!refreshKey && cache.get(refreshKey) === undefined;
  const { data: refreshMarker, mutate: markRefreshed } = useSWR<null>(
    refreshKey,
    async (): Promise<null> => {
      await response.mutate();
      return null;
    },
    {
      revalidateOnMount: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      shouldRetryOnError: false,
      suspense: false,
      fallbackData: undefined,
      keepPreviousData: false,
      // The data-owning infinite hook handles callbacks and retries.
      onSuccess: () => {},
      onError: () => {},
      onLoadingSlow: () => {},
      onDiscarded: () => {},
    },
  );
  const wasInvalidated = !initializeMarker && refreshMarker === undefined;
  useEffect(() => {
    if (initializeMarker) {
      void markRefreshed(null, { revalidate: false });
    }
  }, [initializeMarker, markRefreshed]);

  const { response, loadMoreAsync, pages } = useServerInfiniteInternal<T, R>(url, serverPaginationHandlers, {
    ...options,
    swrInfiniteConfig: {
      ...options.swrInfiniteConfig,
      // Appending pages should not re-fetch page one. Restore SWR's default outside
      // expansion so focus, reconnect and remount revalidation keep working.
      revalidateFirstPage:
        options.swrInfiniteConfig?.revalidateFirstPage ??
        (config as SWRInfiniteConfiguration).revalidateFirstPage ??
        expandingUrl !== urlKey,
      revalidateAll:
        wasInvalidated ||
        (options.swrInfiniteConfig?.revalidateAll ?? (config as SWRInfiniteConfiguration).revalidateAll),
      revalidateOnMount:
        options.swrInfiniteConfig?.revalidateOnMount ?? config.revalidateOnMount ?? (wasInvalidated ? true : undefined),
      onSuccess: (data, key, swrConfig) => {
        // During an explicit refresh the bridge writes its own marker on success.
        // Mark ordinary loads here, after the fetch completes, including delayed remounts.
        if (refreshKey && !cache.get(refreshKey)?.isValidating) {
          void markRefreshed(null, { revalidate: false });
        }
        (options.swrInfiniteConfig?.onSuccess ?? config.onSuccess)?.(data, key, swrConfig);
      },
    },
  });
  const { hasMore, data, isLoading, isValidating, nextUri } = response;
  const repeatedNextLink =
    !!nextUri && !!pages?.slice(0, -1).some((page) => serverPaginationHandlers.getNextUrl(page.data) === nextUri);
  const paginationError = useMemo(
    () =>
      repeatedNextLink
        ? new Error('Cannot fetch the complete collection: pagination returned a repeated next link.')
        : undefined,
    [repeatedNextLink],
  );
  const error = response.error ?? paginationError;

  useEffect(() => {
    if (hasMore && !error && !isValidating && !wasInvalidated) {
      if (expandingUrl !== urlKey) {
        setExpandingUrl(urlKey);
      } else if (urlKey) {
        let pending = pendingPageLoads.get(cache);
        if (!pending) {
          pending = new Map();
          pendingPageLoads.set(cache, pending);
        }
        const pageKey = `${urlKey}\n${nextUri}`;
        if (!pending.has(pageKey)) {
          const request = loadMoreAsync()
            .catch(() => undefined)
            .finally(() => pending.delete(pageKey));
          pending.set(pageKey, request);
        }
      }
    } else if ((!hasMore || error) && expandingUrl !== null) {
      setExpandingUrl(null);
    }
  }, [hasMore, nextUri, error, isValidating, wasInvalidated, expandingUrl, urlKey, loadMoreAsync, cache]);

  if (options.partialData) {
    return { ...response, error };
  } else {
    return {
      ...response,
      error,
      data: hasMore || error ? undefined : data,
      isLoading: isLoading || (hasMore && !error),
    };
  }
}
