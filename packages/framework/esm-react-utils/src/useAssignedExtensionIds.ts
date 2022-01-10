import { useEffect, useState } from "react";
import { getAssignedIds } from "@openmrs/esm-extensions";
import { useExtensionSlotConfig } from "./useExtensionSlotConfig";
import { useAttachedExtensionIds } from "./useAttachedExtensionIds";

/**
 * Gets the assigned extension ids for a given extension slot name.
 * Does not consider if offline or online.
 * @param extensionSlotName The name of the slot to get the assigned IDs for.
 */
export function useAssignedExtensionIds(extensionSlotName: string) {
  const config = useExtensionSlotConfig(extensionSlotName);
  const attachedIds = useAttachedExtensionIds(extensionSlotName);
  const [assignedIds, setAssignedIds] = useState<Array<string>>([]);

  useEffect(() => {
    const newAssignedIds = getAssignedIds(
      extensionSlotName,
      config,
      attachedIds
    );

    if (newAssignedIds.join(",") !== assignedIds.join(",")) {
      setAssignedIds(newAssignedIds);
    }
  }, [attachedIds, config]);

  return assignedIds;
}
