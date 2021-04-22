import { useEffect, useState, useContext } from "react";
import {
  ExtensionSlotConfigObject,
  getExtensionSlotsConfigStore,
} from "@openmrs/esm-config";
import { ComponentContext } from "./ComponentContext";

export function useExtensionSlotConfig(extensionSlotName: string) {
  const { moduleName } = useContext(ComponentContext);
  const [config, setConfig] = useState<ExtensionSlotConfigObject>(
    () =>
      getExtensionSlotsConfigStore(moduleName).getState().extensionSlotConfigs[
        extensionSlotName
      ] || { add: [], order: [], remove: [] }
  );

  useEffect(() => {
    return getExtensionSlotsConfigStore(moduleName).subscribe((s) =>
      setConfig(s.extensionSlotConfigs[extensionSlotName])
    );
  }, [moduleName, extensionSlotName]);

  return config;
}
