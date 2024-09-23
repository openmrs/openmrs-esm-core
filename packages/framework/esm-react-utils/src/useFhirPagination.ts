/** @module @category UI */
import { type FetchResponse, makeUrl, openmrsFetch } from '@openmrs/esm-api';
import {
  type ServerPaginationHandlers,
  useServerPagination,
  type UseServerPaginationOptions,
} from './useOpenmrsPagination';

/**
 * Fhir REST endpoints that return a list of objects, are server-side paginated.
 * The server limits the max number of results being returned, and multiple requests are needed to get the full data set
 * if its size exceeds this limit.
 *
 * This function is the FHIR counterpart of `useOpenmrsPagination`.
 *
 * @see `useOpenmrsPagination
 * @see `useFhirInfinite`
 * @see `useFhirFetchAll`
 * @see `usePagination` for pagination of client-side data`
 *
 * @param url The URL of the paginated rest endpoint.
 *            which will be overridden and manipulated by the `goTo*` callbacks
 * @param pageSize The number of results to return per page / fetch.
 * @param options The options object
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
