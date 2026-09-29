import { getCurrentUser } from '@openmrs/esm-framework/src/internal';

/**
 * Returns a promise producing the current user.
 */
export function getSynchronizedCurrentUser() {
  return getCurrentUser({ includeAuthStatus: true });
}
