import { MutableRefObject, useContext, useEffect, useState } from "react";
import {
  registerExtensionSlot,
  unregisterExtensionSlot,
  extensionStore,
  ExtensionStore,
} from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";

export function useExtensionSlot(
  actualExtensionSlotName: string,
  ref: MutableRefObject<HTMLElement | null>
) {
  const { moduleName } = useContext(ComponentContext);
  const extensionSlotModuleName = moduleName;

  if (!extensionSlotModuleName) {
    throw Error(
      "ModuleNameContext has not been provided. This should come from @openmrs/esm-react-utils."
    );
  }

  const [
    [attachedExtensionSlotName, extensionIdsToRender],
    setState,
  ] = useState<[string | undefined, Array<string>]>([undefined, []]);

  useEffect(() => {
    if (ref.current) {
      registerExtensionSlot(
        extensionSlotModuleName,
        actualExtensionSlotName,
        ref.current
      );
      return () =>
        unregisterExtensionSlot(
          extensionSlotModuleName,
          actualExtensionSlotName
        );
    }
  }, [ref.current]);

  useEffect(() => {
    const update = (state: ExtensionStore) => {
      const slotInfo = Object.values(state.slots).find((slotDef) =>
        slotDef.matches(actualExtensionSlotName)
      );

      if (slotInfo) {
        const instance = slotInfo.instances[extensionSlotModuleName];

        if (
          instance &&
          (attachedExtensionSlotName !== slotInfo.name ||
            extensionIdsToRender.join(",") !== instance.assignedIds.join(","))
        ) {
          setState([slotInfo.name, instance.assignedIds]);
        }
      }
    };

    update(extensionStore.getState());
    return extensionStore.subscribe((state) => update(state));
  }, [
    attachedExtensionSlotName,
    extensionIdsToRender,
    extensionSlotModuleName,
  ]);

  return {
    extensionSlotModuleName,
    attachedExtensionSlotName,
    extensionIdsToRender,
  };
}
