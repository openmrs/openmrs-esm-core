/** @module @category API */
import { useMemo } from 'react';
import useSWR from 'swr';
import { openmrsFetch, type FetchResponse } from '@openmrs/esm-api';
import { getAttachmentsUrl, type AttachmentResponse } from '@openmrs/esm-emr-api';

/**
 * A React hook that fetches attachments for a patient using SWR for caching
 * and automatic revalidation.
 *
 * @param patientUuid The UUID of the patient whose attachments should be fetched.
 *   Nothing is fetched while this is empty, so callers can defer the request.
 * @param includeEncounterless Whether to include attachments that are not
 *   associated with any encounter. Ignored when `encounterUuid` is set.
 * @param encounterUuid When set, only attachments recorded on this encounter are
 *   returned.
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
 *
 * // Only the attachments recorded on one encounter
 * const { data } = useAttachments(patientUuid, false, encounterUuid);
 * ```
 */
export function useAttachments(
  patientUuid: string | null | undefined,
  includeEncounterless: boolean,
  encounterUuid?: string,
) {
  const { data, error, mutate, isLoading, isValidating } = useSWR<
    FetchResponse<{ results: Array<AttachmentResponse> }>
  >(patientUuid ? getAttachmentsUrl(patientUuid, includeEncounterless, encounterUuid) : null, openmrsFetch);

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
