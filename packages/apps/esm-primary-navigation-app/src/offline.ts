import { getCurrentUser, SyncProcessOptions } from "@openmrs/esm-framework";
import { postUserPropertiesOnline } from "./components/choose-locale/change-locale.resource";

export function syncUserLanguagePreference(
  _: any,
  options: SyncProcessOptions<any>
) {
  if (options.index === 0) {
    const loggedInUser = getCurrentUser();
    const allChanges = options.items.map(([_, change]) => change);
    const newUserProperties = Object.assign(
      {},
      loggedInUser.userProperties,
      ...allChanges
    );

    return postUserPropertiesOnline(newUserProperties);
  }

  return Promise.resolve();
}
