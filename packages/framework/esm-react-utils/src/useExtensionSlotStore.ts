/** @module @category Extension */
import { useCallback } from 'react';
import {
  type AssignedExtension,
  type ExtensionSlotState,
  type ExtensionStore,
  getExtensionStore,
} from '@openmrs/esm-extensions';
import { useStore } from './useStore';

/**
 * Stands in for a slot that has not been registered or attached to. Shared rather than built per
 * call, so the snapshot stays reference-stable across renders — and frozen because that sharing
 * means an in-place sort or push would otherwise corrupt every unregistered slot in the page.
 */
const emptyCandidates: Array<AssignedExtension> = [];
Object.freeze(emptyCandidates);

const emptySlotState: ExtensionSlotState = { candidateExtensions: emptyCandidates };
Object.freeze(emptySlotState);

export const useExtensionSlotStore = (slot: string) => {
  // Memoized so that `useStore`'s snapshot function is stable across renders.
  const select = useCallback((state: ExtensionStore) => state.slots?.[slot] ?? emptySlotState, [slot]);
  return useStore<ExtensionStore, ExtensionSlotState>(getExtensionStore(), select);
};
