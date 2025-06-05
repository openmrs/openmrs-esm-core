import { leftNavStore } from '@openmrs/esm-extensions';
import { useStore } from './useStore';

export function useLeftNavStore() {
  return useStore(leftNavStore);
}
