import { useContext } from "react";
import {
  getConfigStore,
  getExtensionConfigStore,
  ConfigStore,
} from "@openmrs/esm-config";
import { ModuleNameContext } from "./ModuleNameContext";
import { ExtensionContext } from "./ExtensionContext";
import { ConfigObject } from "@openmrs/esm-config/src/types";
import isEqual from "lodash-es/isEqual";

let error: Error | undefined;
const promises: Record<string, Promise<ConfigObject>> = {};
const configs: Record<string, ConfigObject> = {};

/**
 * Use this React Hook to obtain your module's configuration.
 */
export function useConfig() {
  // This hook uses the extension config if an ExtensionContext is
  // found, and uses the normal config if the ModuleNameContext is
  // found.
  const {
    extensionId,
    attachedExtensionSlotName,
    extensionSlotModuleName,
  } = useContext(ExtensionContext);

  const moduleName = useContext(ModuleNameContext);

  if (!moduleName && !extensionId) {
    throw Error(
      "Neither ModuleNameContext nor ExtensionCotext were provided. " +
        "They should come from `openmrsRootDecorator` or `openmrsExtensionDecorator` respectively. " +
        "These usually come from `get[Async]RootLifecycle` or `get[Async]ExtensionLifecycle`, respectively."
    );
  }

  const cacheId = moduleName || `${attachedExtensionSlotName}-${extensionId}`;

  if (error) {
    // Suspense will just keep calling useConfig if the thrown promise rejects.
    // So we check ahead of time and avoid creating a new promise.
    throw error;
  }

  if (!configs[cacheId]) {
    if (!promises[cacheId]) {
      promises[cacheId] = new Promise((resolve, reject) => {
        const store = moduleName
          ? getConfigStore(moduleName)
          : getExtensionConfigStore(
              extensionSlotModuleName,
              attachedExtensionSlotName,
              extensionId
            );
        function update(state: ConfigStore) {
          if (state.loaded && state.config) {
            if (!isEqual(state.config, configs[cacheId])) {
              configs[cacheId] = state.config;
              resolve(state.config);
              unsubscribe && unsubscribe();
            }
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
