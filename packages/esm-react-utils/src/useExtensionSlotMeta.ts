import { useEffect, useState, useContext } from "react";
import {
  extensionStore,
  ExtensionMeta,
  getAssignedIds,
  ExtensionSlotInstance,
} from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";
import {
  ExtensionSlotConfigObject,
  getExtensionSlotsConfigStore,
} from "@openmrs/esm-config";

const useExtensionSlotConfigDecorator = (extensionSlotName: string) => {
  const { moduleName } = useContext(ComponentContext);
  const [config, setConfig] = useState<ExtensionSlotConfigObject>(
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
};

/**
 * Extract meta data from all extension for a given extension slot
 * @param extensionSlotName
 */
export const useExtensionSlotMeta = (extensionSlotName: string) => {
  const [meta, setMeta] = useState<Record<string, ExtensionMeta>>({});
  const [config, setConfig] = useState(extensionStore.getState());
  const configDecorator = useExtensionSlotConfigDecorator(extensionSlotName);

  useEffect(() => {
    if (!config.slots[extensionSlotName]) return;

    const assignedIds = getAssignedIds(
      {
        addedIds: configDecorator.add || [],
        removedIds: configDecorator.remove || [],
        idOrder: configDecorator.order || [],
      } as ExtensionSlotInstance,
      config.slots[extensionSlotName].attachedIds
    );

    setMeta(
      Object.fromEntries(
        assignedIds.map((id) => [id, config.extensions[id]?.meta])
      )
    );
  }, [config, configDecorator, extensionSlotName]);

  useEffect(() => {
    return extensionStore.subscribe(setConfig);
  }, [extensionSlotName]);

  return meta;
};
