import {
  defaultVisitCustomRepresentation,
  openmrsFetch,
  Visit,
} from "@openmrs/esm-api";
import useSWR from "swr";

interface VisitReturnType {
  error: Error;
  mutate: () => void;
  isValidating: boolean;
  currentVisit: Visit | null;
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
    `/ws/rest/v1/visit?patient=${patientUuid}&v=${defaultVisitCustomRepresentation}&includeInactive=false`,
    openmrsFetch
  );

  const currentVisit =
    data?.data.results.find((visit) => visit.stopDatetime === null) ?? null;

  return { error, mutate, isValidating, currentVisit };
}
