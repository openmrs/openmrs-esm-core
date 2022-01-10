import { useCallback } from "react";
import { extensionStore, ExtensionStore } from "@openmrs/esm-extensions";
import { useStoreState } from "./useStoreState";

const defaultArray: Array<string> = [];

/**
 * Gets the assigned extension ids for the given slot.
 * @param extensionSlotName
 */
export function useAttachedExtensionIds(extensionSlotName: string) {
  const select = useCallback(
    (s: ExtensionStore) => s.slots[extensionSlotName]?.attachedIds,
    [extensionSlotName]
  );
  const extensions = useStoreState(extensionStore, select);
  return extensions || defaultArray;
}
