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
