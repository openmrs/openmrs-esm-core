import {
  openmrsFetch,
  queueSynchronizationItemFor,
  getSessionLocation,
  setSessionLocation,
} from "@openmrs/esm-framework/src/internal";
import { userPropertyChange } from "../../constants";

export type PostUserProperties = (
  userUuid: string,
  userProperties: any,
  abortController?: AbortController
) => Promise<any>;

export async function postUserPropertiesOnline(
  userUuid: string,
  userProperties: any,
  abortController: AbortController
): Promise<any> {
  const sessionLocation = await getSessionLocation();
  const locationUuid = sessionLocation?.uuid;

  await openmrsFetch(`/ws/rest/v1/user/${userUuid}`, {
    method: "POST",
    body: { userProperties },
    headers: { "Content-Type": "application/json" },
    signal: abortController.signal,
  });

  if (locationUuid) {
    await setSessionLocation(locationUuid, abortController);
  }
}

export type PostSessionLocale = (
  locale: string,
  abortController: AbortController
) => Promise<any>;

export async function postSessionLocaleOnline(
  locale: string,
  abortController: AbortController
): Promise<any> {
  await openmrsFetch(`/ws/rest/v1/session`, {
    method: "POST",
    body: { locale },
    headers: { "Content-Type": "application/json" },
    signal: abortController.signal,
  });
}

export function postUserPropertiesOffline(
  userUuid: string,
  userProperties: any
): Promise<any> {
  return queueSynchronizationItemFor(
    userUuid,
    userPropertyChange,
    userProperties,
    {
      displayName: "User Language Change",
    }
  );
}
