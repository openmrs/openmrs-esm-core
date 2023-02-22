import {
  FetchResponse,
  openmrsFetch,
  refetchCurrentUser,
  Session,
} from "@openmrs/esm-framework";

export async function performLogin(
  username: string,
  password: string
): Promise<{ data: Session }> {
  const abortController = new AbortController();
  const token = window.btoa(`${username}:${password}`);
  const url = `/ws/rest/v1/session`;

  return openmrsFetch(url, {
    headers: {
      Authorization: `Basic ${token}`,
    },
    signal: abortController.signal,
  }).then((res) => {
    refetchCurrentUser();
    return res;
  });
}
