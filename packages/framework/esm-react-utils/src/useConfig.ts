/** @module @category Config */
import { useContext, useEffect, useMemo, useState } from "react";
import {
  getConfigStore,
  getExtensionsConfigStore,
  ConfigStore,
  ConfigObject,
  ExtensionsConfigStore,
  getExtensionConfigFromStore,
} from "@openmrs/esm-config";
import { ComponentContext, ExtensionData } from "./ComponentContext";
import { Store } from "unistore";
import isEqual from "lodash-es/isEqual";

const promises: Record<string, Promise<ConfigObject>> = {};
const errorMessage = `No ComponentContext has been provided. This should come from "openmrsComponentDecorator".
Usually this is already applied when using "getAsyncLifecycle" or "getSyncLifecycle".`;

function readInitialConfig(store: Store<ConfigStore>) {
  return () => {
    const state = store.getState();

    if (state.loaded && state.config) {
      return state.config;
    }

    return null;
  };
}

function readInitialExtensionConfig(
  store: Store<ExtensionsConfigStore>,
  extension: ExtensionData | undefined
) {
  if (extension) {
    return () => {
      const state = store.getState();
      const extConfig = getExtensionConfigFromStore(
        state,
        extension.extensionSlotName,
        extension.extensionId
      );
      if (extConfig.loaded && extConfig.config) {
        return extConfig.config;
      }
    };
  }
  return null;
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

function createExtensionConfigPromise(
  store: Store<ExtensionsConfigStore>,
  extension: ExtensionData
) {
  return new Promise<ConfigObject>((resolve) => {
    const unsubscribe = store.subscribe((state) => {
      const extConfig = getExtensionConfigFromStore(
        state,
        extension.extensionSlotName,
        extension.extensionId
      );
      if (extConfig.loaded && extConfig.config) {
        resolve(extConfig.config);
        unsubscribe();
      }
    });
  });
}

function useConfigStore(store: Store<ConfigStore>) {
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

function useExtensionConfigStore(
  store: Store<ExtensionsConfigStore>,
  extension: ExtensionData | undefined
) {
  const [config, setConfig] = useState<ConfigObject | null>(
    readInitialExtensionConfig(store, extension)
  );

  useEffect(() => {
    if (extension) {
      return store.subscribe((state) => {
        const extConfig = getExtensionConfigFromStore(
          state,
          extension.extensionSlotName,
          extension.extensionId
        );
        if (
          extConfig.loaded &&
          extConfig.config &&
          !isEqual(extConfig.config, config)
        ) {
          setConfig(extConfig.config);
        }
      });
    }
  }, [store, extension, config]);

  return config;
}

function useExtensionConfig(extension: ExtensionData | undefined) {
  const store = useMemo(getExtensionsConfigStore, []);
  const state = useExtensionConfigStore(store, extension);

  if (!state && extension) {
    const cacheId = `${extension.extensionSlotName}-${extension.extensionId}`;

    if (!promises[cacheId] && store) {
      promises[cacheId] = createExtensionConfigPromise(store, extension);
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
export function useConfig<
  T = Omit<ConfigObject, "Display conditions" | "Translation overrides">
>() {
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

  return config as T;
}
