import { useEffect, useState } from "react";
import { getAssignedIds } from "@openmrs/esm-extensions";
import { useExtensionSlotConfig } from "./useExtensionSlotConfig";
import { useAttachedExtensionIds } from "./useAttachedExtensionIds";

/**
 * Gets the assigned extension ids for a given extension slot name.
 * @param extensionSlotName
 */
export function useAssignedExtensionIds(extensionSlotName: string) {
  const config = useExtensionSlotConfig(extensionSlotName);
  const attachedIds = useAttachedExtensionIds(extensionSlotName);
  const [assignedIds, setAssignedIds] = useState<Array<string>>([]);

  useEffect(() => {
    const assignedIds = getAssignedIds(
      {
        addedIds: config.add || [],
        removedIds: config.remove || [],
        idOrder: config.order || [],
      },
      attachedIds
    );
    setAssignedIds(assignedIds);
  }, [attachedIds, config]);

  return assignedIds;
}
