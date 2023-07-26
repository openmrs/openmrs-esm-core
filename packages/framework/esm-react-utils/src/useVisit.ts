/** @module @category API */
import {
  defaultVisitCustomRepresentation,
  getVisitStore,
  openmrsFetch,
  Visit,
} from "@openmrs/esm-api";
import useSWR from "swr";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { useMemo } from "react";
import { useStore } from "./useStore";

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
 */
export function useVisit(patientUuid: string): VisitReturnType {
  const { patientUuid: visitStorePatientUuid, manuallySetVisitUuid } = useStore(
    getVisitStore()
  );
  // Ignore the visit store data if it is not for this patient
  const retrospectiveVisitUuid =
    patientUuid && visitStorePatientUuid == patientUuid
      ? manuallySetVisitUuid
      : null;
  const activeVisitUrlSuffix = `?patient=${patientUuid}&v=${defaultVisitCustomRepresentation}&includeInactive=false`;
  const retrospectiveVisitUrlSuffix = `/${retrospectiveVisitUuid}`;

  const {
    data: activeData,
    error: activeError,
    mutate: activeMutate,
    isValidating: activeIsValidating,
  } = useSWR<{
    data: Visit | { results: Array<Visit> };
  }>(
    patientUuid ? `/ws/rest/v1/visit${activeVisitUrlSuffix}` : null,
    openmrsFetch
  );

  const {
    data: retroData,
    error: retroError,
    mutate: retroMutate,
    isValidating: retroIsValidating,
  } = useSWR<{
    data: Visit | { results: Array<Visit> };
  }>(
    patientUuid && retrospectiveVisitUuid
      ? `/ws/rest/v1/visit${retrospectiveVisitUrlSuffix}`
      : null,
    openmrsFetch
  );

  const activeVisit = useMemo(
    () =>
      activeData?.data.results.find((visit) => visit.stopDatetime === null) ??
      null,
    [activeData]
  );

  const currentVisit = useMemo(
    () => (retrospectiveVisitUuid ? retroData?.data : activeVisit ?? null),
    [retroData, activeVisit, retrospectiveVisitUuid]
  );

  return {
    error: activeError || retroError,
    mutate: () => {
      activeMutate();
      retroMutate();
    },
    isValidating: activeIsValidating || retroIsValidating,
    activeVisit,
    currentVisit,
    currentVisitIsRetrospective: Boolean(retrospectiveVisitUuid),
    isLoading: Boolean(
      (!activeData || (retrospectiveVisitUuid && !retroData)) &&
        (!activeError || !retroError)
    ),
  };
}
