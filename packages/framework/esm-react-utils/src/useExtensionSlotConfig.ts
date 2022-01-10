import { useContext, useCallback } from "react";
import {
  ExtensionSlotConfigObject,
  ExtensionSlotConfigsStore,
  getExtensionSlotsConfigStore,
} from "@openmrs/esm-config";
import { ComponentContext } from "./ComponentContext";
import { useStoreState } from "./useStoreState";

const defaultConfig: ExtensionSlotConfigObject = {
  add: [],
  order: [],
  remove: [],
};

export function useExtensionSlotConfig(extensionSlotName: string) {
  const { moduleName } = useContext(ComponentContext);
  const store = getExtensionSlotsConfigStore(moduleName);
  const select = useCallback(
    (s: ExtensionSlotConfigsStore) => s.extensionSlotConfigs[extensionSlotName],
    [extensionSlotName]
  );
  const config = useStoreState(store, select);
  return config || defaultConfig;
}
