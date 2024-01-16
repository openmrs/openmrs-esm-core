import type { SyncProcessOptions } from '@openmrs/esm-framework/src/internal';
import { refetchCurrentUser, getLoggedInUser } from '@openmrs/esm-framework/src/internal';
import { postUserPropertiesOnline } from './components/change-language/change-language.resource';

export async function syncUserLanguagePreference(_: any, options: SyncProcessOptions<any>) {
  if (options.index === 0) {
    const loggedInUser = await getLoggedInUser();
    const allChanges = options.items.map(([_, change]) => change);
    const newUserProperties = Object.assign({}, loggedInUser.userProperties, ...allChanges);

    await postUserPropertiesOnline(loggedInUser.uuid, newUserProperties, options.abort);

    refetchCurrentUser();
  }
}
