import { useCallback } from "react";
import {
  ExtensionSlotConfigObject,
  ExtensionSlotConfigStore,
  getExtensionSlotConfigStore,
} from "@openmrs/esm-config";
import { useStoreState } from "./useStoreState";

const defaultConfig: ExtensionSlotConfigObject = {
  add: [],
  order: [],
  remove: [],
};

/** @internal */
export function useExtensionSlotConfig(slotName: string) {
  const store = getExtensionSlotConfigStore(slotName);
  const select = useCallback(
    (s: ExtensionSlotConfigStore) => s.config,
    [slotName]
  );
  const config = useStoreState(store, select);
  return config || defaultConfig;
}
