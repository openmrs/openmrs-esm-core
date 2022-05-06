import {
  clearCurrentUser,
  openmrsFetch,
  refetchCurrentUser,
} from "@openmrs/esm-framework";

export async function performLogout() {
  await openmrsFetch("/ws/rest/v1/session", {
    method: "DELETE",
  });
  clearCurrentUser();
  await refetchCurrentUser();
}
