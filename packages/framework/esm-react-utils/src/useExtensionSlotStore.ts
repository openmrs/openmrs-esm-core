/** @module @category Extension */
import { useCallback } from 'react';
import { type ExtensionSlotState, type ExtensionStore, getExtensionStore } from '@openmrs/esm-extensions';
import { useStore } from './useStore';

/**
 * Stands in for a slot that has not been registered or attached to. Shared rather than built per
 * call, so the snapshot stays reference-stable across renders.
 */
const emptySlotState: ExtensionSlotState = { assignedExtensions: [] };

export const useExtensionSlotStore = (slot: string) => {
  // Memoized so that `useStore`'s snapshot function is stable across renders.
  const select = useCallback((state: ExtensionStore) => state.slots?.[slot] ?? emptySlotState, [slot]);
  return useStore<ExtensionStore, ExtensionSlotState>(getExtensionStore(), select);
};
