import {
  openmrsFetch,
  queueSynchronizationItemFor,
} from "@openmrs/esm-framework/src/internal";
import { userPropertyChange } from "../../constants";

export type PostUserProperties = (
  userUuid: string,
  userProperties: Record<string, string>,
  abortController?: AbortController
) => Promise<void>;

export async function postUserPropertiesOnline(
  userUuid: string,
  userProperties: any,
  abortController: AbortController
): Promise<void> {
  await openmrsFetch(`/ws/rest/v1/user/${userUuid}`, {
    method: "POST",
    body: { userProperties },
    headers: { "Content-Type": "application/json" },
    signal: abortController.signal,
  });

  // Force the reload of the page to ensure all data coming from the backend is fetched in the newly set locale.
  window.location.reload();
}

export async function postUserPropertiesOffline(
  userUuid: string,
  userProperties: Record<string, unknown>
): Promise<void> {
  await queueSynchronizationItemFor(
    userUuid,
    userPropertyChange,
    userProperties,
    {
      displayName: "User Language Change",
    }
  );
}

export type PostSessionLocale = (
  locale: string,
  abortController: AbortController
) => Promise<void>;

export async function postSessionLocaleOnline(
  locale: string,
  abortController: AbortController
): Promise<void> {
  await openmrsFetch(`/ws/rest/v1/session`, {
    method: "POST",
    body: { locale },
    headers: { "Content-Type": "application/json" },
    signal: abortController.signal,
  });
}

export async function postSessionLocaleOffline(
  locale: string,
  abortController: AbortController
) {}
