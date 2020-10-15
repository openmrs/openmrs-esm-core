import React, { useContext } from "react";
import {
  ExtensionContext,
  ModuleNameContext as SlotModuleNameContext,
} from "@openmrs/esm-core-context";
import * as Config from "../module-config/module-config";

let configCache = {};
let error;

/**
 * Use this React Hook to obtain the configuration for your extension.
 */
export function useExtensionConfig() {
  const slotModuleName = useContext(SlotModuleNameContext);
  if (!slotModuleName) {
    throw Error(
      "Slot ModuleNameContext has not been provided. This should come from openmrs-react-root-decorator in the module defining the extension slot."
    );
  }
  const { extensionSlotName, extensionId, extensionModuleName } = useContext(
    ExtensionContext
  );

  if (error) {
    // Suspense will just keep calling useConfig if the thrown promise rejects.
    // So we check ahead of time and avoid creating a new promise.
    throw error;
  }
  const uniqueExtensionLookupId = extensionSlotName + "-" + extensionId;
  if (!configCache[uniqueExtensionLookupId]) {
    // React will prevent the client component from rendering until the promise resolves
    throw Config.getExtensionConfig(
      slotModuleName,
      extensionModuleName,
      extensionSlotName,
      extensionId
    )
      .then((res) => {
        configCache[uniqueExtensionLookupId] = res;
      })
      .catch((err) => {
        error = err;
      });
  } else {
    return configCache[uniqueExtensionLookupId];
  }
}

export function clearConfig() {
  configCache = {};
}
