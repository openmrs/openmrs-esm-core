import { useContext, useEffect, useState } from "react";
import {
  registerExtensionSlot,
  unregisterExtensionSlot,
  extensionStore,
  ExtensionStore,
} from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";

export function useExtensionSlot(slotName: string) {
  const { moduleName } = useContext(ComponentContext);

  if (!moduleName) {
    throw Error(
      "ComponentContext has not been provided. This should come from @openmrs/esm-react-utils."
    );
  }

  const [extensionIdsToRender, setState] = useState<Array<string>>([]);

  useEffect(() => {
    registerExtensionSlot(moduleName, slotName);
    return () => unregisterExtensionSlot(moduleName, slotName);
  }, []);

  useEffect(() => {
    const update = (state: ExtensionStore) => {
      const slotInfo = state.slots[slotName];

      if (slotInfo) {
        const instance = slotInfo.instances[moduleName];

        if (
          instance &&
          extensionIdsToRender.join(",") !== instance.assignedIds.join(",")
        ) {
          setState(instance.assignedIds);
        }
      }
    };

    update(extensionStore.getState());
    return extensionStore.subscribe(update);
  }, [extensionIdsToRender, moduleName]);

  return {
    extensionSlotModuleName: moduleName,
    extensionIdsToRender,
  };
}
