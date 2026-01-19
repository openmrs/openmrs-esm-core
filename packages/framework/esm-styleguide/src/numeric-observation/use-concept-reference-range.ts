/** @module @category UI */
import useSWRImmutable from 'swr/immutable';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-api';
import type { ObsReferenceRanges } from './interpretation-utils';

export interface UseConceptReferenceRangeResult {
  referenceRange: ObsReferenceRanges | undefined;
  error?: Error;
  isLoading: boolean;
}

interface ConceptReferenceRangeResponse {
  results: Array<{
    concept: string;
    display: string;
    hiNormal?: number | null;
    hiAbsolute?: number | null;
    hiCritical?: number | null;
    lowNormal?: number | null;
    lowAbsolute?: number | null;
    lowCritical?: number | null;
    units?: string | null;
  }>;
}

/**
 * Hook to fetch concept reference range from OpenMRS REST API
 * @param conceptUuid - The UUID of the concept to fetch reference range for
 * @returns Reference range data, loading state, and error
 */
export function useConceptReferenceRange(conceptUuid: string | undefined): UseConceptReferenceRangeResult {
  const apiUrl = conceptUuid ? `${restBaseUrl}/conceptreferencerange/?concept=${conceptUuid}&v=full` : null;

  const { data, error, isLoading } = useSWRImmutable<{ data: ConceptReferenceRangeResponse }, Error>(
    apiUrl,
    openmrsFetch,
  );

  const conceptData = data?.data?.results?.[0];

  const referenceRange: ObsReferenceRanges | undefined = conceptData
    ? {
        hiNormal: conceptData.hiNormal ?? null,
        hiAbsolute: conceptData.hiAbsolute ?? null,
        hiCritical: conceptData.hiCritical ?? null,
        lowNormal: conceptData.lowNormal ?? null,
        lowAbsolute: conceptData.lowAbsolute ?? null,
        lowCritical: conceptData.lowCritical ?? null,
      }
    : undefined;

  return {
    referenceRange,
    error,
    isLoading,
  };
}
