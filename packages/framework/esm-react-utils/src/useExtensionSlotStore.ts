/** @module @category Extension */
import { type ExtensionSlotState, type ExtensionStore, getExtensionStore } from '@openmrs/esm-extensions';
import { useStore } from './useStore';

export const useExtensionSlotStore = (slot: string) =>
  useStore<ExtensionStore, ExtensionSlotState>(getExtensionStore(), (state) => state.slots?.[slot]);
