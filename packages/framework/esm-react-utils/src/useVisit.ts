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
  currentVisit: Visit | null;
  isRetrospective: boolean;
  isLoading: boolean;
}

/**
 * This React hook returns a visit object. If the `patientUuid` is provided
 * as a parameter, then the currentVisit, error and mutate function
 * for that patient visit is returned.
 * @param patientUuid Unique patient identifier `string`
 * @returns Object {`error` `isValidating`, `currentVisit`, `mutate`}
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
  const visitGetUrlSuffix = retrospectiveVisitUuid
    ? `/${retrospectiveVisitUuid}`
    : `?patient=${patientUuid}&v=${defaultVisitCustomRepresentation}&includeInactive=false`;
  const { data, error, mutate, isValidating } = useSWR<{
    data: Visit | { results: Array<Visit> };
  }>(
    patientUuid ? `/ws/rest/v1/visit${visitGetUrlSuffix}` : null,
    openmrsFetch
  );

  const currentVisit = useMemo(
    () =>
      retrospectiveVisitUuid
        ? data?.data
        : data?.data.results.find((visit) => visit.stopDatetime === null) ??
          null,
    [data]
  );

  return {
    error,
    mutate,
    isValidating,
    currentVisit,
    isRetrospective: Boolean(retrospectiveVisitUuid),
    isLoading: !data && !error,
  };
}
