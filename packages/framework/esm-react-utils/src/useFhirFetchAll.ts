import { type UseServerInfiniteReturnObject } from './useOpenmrsInfinite';
import { getFhirServerPaginationHandlers } from './useFhirPagination';
import { useServerFetchAll, type UseServerFetchAllOptions } from './useOpenmrsFetchAll';

/**
 * This hook handles fetching results from all pages of a paginated FHIR REST endpoint.
 * @param url The URL of the paginated FHIR REST endpoint.
 * @param partialData If true, the hook will return the data of any page as soon as they are fetched.
 *            This is useful when you want to display data as soon as possible, even if not all pages are fetched.
 *            If false, the returned data will be undefined until all pages are fetched. This is useful when you want to
 *            display all data at once or reduce the number of re-renders (to avoid confusing users).
 * @param fetcher The fetcher to use. Defaults to openmrsFetch
 * @see `useFhirInfinite`
 * @see `useFhirPagination`
 * @see `useOpenmrsFetchAll
 * @returns a UseFhirInfiniteReturnObject object
 */
export function useFhirFetchAll<T extends fhir.ResourceBase>(
  url,
  options: UseServerFetchAllOptions<fhir.Bundle> = {},
): UseServerInfiniteReturnObject<T, fhir.Bundle> {
  return useServerFetchAll<T, fhir.Bundle>(url, getFhirServerPaginationHandlers(), options);
}
