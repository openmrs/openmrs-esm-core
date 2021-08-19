import {
  openmrsFetch,
  openmrsObservableFetch,
  fhirBaseUrl,
} from "@openmrs/esm-framework";
import { map } from "rxjs/operators";
import { LocationResponse } from "../types";

export function getLoginLocations(): Observable<Object[]> {
  return openmrsObservableFetch(
    `/ws/rest/v1/location?tag=Login%20Location&v=custom:(uuid,display)`
  ).pipe(map(({ data }) => data["results"]));
}

export function searchLocationsFhir(
  location: string,
  abortController: AbortController,
  useLoginLocationTag: boolean
) {
  const baseUrl = `${fhirBaseUrl}/Location?name=${location}`;
  const url = useLoginLocationTag
    ? baseUrl.concat("&_tag=login location")
    : baseUrl;
  return openmrsFetch<LocationResponse>(url, {
    method: "GET",
    signal: abortController.signal,
  });
}

export function queryLocations(
  location: string,
  abortController = new AbortController(),
  useLoginLocationTag: boolean
) {
  return searchLocationsFhir(
    location,
    abortController,
    useLoginLocationTag
  ).then((locs) => locs.data.entry);
}
