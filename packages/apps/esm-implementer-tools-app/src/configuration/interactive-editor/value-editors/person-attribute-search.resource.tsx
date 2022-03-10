import { openmrsFetch } from "@openmrs/esm-framework";

export function fetchPersonAttributeTypeByUuid(
  personAttributeTypeUuid: string
) {
  return openmrsFetch(
    `/ws/rest/v1/personattributetype/${personAttributeTypeUuid}`,
    {
      method: "GET",
    }
  );
}

export function performPersonAttributeTypeSearch(query: string) {
  return openmrsFetch(`/ws/rest/v1/personattributetype/?q=${query}`, {
    method: "GET",
  });
}
