/** @module @category API */
import { useMemo } from 'react';
import useSWR from 'swr';
import { openmrsFetch, type FetchResponse } from '@openmrs/esm-api';
import { attachmentUrl, type AttachmentResponse } from '@openmrs/esm-emr-api';

export function useAttachments(patientUuid: string, includeEncounterless: boolean) {
  const { data, error, mutate, isLoading, isValidating } = useSWR<
    FetchResponse<{ results: Array<AttachmentResponse> }>
  >(`${attachmentUrl}?patient=${patientUuid}&includeEncounterless=${includeEncounterless}`, openmrsFetch);

  const results = useMemo(
    () => ({
      isLoading,
      data: data?.data.results ?? [],
      error,
      mutate,
      isValidating,
    }),
    [data, error, isLoading, isValidating, mutate],
  );

  return results;
}
