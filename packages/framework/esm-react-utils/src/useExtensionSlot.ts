import { useContext, useEffect } from "react";
import {
  registerExtensionSlot,
  unregisterExtensionSlot,
} from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";
import { useConnectedExtensions } from "./useConnectedExtensions";

export function useExtensionSlot(extensionSlotName: string) {
  const { moduleName } = useContext(ComponentContext);

  if (!moduleName) {
    throw Error(
      "ComponentContext has not been provided. This should come from @openmrs/esm-react-utils."
    );
  }

  useEffect(() => {
    registerExtensionSlot(moduleName, extensionSlotName);
    return () => unregisterExtensionSlot(moduleName, extensionSlotName);
  }, []);

  const extensions = useConnectedExtensions(extensionSlotName);

  return {
    extensions,
    extensionSlotName,
    extensionSlotModuleName: moduleName,
  };
}
