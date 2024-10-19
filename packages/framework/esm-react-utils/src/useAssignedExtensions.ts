/** @module @category Extension */
import { useExtensionSlotStore } from './useExtensionSlotStore';

/**
 * Gets the assigned extensions for a given extension slot name.
 * @param slotName The name of the slot to get the assigned extensions for.
 */
export function useAssignedExtensions(slotName: string) {
  const slotStore = useExtensionSlotStore(slotName);
  return slotStore?.assignedExtensions ?? [];
}
