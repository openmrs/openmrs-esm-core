import { getFhirServerPaginationHandlers } from './useFhirPagination';
import { useServerInfinite, type UseServerInfiniteOptions, type UseServerInfiniteReturnObject } from './useOpenmrsInfinite';

export function useFhirInfinite<T extends fhir.ResourceBase>(
  url: string | URL,
  options: UseServerInfiniteOptions<fhir.Bundle> = {},
): UseServerInfiniteReturnObject<T, fhir.Bundle> {
  return useServerInfinite<T, fhir.Bundle>(url, getFhirServerPaginationHandlers(), options);
}
