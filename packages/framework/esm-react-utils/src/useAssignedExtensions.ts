/** @module @category Extension */
import { useEffect, useState } from "react";
import {
  AssignedExtension,
  ExtensionStore,
  getExtensionStore,
} from "@openmrs/esm-extensions";
import isEqual from "lodash-es/isEqual";

/**
 * Gets the assigned extensions for a given extension slot name.
 * Does not consider if offline or online.
 * @param slotName The name of the slot to get the assigned extensions for.
 */
export function useAssignedExtensions(slotName: string) {
  const [extensions, setExtensions] = useState<Array<AssignedExtension>>([]);

  useEffect(() => {
    function update(state: ExtensionStore) {
      const newExtensions = state.slots[slotName]?.assignedExtensions ?? [];
      if (!isEqual(newExtensions, extensions)) {
        setExtensions(newExtensions);
      }
    }
    update(getExtensionStore().getState());
    return getExtensionStore().subscribe(update);
  }, [slotName, extensions]);

  return extensions;
}
