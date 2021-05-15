import { openmrsFetch } from "@openmrs/esm-framework";

export function performPatientSearch(query, objectVersion) {
  return openmrsFetch(`/ws/rest/v1/patient?q=${query}&v=${objectVersion}`, {
    method: "GET",
  });
}
