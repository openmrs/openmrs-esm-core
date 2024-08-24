/** @module @category UI */
import { type FetchResponse, makeUrl, openmrsFetch } from '@openmrs/esm-api';
import { type ServerPaginationHandlers, useServerPagination, type UseServerPaginationOptions } from './useOpenmrsPagination';

/**
 * Fhir REST endpoints that return a list of objects, are server-side paginated.
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
 * @see `useFhirInfinite` for completely loading data (from all pages) onto client side
 * @see `usePagination` for pagination of client-side data`
 *
 * @param url The URL of the paginated rest endpoint.
 *            which will be overridden and manipulated by the `goTo*` callbacks
 * @param pageSize The number of results to return per page / fetch.
 * @param fetcher The fetcher to use. Defaults to openmrsFetch
 * @returns
 */
export function useFhirPagination<T extends fhir.ResourceBase>(
  url: string | URL,
  pageSize: number,
  options: UseServerPaginationOptions<fhir.Bundle> = {},
) {
  return useServerPagination<T, fhir.Bundle>(url, pageSize, getFhirServerPaginationHandlers<T>(), options);
}

type FhirServerPaginationHandlers<T> = ServerPaginationHandlers<T, fhir.Bundle>;
export function getFhirServerPaginationHandlers<T>(): FhirServerPaginationHandlers<T> {
  return {
    getPaginatedUrl: (url: string | URL, limit: number, startIndex: number) => {
      if (url) {
        const urlUrl = new URL(makeUrl(url.toString()), window.location.toString());
        urlUrl.searchParams.set('_count', '' + limit);
        urlUrl.searchParams.set('_getpagesoffset', '' + startIndex);
        return urlUrl.toString();
      } else {
        return null;
      }
    },
    getNextUrl: (response) => {
      const uri = response?.link?.find((link) => link.relation == 'next')?.url;
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
    getTotalCount: (response) => response?.total ?? Number.NaN,
    getCurrentPageSize: (response) => response?.entry?.length ?? Number.NaN,
    getData: (response) => response?.entry?.map((entry) => entry.resource) as T[],
  };
}
