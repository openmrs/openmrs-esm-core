/** @module @category API */
import { useMemo } from 'react';
import useSWR from 'swr';
import { openmrsFetch, restBaseUrl, type FetchResponse } from '@openmrs/esm-api';

export interface PrimaryIdentifier {
  metadataUuid: string;
}
interface PrimaryIdentifierResponse {
  results: Array<PrimaryIdentifier>;
}

/**
 * A React hook that retrieves the UUID of the primary patient identifier type
 * from the metadata mapping configuration. This identifier type is commonly used
 * to display the main identifier for a patient, such as their medical record number.
 *
 * @returns An object containing the primary identifier type UUID, loading state, and any error.
 *
 */
export function usePrimaryIdentifierCode(): {
  primaryIdentifierCode: string | undefined;
  isLoading: boolean;
  error: Error | undefined;
} {
  const url = `${restBaseUrl}/metadatamapping/termmapping?v=custom:(metadataUuid)&code=emr.primaryIdentifierType`;
  const { data, error, isLoading } = useSWR<FetchResponse<PrimaryIdentifierResponse>, Error>(url, openmrsFetch);

  const results = useMemo(
    () => ({
      primaryIdentifierCode: data?.data?.results[0]?.metadataUuid,
      isLoading,
      error,
    }),
    [data, error, isLoading],
  );

  return results;
}
