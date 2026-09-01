/** @module @category UI */
import { type FetchResponse, makeUrl, openmrsFetch } from '@openmrs/esm-api';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR, { type SWRConfiguration } from 'swr';
import useSWRImmutable from 'swr/immutable';

export interface OpenMRSPaginatedResponse<T> {
  results: Array<T>;
  links: Array<{ rel: 'prev' | 'next'; uri: string }>;
  totalCount: number;
}

export interface UseServerPaginationOptions<R> {
  /**
   * Whether to use useSWR or useSWRInfinite to fetch data
   */
  immutable?: boolean;

  /**
   * The fetcher to use. Defaults to openmrsFetch
   */
  fetcher?: (key: string) => Promise<FetchResponse<R>>;

  /**
   * The configuration object for useSWR or useSWRInfinite
   */
  swrConfig?: SWRConfiguration;
}

/**
 * Most OpenMRS REST endpoints that return a list of objects, such as getAll or search, are server-side paginated.
 * The server limits the max number of results being returned, and multiple requests are needed to get the full data set
 * if its size exceeds this limit.
 * The max number of results per request is configurable server-side
 * with the key "webservices.rest.maxResultsDefault". See: https://openmrs.atlassian.net/wiki/spaces/docs/pages/25469882/REST+Module
 *
 * For any UI that displays a paginated view of the full data set, we MUST handle the server-side pagination properly,
 * or else the UI does not correctly display the full data set.
 * This hook does that by providing callback functions for navigating to different pages of the results, and
 * lazy-loads the data on each page as needed.
 *
 * Note that this hook is not suitable for use for situations that require client-side sorting or filtering
 * of the data set. In that case, all data must be loaded onto client-side first.
 *
 * @see `useOpenmrsInfinite`
 * @see `useOpenmrsFetchAll`
 * @see `usePagination` for pagination of client-side data`
 * @see `useFhirPagination``
 *
 * @param url The URL of the paginated rest endpoint. \
 *            It should be populated with any needed GET params, except `limit`, `startIndex` or `totalCount`,
 *            which will be overridden and manipulated by the `goTo*` callbacks.
 *            Similar to useSWR, this param can be null to disable fetching.
 * @param pageSize The number of results to return per page / fetch. Note that this value MUST NOT exceed
 *            "webservices.rest.maxResultsAbsolute", which should be reasonably high by default (1000).
 * @param options The options object
 * @returns
 */
export function useOpenmrsPagination<T>(
  url: string | URL,
  pageSize: number,
  options: UseServerPaginationOptions<OpenMRSPaginatedResponse<T>> = {},
) {
  return useServerPagination<T, OpenMRSPaginatedResponse<T>>(url, pageSize, openmrsServerPaginationHandlers, options);
}

type OpenmrsServerPaginationHandlers<T> = ServerPaginationHandlers<T, OpenMRSPaginatedResponse<T>>;
export const openmrsServerPaginationHandlers: OpenmrsServerPaginationHandlers<any> = {
  getPaginatedUrl: (url: string | URL, limit: number, startIndex: number) => {
    if (url) {
      const urlUrl = new URL(makeUrl(url.toString()), window.location.toString());
      urlUrl.searchParams.set('limit', '' + limit);
      urlUrl.searchParams.set('startIndex', '' + startIndex);
      urlUrl.searchParams.set('totalCount', 'true');
      return urlUrl.toString();
    } else {
      return null;
    }
  },
  getNextUrl: (response) => {
    const uri = response?.links?.find((link) => link.rel == 'next')?.uri;
    if (uri) {
      const url = new URL(uri);

      // allows frontend proxies to work
      url.host = window.location.host;
      url.protocol = window.location.protocol;

      return url.toString();
    } else {
      return null;
    }
  },
  getTotalCount: (response) => response?.totalCount ?? Number.NaN,
  getCurrentPageSize: (response) => response?.results?.length ?? Number.NaN,
  getData: (response) => response?.results,
};

export interface ServerPaginationHandlers<T, R> {
  getPaginatedUrl: (url: string | URL, limit: number, startIndex: number) => string | null;
  getNextUrl: (response: R | undefined) => string | null;
  getTotalCount: (response: R | undefined) => number;
  getCurrentPageSize: (response: R | undefined) => number;
  getData: (response: R | undefined) => Array<T> | undefined;
}

export function useServerPagination<T, R>(
  url: string | URL,
  pageSize: number,
  serverPaginationHandlers: ServerPaginationHandlers<T, R>,
  options: UseServerPaginationOptions<R> = {},
) {
  const { getPaginatedUrl, getTotalCount, getCurrentPageSize, getData } = serverPaginationHandlers;
  const { immutable, swrConfig } = options;
  const fetcher: (key: string) => Promise<FetchResponse<R>> = options.fetcher ?? openmrsFetch;
  // 1-indexing instead of 0-indexing, to keep consistency with `usePagination`
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Cache the totalCount and currentPageSize so we don't lose them
  // as we wait for next page's result to load while navigating to a different page.
  // This can be used to prevent jarring UI changes while loading
  const totalCount = useRef<number>(Number.NaN);
  // this value is usually same as pageSize, except when currentPage is last page.
  const currentPageSize = useRef<number>(Number.NaN);

  // tracked as a ref so we don't need to make the current page a dependency of `goTo()`, etc.
  const currentPageRef = useRef(currentPage);

  // use to differentiate "endpoint doesn't return a total" from "we haven't run a request yet"
  const hasResponded = useRef(false);
  const warnedMissingTotal = useRef(false);

  // if the URL we're querying changes, reset to page 1
  const urlKey = url?.toString() ?? '';
  const [lastUrlKey, setLastUrlKey] = useState(urlKey);
  if (urlKey !== lastUrlKey) {
    setLastUrlKey(urlKey);
    setCurrentPage(1);
    currentPageRef.current = 1;
    totalCount.current = Number.NaN;
    currentPageSize.current = Number.NaN;
    hasResponded.current = false;
    warnedMissingTotal.current = false;
  }

  const limit = pageSize;
  const startIndex = (currentPage - 1) * pageSize;

  const urlUrl = useMemo(() => {
    return getPaginatedUrl(url, limit, startIndex);
  }, [url, limit, startIndex]);

  const swr = immutable ? useSWRImmutable : useSWR;
  const { data, ...rest } = swr(urlUrl, fetcher, swrConfig);

  if (data?.data) {
    totalCount.current = getTotalCount(data?.data);
    currentPageSize.current = getCurrentPageSize(data?.data);
    hasResponded.current = true;
  }

  const totalPages = Math.ceil(totalCount.current / pageSize);

  // The bound is read from `totalCount` at call time rather than captured from the creating render,
  // which is what keeps this callback referentially stable, apart from a change in `pageSize`.
  const goTo = useCallback(
    (page: number) => {
      if (!Number.isInteger(page) || page < 1) {
        console.warn(`useServerPagination: ignoring goTo(${page}); page must be a positive integer.`);
        return;
      }

      // page coung is not known prior to running any query when `bound` will be `NaN`, so in this
      // case we assume the requested page is fine; after results return, things will settle properly
      // clamped
      const bound = Math.ceil(totalCount.current / pageSize);
      if (!hasResponded.current || Number.isNaN(bound) || page <= bound) {
        currentPageRef.current = page;
        setCurrentPage(page);
      } else {
        console.warn('Invalid attempt to go to out of bounds page: ' + page);
      }
    },
    [pageSize],
  );

  // A page accepted before the total was known may turn out not to exist, so put the user on the last
  // real page once the response settles it. Costs an extra request, but only for a page that was out of
  // range to begin with; without it the hook sits on an empty page with no way back.
  useEffect(() => {
    if (!hasResponded.current) {
      return;
    }

    if (Number.isNaN(totalCount.current)) {
      if (!warnedMissingTotal.current) {
        warnedMissingTotal.current = true;
        console.warn(
          `useServerPagination: ${urlKey} returned no total count, so out-of-range pages cannot be detected.`,
        );
      }
      return;
    }

    const lastPage = Math.max(1, Math.ceil(totalCount.current / pageSize));
    if (currentPage > lastPage) {
      console.warn(`Invalid attempt to go to out of bounds page: ${currentPage}; returning to page ${lastPage}.`);
      currentPageRef.current = lastPage;
      setCurrentPage(lastPage);
    }
  }, [currentPage, pageSize, urlKey, data]);

  const goToNext = useCallback(() => {
    goTo(currentPageRef.current + 1);
  }, [goTo]);

  const goToPrevious = useCallback(() => {
    goTo(currentPageRef.current - 1);
  }, [goTo]);

  return {
    data: getData(data?.data),
    totalPages,
    totalCount: totalCount.current,
    currentPage,
    currentPageSize,
    paginated: totalPages > 1,
    showNextButton: currentPage < totalPages,
    showPreviousButton: currentPage > 1,
    goTo,
    goToNext,
    goToPrevious,
    ...rest,
  };
}
