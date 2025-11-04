/** @module @category API */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday.js';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-api';
import { defaultVisitCustomRepresentation, type Visit } from '@openmrs/esm-emr-api';
import { useVisitContextStore } from './useVisitContextStore';

dayjs.extend(isToday);

export interface VisitReturnType {
  error: Error;
  mutate: () => void;
  isValidating: boolean;
  activeVisit: Visit | null;
  currentVisit: Visit | null;
  currentVisitIsRetrospective: boolean;
  isLoading: boolean;
}

/**
 * This React hook returns visit information if the patient UUID is not null. There are
 * potentially two relevant visits at a time: "active" and "current".
 *
 * The active visit is the most recent visit without an end date. The presence of an active
 * visit generally means that the patient is in the facility.
 *
 * The current visit is the active visit, unless a retrospective visit has been selected.
 * If there is no active visit and no selected retrospective visit, then there is no
 * current visit. If there is no active visit but there is a retrospective visit, then
 * the retrospective visit is the current visit. `currentVisitIsRetrospective` tells you
 * whether the current visit is a retrospective visit.
 *
 * The active visit and current visit require two separate API calls. `error` contains
 * the error from either one, if there is an error. `isValidating` is true if either
 * API call is in progress. `mutate` refreshes the data from both API calls.
 *
 * @param patientUuid Unique patient identifier `string`
 * @param representation The custom representation of the visit
 */
export function useVisit(patientUuid: string, representation = defaultVisitCustomRepresentation): VisitReturnType {
  const { patientUuid: visitStorePatientUuid, manuallySetVisitUuid, setVisitContext } = useVisitContextStore();
  // Ignore the visit store data if it is not for this patient
  const retrospectiveVisitUuid = patientUuid && visitStorePatientUuid == patientUuid ? manuallySetVisitUuid : null;
  const activeVisitUrlSuffix = `?patient=${patientUuid}&v=${representation}&includeInactive=false`;
  const retrospectiveVisitUrlSuffix = `/${retrospectiveVisitUuid}?v=${representation}`;

  const {
    data: activeData,
    error: activeError,
    mutate: activeMutate,
    isValidating: activeIsValidating,
  } = useSWR<{
    data: { results: Array<Visit> };
  }>(patientUuid ? `${restBaseUrl}/visit${activeVisitUrlSuffix}` : null, openmrsFetch);

  const {
    data: retroData,
    error: retroError,
    mutate: retroMutate,
    isValidating: retroIsValidating,
  } = useSWR<{
    data: Visit;
  }>(patientUuid && retrospectiveVisitUuid ? `${restBaseUrl}/visit${retrospectiveVisitUrlSuffix}` : null, openmrsFetch);

  const activeVisit = useMemo(
    () => activeData?.data.results.find((visit) => visit.stopDatetime === null) ?? null,
    [activeData],
  );

  const currentVisit = useMemo(
    () => (retrospectiveVisitUuid && retroData ? retroData.data : null),
    [retroData, retrospectiveVisitUuid],
  );
  const previousCurrentVisit = useRef<Visit | null>(null);

  useEffect(() => {
    // if an active visit is created for the visit store patient and they have no visit in context, set the context to the active visit
    if (!activeIsValidating && activeVisit && visitStorePatientUuid === patientUuid && manuallySetVisitUuid === null) {
      setVisitContext(activeVisit);
    }
    if (!retroIsValidating) {
      // if the current visit happened to be active but it just got ended (inactive), remove the
      // visit from context
      if (
        previousCurrentVisit.current &&
        currentVisit &&
        previousCurrentVisit.current.uuid === currentVisit.uuid &&
        !previousCurrentVisit.current.stopDatetime &&
        currentVisit.stopDatetime
      ) {
        setVisitContext(null);
      }
      previousCurrentVisit.current = currentVisit;
    }
  }, [currentVisit, manuallySetVisitUuid, activeVisit, activeIsValidating, retroIsValidating, visitStorePatientUuid]);

  const mutateVisit = useCallback(() => {
    activeMutate();
    retroMutate();
  }, [activeMutate, retroMutate]);

  useVisitContextStore(mutateVisit);

  const waitingForData = Boolean(!activeData || (retrospectiveVisitUuid && !retroData));
  const hasRelevantError = Boolean(retrospectiveVisitUuid ? retroError : activeError);
  const isLoading = waitingForData && !hasRelevantError;

  return {
    error: activeError || retroError,
    mutate: mutateVisit,
    isValidating: activeIsValidating || retroIsValidating,
    activeVisit,
    currentVisit,
    currentVisitIsRetrospective: Boolean(retrospectiveVisitUuid),
    isLoading,
  };
}
