import {
  cleanupObsoleteFeatureFlags,
  getCurrentUser,
  subscribeOpenmrsEvent,
} from '@openmrs/esm-framework/src/internal';
import { setupOptionalDependencies } from './optionaldeps';

subscribeOpenmrsEvent('started', () => cleanupObsoleteFeatureFlags());
subscribeOpenmrsEvent('started', () => {
  const subscription = getCurrentUser().subscribe((session) => {
    if (session.authenticated) {
      subscription?.unsubscribe();
      setupOptionalDependencies();
    }
  });
});
