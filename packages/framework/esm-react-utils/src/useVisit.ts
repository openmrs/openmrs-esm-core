/** @module @category API */
import {
  defaultVisitCustomRepresentation,
  openmrsFetch,
  Visit,
} from "@openmrs/esm-api";
import useSWR from "swr";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { useMemo } from "react";

dayjs.extend(isToday);

interface VisitReturnType {
  error: Error;
  mutate: () => void;
  isValidating: boolean;
  currentVisit: Visit | null;
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
  const { data, error, mutate, isValidating } = useSWR<{
    data: { results: Array<Visit> };
  }>(
    patientUuid
      ? `/ws/rest/v1/visit?patient=${patientUuid}&v=${defaultVisitCustomRepresentation}&includeInactive=false`
      : null,
    openmrsFetch
  );

  const currentVisit = useMemo(
    () =>
      data?.data.results.find((visit) => visit.stopDatetime === null) ?? null,
    [data?.data.results]
  );

  return {
    error,
    mutate,
    isValidating,
    currentVisit,
    isLoading: !data && !error,
  };
}
