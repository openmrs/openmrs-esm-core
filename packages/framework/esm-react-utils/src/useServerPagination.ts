/** @module @category UI */
import { type FetchResponse, openmrsFetch } from '@openmrs/esm-api';
import { useCallback, useRef, useState } from 'react';
import useSWR from 'swr';

export interface OpenMRSPaginatedResponse<T> {
  results: Array<T>;
  links: Array<{ rel: 'prev' | 'next'; uri: string }>;
  totalCount: number;
}

/**
 * Most REST endpoints that return a list of objects, such as getAll or search, are server-side paginated.
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
 * @see `useServerInfinite` for completely loading data (from all pages) onto client side
 * @see `usePagination` for pagination of client-side data`
 *
 * @param url The URL of the paginated rest endpoint.
 *            It should be populated with any needed GET params, except `limit`, `startIndex` or `totalCount`,
 *            which will be overridden and manipulated by the `goTo*` callbacks
 * @param pageSize The number of results to return per page / fetch. Note that this value MUST NOT exceed
 *            "webservices.rest.maxResultsAbsolute", which should be reasonably high by default (1000).
 * @param fetcher The fetcher to use. Defaults to openmrsFetch
 * @returns
 */
export function useServerPagination<T>(
  url: string | URL,
  pageSize: number,
  fetcher: (key: string) => Promise<FetchResponse<OpenMRSPaginatedResponse<T>>> = openmrsFetch,
) {
  const [currentPage, setCurrentPage] = useState<number>(1); // 1-indexing instead of 0-indexing, to keep consistency with `usePagination`

  // Cache the totalCount and currentPageSize so we don't lose them
  // as we wait for next page's result to load while navigating to a different page.
  // This can be used to prevent jarring UI changes while loading
  const totalCount = useRef<number>(Number.NaN);
  const currentPageSize = useRef<number>(Number.NaN); // this value is usually same as pageSize, except when currentPage is last page.

  const limit = pageSize;
  const startIndex = (currentPage - 1) * pageSize;

  const urlUrl = new URL(url, window.location.toString());
  urlUrl.searchParams.set('limit', '' + limit);
  urlUrl.searchParams.set('startIndex', '' + startIndex);
  urlUrl.searchParams.set('totalCount', 'true');

  const { data, ...rest } = useSWR(urlUrl.toString(), fetcher);

  if (data?.data) {
    totalCount.current = data.data?.totalCount;
    currentPageSize.current = data.data?.results.length;
  }

  const totalPages = Math.ceil(totalCount.current / pageSize);

  const goTo = useCallback(
    (page: number) => {
      if (0 < page && page <= totalPages) {
        setCurrentPage(page);
      } else {
        console.warn('Invalid attempt to go to out of bounds page: ' + page);
      }
    },
    [url, currentPage, totalPages],
  );
  const goToNext = useCallback(() => {
    goTo(currentPage + 1);
  }, [url, currentPage, totalPages]);

  const goToPrevious = useCallback(() => {
    goTo(currentPage - 1);
  }, [url, currentPage, totalPages]);

  return {
    data: data?.data?.results,
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
