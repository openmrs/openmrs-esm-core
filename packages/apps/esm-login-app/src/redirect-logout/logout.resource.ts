import {
  clearCurrentUser,
  openmrsFetch,
  refetchCurrentUser,
} from "@openmrs/esm-framework";
import { mutate } from "swr";

export async function performLogout() {
  await openmrsFetch("/ws/rest/v1/session", {
    method: "DELETE",
  });

  // clear the SWR cache on logout, do not revalidate
  // taken from the SWR docs
  mutate(() => true, undefined, { revalidate: false });

  clearCurrentUser();
  await refetchCurrentUser();
}
