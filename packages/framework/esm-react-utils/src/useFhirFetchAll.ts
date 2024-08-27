import { type UseServerInfiniteReturnObject } from './useOpenmrsInfinite';
import { getFhirServerPaginationHandlers } from './useFhirPagination';
import { useServerFetchAll, type UseServerFetchAllOptions } from './useOpenmrsFetchAll';

/**
 * This hook handles fetching results from *all* pages of a paginated FHIR REST endpoint, making multiple requests
 * as needed.
 * This function is the FHIR counterpart of `useOpenmrsPagination`.
 *
 * @see `useFhirPagination`
 * @see `useFhirInfinite`
 * @see `useOpenmrsFetchAll``
 *
 * @param url The URL of the paginated rest endpoint.
 *            Similar to useSWRInfinite, this param can be null to disable fetching.
 * @param options The options object
 * @returns a UseFhirInfiniteReturnObject object
 */
export function useFhirFetchAll<T extends fhir.ResourceBase>(
  url,
  options: UseServerFetchAllOptions<fhir.Bundle> = {},
): UseServerInfiniteReturnObject<T, fhir.Bundle> {
  return useServerFetchAll<T, fhir.Bundle>(url, getFhirServerPaginationHandlers(), options);
}
