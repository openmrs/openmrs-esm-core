import { openmrsFetch } from "@openmrs/esm-api";

export function fetchConceptByUuid(conceptUuid: string) {
  return openmrsFetch(`/ws/rest/v1/concept/${conceptUuid}`, {
    method: "GET",
  });
}

export function performConceptSearch(query: string) {
  return openmrsFetch(`/ws/rest/v1/concept/?q=${query}`, {
    method: "GET",
  });
}
