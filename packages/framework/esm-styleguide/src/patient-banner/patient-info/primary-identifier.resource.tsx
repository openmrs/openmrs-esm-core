import useSWR from 'swr';
import { type FetchResponse, restBaseUrl, openmrsFetch } from '@openmrs/esm-framework';
import { useMemo } from 'react';

export interface PrimaryIdentifier {
  metadataUuid: string;
}
interface PrimaryIdentifierResponse {
  results: Array<PrimaryIdentifier>;
}

export function usePrimaryIdentifierCode(): {
  primaryIdentifierCode: string | undefined;
} {
  const url = `${restBaseUrl}/metadatamapping/termmapping?v=custom:(metadataUuid)&code=emr.primaryIdentifierType`;
  const { data, error, isLoading } = useSWR<FetchResponse<PrimaryIdentifierResponse>, Error>(url, openmrsFetch);
  const memoisedPrimaryIdentifierCode = useMemo(
    () => ({
      primaryIdentifierCode: data?.data?.results[0]?.metadataUuid,
      isLoading,
    }),
    [data, error, isLoading],
  );

  return memoisedPrimaryIdentifierCode;
}
