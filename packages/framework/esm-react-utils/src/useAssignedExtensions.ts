/** @module @category Extension */
import { useMemo } from 'react';
import { useExtensionStore } from './useExtensionStore';

/**
 * Gets the assigned extensions for a given extension slot name.
 * Does not consider if offline or online.
 * @param slotName The name of the slot to get the assigned extensions for.
 */
export function useAssignedExtensions(slotName: string) {
  const { slots } = useExtensionStore();

  const extensions = useMemo(() => {
    return slots[slotName]?.assignedExtensions ?? [];
  }, [slots, slotName]);

  return extensions;
}
