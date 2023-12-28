import type { ExtensionInternalStore } from '@openmrs/esm-extensions';
import { getExtensionInternalStore } from '@openmrs/esm-extensions';
import { createUseStore } from './useStore';

/** @internal
 * @deprecated Use `useStore(getExtensionInternalStore())`
 */
export const useExtensionInternalStore = createUseStore<ExtensionInternalStore>(getExtensionInternalStore());
