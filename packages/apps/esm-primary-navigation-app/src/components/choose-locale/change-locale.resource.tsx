import {
  queueSynchronizationItemFor,
  updateCurrentUser,
} from "@openmrs/esm-framework";
import { userPropertyChange } from "../../constants";

export type PostUserProperties = (userProperties: any) => Promise<void>;

export function postUserPropertiesOnline(userProperties: any) {
  return updateCurrentUser(userProperties);
}

export function postUserPropertiesOffline(
  userUuid: string,
  userProperties: any
): Promise<any> {
  return queueSynchronizationItemFor(
    userUuid,
    userPropertyChange,
    userProperties
  );
}
