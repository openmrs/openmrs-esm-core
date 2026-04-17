/** @module @category API */
import { useMemo } from 'react';
import useSWR from 'swr';
import { openmrsFetch, type FetchResponse } from '@openmrs/esm-api';
import { attachmentUrl, type AttachmentResponse } from '@openmrs/esm-emr-api';

/**
 * A React hook that fetches attachments for a patient using SWR for caching
 * and automatic revalidation.
 *
 * @param patientUuid The UUID of the patient whose attachments should be fetched.
 * @param includeEncounterless Whether to include attachments that are not
 *   associated with any encounter.
 * @returns An object containing:
 *   - `data`: Array of attachment objects (empty array while loading)
 *   - `isLoading`: Whether the initial fetch is in progress
 *   - `isValidating`: Whether any request (initial or revalidation) is in progress
 *   - `error`: Any error that occurred during fetching
 *   - `mutate`: Function to trigger a revalidation of the data
 *
 * @example
 * ```tsx
 * import { useAttachments } from '@openmrs/esm-framework';
 * function PatientAttachments({ patientUuid }) {
 *   const { data, isLoading, error } = useAttachments(patientUuid, true);
 *   if (isLoading) return <span>Loading...</span>;
 *   if (error) return <span>Error loading attachments</span>;
 *   return <AttachmentList attachments={data} />;
 * }
 * ```
 */
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
