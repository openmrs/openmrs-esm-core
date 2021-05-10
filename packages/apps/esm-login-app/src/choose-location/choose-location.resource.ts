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

export function setSessionLocation(
  locationUuid: string,
  abortController: AbortController
): Promise<any> {
  return openmrsFetch("/ws/rest/v1/session", {
    method: "POST",
    body: { sessionLocation: locationUuid },
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
  });
}

export function searchLocationsFhir(
  location: string,
  abortController: AbortController
) {
  return openmrsFetch<LocationResponse>(
    `${fhirBaseUrl}/Location?name=${location}`,
    {
      method: "GET",
      signal: abortController.signal,
    }
  );
}

export function queryLocations(
  location: string,
  abortController = new AbortController()
) {
  return searchLocationsFhir(location, abortController).then(
    (locs) => locs.data.entry
  );
}
