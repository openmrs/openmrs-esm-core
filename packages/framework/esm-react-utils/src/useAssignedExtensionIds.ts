/** @module @category Extension */
import { useMemo } from 'react';
import { useAssignedExtensions } from './useAssignedExtensions';

/**
 * Gets the assigned extension ids for a given extension slot name.
 *
 * @param slotName The name of the slot to get the assigned IDs for.
 *
 * @deprecated Use `useAssignedExtensions`
 */
export function useAssignedExtensionIds(slotName: string) {
  const assignedExtensions = useAssignedExtensions(slotName);

  return useMemo(() => assignedExtensions.map((extension) => extension.id), [assignedExtensions]);
}
