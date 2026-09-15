import {
  cleanupObsoleteFeatureFlags,
  getCurrentUser,
  subscribeOpenmrsEvent,
} from '@openmrs/esm-framework/src/internal';
import { filter, take } from 'rxjs/operators';
import { setupOptionalDependencies } from './optionaldeps';

subscribeOpenmrsEvent('started', () => cleanupObsoleteFeatureFlags());
subscribeOpenmrsEvent('started', () => {
  getCurrentUser()
    .pipe(
      filter((session) => session.authenticated),
      take(1),
    )
    .subscribe(() => setupOptionalDependencies());
});
