/** @module @category Extension */
import type { ExtensionStore } from '@openmrs/esm-extensions';
import { getExtensionStore } from '@openmrs/esm-extensions';
import { createUseStore } from './useStore';

export const useExtensionStore = createUseStore<ExtensionStore>(getExtensionStore());
