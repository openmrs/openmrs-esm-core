import { useContext, useEffect } from "react";
import {
  getConfig,
  configCache,
  configCacheNotifier,
  getExtensionConfig,
} from "@openmrs/esm-config";
import { ModuleNameContext } from "./ModuleNameContext";
import { ExtensionContext } from "./ExtensionContext";
import { useForceUpdate } from "./useForceUpdate";

let error: Error | undefined;

/**
 * Use this React Hook to obtain your module's configuration.
 */
export function useConfig() {
  // This hook uses the extension config if an ExtensionContext is
  // found, and uses the normal config if the ModuleNameContext is
  // found.
  const {
    extensionId,
    extensionModuleName,
    attachedExtensionSlotName,
    extensionSlotModuleName,
  } = useContext(ExtensionContext);

  const moduleName = useContext(ModuleNameContext);

  const forceUpdate = useForceUpdate();

  if (!moduleName && !extensionId) {
    throw Error(
      "Neither ModuleNameContext nor ExtensionCotext were provided. " +
        "They should come from `openmrsRootDecorator` or `openmrsExtensionDecorator` respectively. " +
        "These usually come from `get[Async]RootLifecycle` or `get[Async]ExtensionLifecycle`, respectively."
    );
  }

  const cacheId = moduleName || `${attachedExtensionSlotName}-${extensionId}`;

  function getConfigAndSetCache(lookupName: string) {
    const getConfigPromise = moduleName
      ? getConfig(lookupName)
      : getExtensionConfig(
          lookupName,
          extensionModuleName,
          attachedExtensionSlotName,
          extensionId
        );
    return getConfigPromise
      .then((res) => {
        configCache[cacheId] = res;
        forceUpdate();
      })
      .catch((err) => {
        error = err;
      });
  }

  useEffect(() => {
    const sub = configCacheNotifier.subscribe(() => {
      getConfigAndSetCache(moduleName || extensionSlotModuleName);
    });
    return () => sub.unsubscribe();
  }, [moduleName, extensionSlotModuleName]);

  if (error) {
    // Suspense will just keep calling useConfig if the thrown promise rejects.
    // So we check ahead of time and avoid creating a new promise.
    throw error;
  }

  if (!configCache[cacheId]) {
    // React will prevent the client component from rendering until the promise resolves
    throw getConfigAndSetCache(moduleName || extensionSlotModuleName);
  } else {
    return configCache[cacheId];
  }
}
