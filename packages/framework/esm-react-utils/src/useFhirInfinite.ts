import { getFhirServerPaginationHandlers } from './useFhirPagination';
import {
  useServerInfinite,
  type UseServerInfiniteOptions,
  type UseServerInfiniteReturnObject,
} from './useOpenmrsInfinite';

/**
 * Fhir REST endpoints that return a list of objects, are server-side paginated.
 * The server limits the max number of results being returned, and multiple requests are needed to get the full data set
 * if its size exceeds this limit.
 *
 * This function is the FHIR counterpart of `useOpenmrsInfinite`.
 *
 * @see `useFhirPagination`
 * @see `useFhirFetchAll`
 * @see `useOpenmrsInfinite`
 *
 * @param url The URL of the paginated rest endpoint.
 *            Similar to useSWRInfinite, this param can be null to disable fetching.
 * @param options The options object
 * @returns a UseServerInfiniteReturnObject object
 */
export function useFhirInfinite<T extends fhir.ResourceBase>(
  url: string | URL,
  options: UseServerInfiniteOptions<fhir.Bundle> = {},
): UseServerInfiniteReturnObject<T, fhir.Bundle> {
  return useServerInfinite<T, fhir.Bundle>(url, getFhirServerPaginationHandlers(), options);
}
