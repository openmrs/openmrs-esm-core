import { openmrsFetch } from "../openmrs-fetch";
import { Location, OpenmrsResource } from "../types";

export function toLocationObject(openmrsRestForm: OpenmrsResource): Location {
  return {
    uuid: openmrsRestForm.uuid,
    display: openmrsRestForm.display,
  };
}

interface OpenmrsLocationResponse {
  results: Array<OpenmrsResource>;
}

export function getLocations(abort = new AbortController()) {
  return openmrsFetch<OpenmrsLocationResponse>(`/ws/rest/v1/location`, {
    signal: abort.signal,
  }).then((res) => res.data.results.map(toLocationObject));
}
