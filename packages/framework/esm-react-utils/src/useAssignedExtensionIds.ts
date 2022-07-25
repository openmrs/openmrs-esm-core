/** @module @category Extension */
import { useEffect, useState } from "react";
import { getExtensionStore } from "@openmrs/esm-extensions";
import isEqual from "lodash-es/isEqual";

/**
 * Gets the assigned extension ids for a given extension slot name.
 * Does not consider if offline or online.
 * @param slotName The name of the slot to get the assigned IDs for.
 *
 * @deprecated Use `useAssignedExtensions`
 */
export function useAssignedExtensionIds(slotName: string) {
  const [ids, setIds] = useState<Array<string>>([]);

  useEffect(() => {
    return getExtensionStore().subscribe((state) => {
      const newIds =
        state.slots[slotName]?.assignedExtensions.map((e) => e.id) ?? [];
      if (!isEqual(newIds, ids)) {
        setIds(newIds);
      }
    });
  }, []);

  return ids;
}
