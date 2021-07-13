import { openmrsFetch } from "../openmrs-fetch";
import { OpenmrsResource, VisitType } from "../types";

export function toVisitTypeObject(openmrsRestForm: OpenmrsResource): VisitType {
  return {
    uuid: openmrsRestForm.uuid,
    display: openmrsRestForm.display || "",
    name: openmrsRestForm.name,
  };
}

interface OpenmrsVisitTypeResponse {
  results: Array<OpenmrsResource>;
}

export function getVisitTypes(abort = new AbortController()) {
  return openmrsFetch<OpenmrsVisitTypeResponse>(`/ws/rest/v1/visittype`, {
    signal: abort.signal,
  }).then((res) => res.data.results.map(toVisitTypeObject));
}
