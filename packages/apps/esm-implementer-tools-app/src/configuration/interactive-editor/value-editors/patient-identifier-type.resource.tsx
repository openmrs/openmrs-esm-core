import useSWR from 'swr';
import { type FetchResponse, restBaseUrl } from '@openmrs/esm-framework';
import { openmrsFetch } from '@openmrs/esm-framework';
import { useMemo } from 'react';

export interface PatientIdentifierType {
  uuid: string;
  display: string;
}

interface PatientIdentifierTypeResponse {
  results: Array<PatientIdentifierType>;
}

export function usePatientIdentifierTypes(): {
  data: Array<PatientIdentifierType> | undefined;
  isLoading: boolean;
} {
  const { data, error } = useSWR<FetchResponse<PatientIdentifierTypeResponse>, Error>(
    `${restBaseUrl}/patientidentifiertype`,
    openmrsFetch,
  );
  const memoisedPatientIdentifierTypeData = useMemo(
    () => ({
      data: data?.data?.results,
      isLoading: !data && !error,
    }),
    [data, error],
  );

  return memoisedPatientIdentifierTypeData;
}
