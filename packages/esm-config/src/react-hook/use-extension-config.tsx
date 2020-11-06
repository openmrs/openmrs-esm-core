import { useContext, useEffect } from "react";
import {
  ExtensionContext,
  ModuleNameContext as SlotModuleNameContext,
} from "@openmrs/esm-context";
import * as Config from "../module-config/module-config";
import {
  configCache,
  configCacheNotifier,
  useForceUpdate,
} from "./config-cache";

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
  const { actualExtensionSlotName, extensionId, extensionModuleName } = useContext(
    ExtensionContext
  );
  const forceUpdate = useForceUpdate();

  function getConfigAndSetCache(slotModuleName: string) {
    return Config.getExtensionConfig(
      slotModuleName,
      extensionModuleName,
      actualExtensionSlotName,
      extensionId
    )
      .then((res) => {
        configCache[uniqueExtensionLookupId] = res;
        forceUpdate();
      })
      .catch((err) => {
        error = err;
      });
  }

  useEffect(() => {
    const sub = configCacheNotifier.subscribe(() => {
      getConfigAndSetCache(slotModuleName);
    });
    return () => sub.unsubscribe();
  }, [slotModuleName]);

  if (error) {
    // Suspense will just keep calling useConfig if the thrown promise rejects.
    // So we check ahead of time and avoid creating a new promise.
    throw error;
  }
  const uniqueExtensionLookupId = `${actualExtensionSlotName}-${extensionId}`;
  if (!configCache[uniqueExtensionLookupId]) {
    // React will prevent the client component from rendering until the promise resolves
    throw getConfigAndSetCache(slotModuleName);
  } else {
    return configCache[uniqueExtensionLookupId];
  }
}
