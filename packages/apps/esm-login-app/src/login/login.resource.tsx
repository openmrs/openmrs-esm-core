import { openmrsFetch, refetchCurrentUser } from "@openmrs/esm-framework";

export function performLogin(username, password) {
  const token = window.btoa(`${username}:${password}`);
  return openmrsFetch(`/ws/rest/v1/session`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  }).then((res) => {
    refetchCurrentUser();
    return res;
  });
}
