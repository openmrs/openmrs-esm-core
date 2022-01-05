import { useContext, useEffect } from "react";
import { registerExtensionSlot } from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";
import { useConnectedExtensions } from "./useConnectedExtensions";

/** @internal */
export function useExtensionSlot(slotName: string) {
  const { moduleName } = useContext(ComponentContext);

  if (!moduleName) {
    throw Error(
      "ComponentContext has not been provided. This should come from @openmrs/esm-react-utils."
    );
  }

  useEffect(() => {
    registerExtensionSlot(moduleName, slotName);
  }, []);

  const extensions = useConnectedExtensions(slotName);

  return {
    extensions,
    extensionSlotName: slotName,
    extensionSlotModuleName: moduleName,
  };
}
