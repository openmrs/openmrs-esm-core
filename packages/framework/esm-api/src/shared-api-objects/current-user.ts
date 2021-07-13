import { openmrsFetch, sessionEndpoint } from "../openmrs-fetch";
import { UnauthenticatedUser } from "../types";

/**
 * @category API Object
 */
export function getSession(abort = new AbortController()) {
  return openmrsFetch<UnauthenticatedUser>(sessionEndpoint, {
    signal: abort.signal,
  }).then((r) => r.data);
}

/**
 * @category API Object
 */
export function createSession(token: string, abort = new AbortController()) {
  return openmrsFetch<UnauthenticatedUser>(sessionEndpoint, {
    signal: abort.signal,
    headers: {
      Authorization: `Basic ${token}`,
    },
  }).then((res) => res.data);
}

/**
 * @category API Object
 */
export function deleteSession(abort = new AbortController()) {
  return openmrsFetch(sessionEndpoint, {
    method: "DELETE",
    signal: abort.signal,
  }).then(() => {});
}

/**
 * @category API Object
 */
export function updateUser(
  userUuid: string,
  userProperties: any,
  abort = new AbortController()
) {
  return openmrsFetch(`/ws/rest/v1/user/${userUuid}`, {
    method: "POST",
    body: { userProperties },
    headers: { "Content-Type": "application/json" },
    signal: abort.signal,
  }).then(() => {});
}
