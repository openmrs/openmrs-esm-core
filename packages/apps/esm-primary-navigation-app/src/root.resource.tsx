import {
  getCurrentUser,
  getSynchronizationItemsFor,
  openmrsObservableFetch,
  restBaseUrl,
} from '@openmrs/esm-framework/src/internal';
import { mergeMap } from 'rxjs/operators';
import { userPropertyChange } from './constants';

export function getCurrentSession() {
  return openmrsObservableFetch(`${restBaseUrl}/session`);
}

/**
 * Returns an observable producing the current user, but also applies any unsynchronized user property
 * changes to that user.
 */
export function getSynchronizedCurrentUser() {
  return getCurrentUser({ includeAuthStatus: true }).pipe(
    mergeMap(async (result) => {
      const { user } = result;

      if (user) {
        const allChanges = await getSynchronizationItemsFor<any>(user.uuid, userPropertyChange);
        Object.assign(user.userProperties, ...allChanges);
      }

      return result;
    }),
  );
}
