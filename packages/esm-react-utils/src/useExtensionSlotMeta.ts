import { useMemo } from "react";
import { useExtensionStore } from "./useExtensionStore";
import { useAssignedExtensionIds } from "./useAssignedExtensionIds";

/**
 * Extract meta data from all extension for a given extension slot.
 * @param extensionSlotName
 */
export function useExtensionSlotMeta(extensionSlotName: string) {
  const store = useExtensionStore();
  const assignedIds = useAssignedExtensionIds(extensionSlotName);

  return useMemo(
    () =>
      Object.fromEntries(
        assignedIds.map((id) => [id, store.extensions[id]?.meta])
      ),
    [assignedIds, store]
  );
}
