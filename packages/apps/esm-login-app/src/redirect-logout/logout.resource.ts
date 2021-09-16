import { openmrsFetch, refetchCurrentUser } from "@openmrs/esm-framework";

export function performLogout() {
  return openmrsFetch("/ws/rest/v1/session", {
    method: "DELETE",
  }).then(refetchCurrentUser);
}
