import {
  cleanupObsoleteFeatureFlags,
  getSessionStore,
  subscribeOpenmrsEvent,
} from '@openmrs/esm-framework/src/internal';
import { setupOptionalDependencies } from './optionaldeps';

subscribeOpenmrsEvent('started', () => cleanupObsoleteFeatureFlags());
subscribeOpenmrsEvent('started', () => {
  const store = getSessionStore();
  let unsubscribe: (() => void) | undefined;
  const handle = ({ loaded, session }: ReturnType<typeof store.getState>) => {
    if (loaded && session?.authenticated) {
      unsubscribe?.();
      setupOptionalDependencies();
    }
  };
  unsubscribe = store.subscribe(handle);
  handle(store.getState());
});
