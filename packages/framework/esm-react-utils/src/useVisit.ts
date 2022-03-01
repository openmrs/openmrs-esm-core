import { openmrsFetch, Visit } from "@openmrs/esm-api";
import useSWR from "swr";

interface VisitReturnType {
  visits: Array<Visit>;
  error: Error;
  mutate: () => void;
  isValidating: boolean;
  currentVisit: Visit | null;
}

const defaultVisitCustomRepresentation =
  "custom:(uuid,encounters:(uuid,encounterDatetime," +
  "form:(uuid,name),location:ref," +
  "encounterType:ref,encounterProviders:(uuid,display," +
  "provider:(uuid,display))),patient:(uuid,uuid)," +
  "visitType:(uuid,name,display),attributes:(uuid,display,value),location:(uuid,name,display),startDatetime," +
  "stopDatetime)";
/**
 * This React hook returns a visit object. If the `patientUuid` is provided
 * as a parameter, then the visits, currentVisit, error and mutate function
 * for that patient visit is returned.
 * @param patientUuid Unique patient identifier `string`
 * @param includeInactive Boolean that specifies whether to include Inactive visits `boolean`, defaults to false
 * @returns Object {`visits`, `error` `isValidating`, `currentVisit`, `mutate`}
 */
export function useVisit(
  patientUuid: string,
  includeInactive: boolean = false
): VisitReturnType {
  const { data, error, mutate, isValidating } = useSWR<{
    data: { results: Array<Visit> };
  }>(
    `/ws/rest/v1/visit?patient=${patientUuid}&v=${defaultVisitCustomRepresentation}&includeInactive=${includeInactive}`,
    openmrsFetch
  );

  const visits = data?.data.results ?? [];
  const currentVisit =
    data?.data.results.find((visit) => visit.stopDatetime === null) ?? null;

  return { visits, error, mutate, isValidating, currentVisit };
}
