import { getCurrentUser, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework/src/internal';

export function getCurrentSession() {
  return openmrsFetch(`${restBaseUrl}/session`);
}

/**
 * Returns a promise producing the current user.
 */
export function getSynchronizedCurrentUser() {
  return getCurrentUser({ includeAuthStatus: true });
}
