import { useContext, useEffect, useMemo, useState } from "react";
import {
  getConfigStore,
  getExtensionConfigStore,
  ConfigStore,
} from "@openmrs/esm-config";
import { ComponentContext, ExtensionData } from "./ComponentContext";
import { ConfigObject } from "@openmrs/esm-config";
import { Store } from "unistore";

const promises: Record<string, Promise<ConfigObject>> = {};
const errorMessage = `No ComponentContext has been provided. This should come from "openmrsComponentDecorator".
Usually this is already applied when using "getAsyncLifecycle" or "getSyncLifecycle".`;

function readInitialConfig(store: Store<ConfigStore> | undefined) {
  if (!store) {
    return undefined;
  } else {
    return () => {
      const state = store.getState();

      if (state.loaded && state.config) {
        return state.config;
      }

      return undefined;
    };
  }
}

function createConfigPromise(store: Store<ConfigStore>) {
  return new Promise<ConfigObject>((resolve) => {
    const unsubscribe = store.subscribe((state) => {
      if (state.loaded && state.config) {
        resolve(state.config);
        unsubscribe();
      }
    });
  });
}

function useConfigStore(store: Store<ConfigStore> | undefined) {
  const [state, setState] = useState(readInitialConfig(store));

  useEffect(() => {
    return store?.subscribe((state) => {
      if (state.loaded && state.config) {
        setState(state.config);
      }
    });
  }, [store]);

  return state;
}

function useExtensionConfig(extension: ExtensionData | undefined) {
  const store = useMemo(
    () =>
      extension &&
      getExtensionConfigStore(
        extension.extensionSlotModuleName,
        extension.extensionSlotName,
        extension.extensionId
      ),
    [extension]
  );
  const state = useConfigStore(store);

  if (!state && extension) {
    const cacheId = `${extension.extensionSlotModuleName}-${extension.extensionSlotName}-${extension.extensionId}`;

    if (!promises[cacheId] && store) {
      promises[cacheId] = createConfigPromise(store);
    }

    // React will prevent the client component from rendering until the promise resolves
    throw promises[cacheId];
  }

  return state || {};
}

function useNormalConfig(moduleName: string) {
  const store = useMemo(() => getConfigStore(moduleName), [moduleName]);
  const cacheId = moduleName;
  const state = useConfigStore(store);

  if (!state) {
    if (!promises[cacheId]) {
      promises[cacheId] = createConfigPromise(store);
    }

    // React will prevent the client component from rendering until the promise resolves
    throw promises[cacheId];
  }

  return state;
}

/**
 * Use this React Hook to obtain your module's configuration.
 */
export function useConfig() {
  // This hook uses the config of the MF defining the component.
  // If the component is used in an extension slot then the slot
  // may override (part of) its configuration.
  const { moduleName, extension } = useContext(ComponentContext);

  if (!moduleName && !extension) {
    throw Error(errorMessage);
  }

  const normalConfig = useNormalConfig(moduleName);
  const extensionConfig = useExtensionConfig(extension);
  const config = useMemo(
    () => ({
      ...normalConfig,
      ...extensionConfig,
    }),
    [normalConfig, extensionConfig]
  );

  return config;
}
