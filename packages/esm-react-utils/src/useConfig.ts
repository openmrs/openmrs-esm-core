import { useContext, useEffect, useMemo } from "react";
import {
  getConfigStore,
  getExtensionConfigStore,
  ConfigStore,
} from "@openmrs/esm-config";
import { ComponentContext } from "./ComponentContext";
import { ConfigObject } from "@openmrs/esm-config";
import { useForceUpdate } from "./useForceUpdate";

let error: Error | undefined;
const promises: Record<string, Promise<ConfigObject>> = {};
const configs: Record<string, ConfigObject> = {};

const errorMessage = `No ComponentContext has been provided.
This should come from "openmrsComponentDecorator".
Usually this is already applied when using "get[Async]Lifecycle".`;

/**
 * Use this React Hook to obtain your module's configuration.
 */
export function useConfig() {
  // This hook uses the extension config if an ExtensionContext is
  // found, and uses the normal config if the ModuleNameContext is
  // found.
  const { moduleName, extension } = useContext(ComponentContext);
  const forceUpdate = useForceUpdate();

  if (!moduleName && !extension) {
    throw Error(errorMessage);
  }

  const store = useMemo(
    () =>
      !extension
        ? getConfigStore(moduleName)
        : getExtensionConfigStore(
            extension.extensionSlotModuleName,
            extension.extensionSlotName,
            extension.extensionId
          ),
    [moduleName, extension]
  );

  const cacheId = extension
    ? `${extension.extensionSlotName}-${extension.extensionId}`
    : moduleName;

  useEffect(() => {
    return store.subscribe((state) => {
      if (state.loaded && state.config) {
        configs[cacheId] = state.config;
        forceUpdate();
      }
    });
  }, [store]);

  if (error) {
    // Suspense will just keep calling useConfig if the thrown promise rejects.
    // So we check ahead of time and avoid creating a new promise.
    throw error;
  }

  if (!configs[cacheId]) {
    if (!promises[cacheId]) {
      promises[cacheId] = new Promise((resolve) => {
        function update(state: ConfigStore) {
          if (state.loaded && state.config) {
            configs[cacheId] = state.config;
            resolve(state.config);
            unsubscribe && unsubscribe();
          }
        }

        update(store.getState());
        const unsubscribe = store.subscribe(update);
      });
    }

    // React will prevent the client component from rendering until the promise resolves
    throw promises[cacheId];
  } else {
    return configs[cacheId];
  }
}
