import { useContext, useEffect, useMemo } from "react";
import {
  registerExtensionSlot,
  unregisterExtensionSlot,
  ExtensionRegistration,
  checkStatusFor,
  extensionStore,
  getExtensionRegistrationFrom,
} from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";
import { useAssignedExtensionIds } from "./useAssignedExtensionIds";
import { useConnectivity } from "./useConnectivity";

function isValidExtension(
  extension: ExtensionRegistration | undefined
): extension is ExtensionRegistration {
  return extension !== undefined;
}

export function useExtensionSlot(extensionSlotName: string) {
  const { moduleName } = useContext(ComponentContext);

  if (!moduleName) {
    throw Error(
      "ComponentContext has not been provided. This should come from @openmrs/esm-react-utils."
    );
  }

  const online = useConnectivity();

  useEffect(() => {
    registerExtensionSlot(moduleName, extensionSlotName);
    return () => unregisterExtensionSlot(moduleName, extensionSlotName);
  }, []);

  const extensionIdsToRender = useAssignedExtensionIds(extensionSlotName);
  const extensions = useMemo(() => {
    const state = extensionStore.getState();
    return extensionIdsToRender
      .map((m) => getExtensionRegistrationFrom(state, m))
      .filter(isValidExtension)
      .filter((m) => checkStatusFor(online, m.online, m.offline));
  }, [extensionIdsToRender, online]);

  return {
    extensions,
    extensionSlotName,
    extensionSlotModuleName: moduleName,
  };
}
