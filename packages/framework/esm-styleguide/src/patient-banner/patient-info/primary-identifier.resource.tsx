import useSWR from 'swr';
import { type FetchResponse, restBaseUrl } from '@openmrs/esm-framework';
import { openmrsFetch } from '@openmrs/esm-framework';
import { useMemo } from 'react';

export interface PrimaryIdentifier {
  metadataUuid: string;
}
interface PrimaryIdentifierResponse {
  results: Array<PrimaryIdentifier>;
}

export function usePrimaryIdentifierCode(): {
  primaryIdentifierCode: string | undefined;
  isLoading: boolean;
} {
  const url = `${restBaseUrl}/metadatamapping/termmapping?v=custom:(metadataUuid)&code=emr.primaryIdentifierType`;
  const { data, error } = useSWR<FetchResponse<PrimaryIdentifierResponse>, Error>(url, openmrsFetch);
  const memoisedPrimaryIdentifier = useMemo(
    () => ({
      primaryIdentifierCode: data?.data.results[0].metadataUuid,
      isLoading: !data && !error,
    }),
    [data, error],
  );

  return memoisedPrimaryIdentifier;
}
