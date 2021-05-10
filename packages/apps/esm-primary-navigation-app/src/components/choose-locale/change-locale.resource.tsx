import { openmrsFetch } from "@openmrs/esm-framework";
import { PrimaryNavigationDb } from "../../offline";

export type PostUserProperties = (
  userUuid: string,
  userProperties: any,
  abortController?: AbortController
) => Promise<any>;

export function postUserPropertiesOnline(
  userUuid: string,
  userProperties: any,
  abortController?: AbortController
): Promise<any> {
  return openmrsFetch(`/ws/rest/v1/user/${userUuid}`, {
    method: "POST",
    body: { userProperties: userProperties },
    headers: { "Content-Type": "application/json" },
    signal: abortController?.signal,
  });
}

export function postUserPropertiesOffline(
  userUuid: string,
  userProperties: any
): Promise<any> {
  const db = new PrimaryNavigationDb();
  return db.userPropertiesChanges.add({ userUuid, changes: userProperties });
}
