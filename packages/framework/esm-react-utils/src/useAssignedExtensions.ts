import { useEffect, useState } from "react";
import { AssignedExtension, extensionStore } from "@openmrs/esm-extensions";
import { isEqual } from "lodash";

/**
 * Gets the assigned extensions for a given extension slot name.
 * Does not consider if offline or online.
 * @param slotName The name of the slot to get the assigned extensions for.
 */
export function useAssignedExtensions(slotName: string) {
  const [extensions, setExtensions] = useState<Array<AssignedExtension>>([]);

  useEffect(() => {
    return extensionStore.subscribe((state) => {
      const newExtensions =
        state.resultSlots[slotName]?.assignedExtensions ?? [];
      if (!isEqual(newExtensions, extensions)) {
        setExtensions(newExtensions);
      }
    });
  }, []);

  return extensions;
}
