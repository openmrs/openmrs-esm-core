/** @module @category Config */
import { useContext, useEffect, useMemo, useState } from 'react';
import { isEqual } from 'lodash-es';
import type { StoreApi } from 'zustand';
import {
  type ConfigStore,
  type ConfigObject,
  type ExtensionsConfigStore,
  getConfigStore,
  getExtensionsConfigStore,
  getExtensionConfigFromStore,
  extensionHasOwnConfigSchema,
} from '@openmrs/esm-config';
import { type ExtensionData } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';

const promises: Record<string, Promise<ConfigObject>> = {};
const errorMessage = `No ComponentContext has been provided. This should come from "openmrsComponentDecorator".
Usually this is already applied when using "getAsyncLifecycle" or "getSyncLifecycle".`;

function readInitialConfig(store: StoreApi<ConfigStore>) {
  return () => {
    const state = store.getState();

    if (state.loaded && state.config) {
      return state.config;
    }

    return null;
  };
}

function readInitialExtensionConfig(store: StoreApi<ExtensionsConfigStore>, extension: ExtensionData | undefined) {
  if (extension) {
    return () => {
      const state = store.getState();
      const extConfig = getExtensionConfigFromStore(state, extension.extensionSlotName, extension.extensionId);
      if (extConfig.loaded && extConfig.config) {
        return extConfig.config;
      }
    };
  }
  return null;
}

function createConfigPromise(store: StoreApi<ConfigStore>) {
  return new Promise<ConfigObject>((resolve) => {
    const unsubscribe = store.subscribe((state) => {
      if (state.loaded && state.config) {
        resolve(state.config);
        unsubscribe();
      }
    });
  });
}

function createExtensionConfigPromise(store: StoreApi<ExtensionsConfigStore>, extension: ExtensionData) {
  return new Promise<ConfigObject>((resolve) => {
    const unsubscribe = store.subscribe((state) => {
      const extConfig = getExtensionConfigFromStore(state, extension.extensionSlotName, extension.extensionId);
      if (extConfig.loaded && extConfig.config) {
        resolve(extConfig.config);
        unsubscribe();
      }
    });
  });
}

function useConfigStore(store: StoreApi<ConfigStore>) {
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

function useExtensionConfigStore(store: StoreApi<ExtensionsConfigStore>, extension: ExtensionData | undefined) {
  const [config, setConfig] = useState<ConfigObject | null>(readInitialExtensionConfig(store, extension));

  useEffect(() => {
    if (extension) {
      return store.subscribe((state) => {
        const extConfig = getExtensionConfigFromStore(state, extension.extensionSlotName, extension.extensionId);
        if (extConfig.loaded && extConfig.config && !isEqual(extConfig.config, config)) {
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

export interface UseConfigOptions {
  /** An external module to load the configuration from. This option should only be used if
      absolutely necessary as it can end up making frontend modules coupled to one another. */
  externalModuleName?: string;
}

/**
 * Use this React Hook to obtain your module's configuration.
 *
 * @param options Additional options that can be passed to useConfig()
 */
export function useConfig<T = Record<string, any>>(options?: UseConfigOptions) {
  // This hook gets the appropriate configuration depending on whether the caller is a module
  // or an extension, which is determined from the ComponentContext. It will throw for suspense
  // if the configuration is not yet loaded.
  const { moduleName: contextModuleName, extension } = useContext(ComponentContext);
  const moduleName = options?.externalModuleName ?? contextModuleName;

  if (!moduleName && !extension) {
    throw Error(errorMessage);
  }

  const normalConfig = useNormalConfig(moduleName);
  const extensionConfig = useExtensionConfig(extension);

  // Determine if this extension has its own config schema
  const extensionName = extension?.extensionId ? getExtensionNameFromId(extension.extensionId) : null;
  const hasOwnSchema = extensionName ? extensionHasOwnConfigSchema(extensionName) : false;

  const config = useMemo(() => {
    if (options?.externalModuleName && moduleName === options.externalModuleName) {
      // When explicitly loading external module config, only return module config
      return { ...normalConfig };
    } else if (hasOwnSchema) {
      // When extension has its own config schema, use ONLY extension config
      return { ...extensionConfig };
    } else {
      // Otherwise merge module config with extension config
      return { ...normalConfig, ...extensionConfig };
    }
  }, [moduleName, options?.externalModuleName, normalConfig, extensionConfig, hasOwnSchema]);

  return config as T;
}

/**
 * Helper function to extract extension name from extension ID.
 * Copied from esm-extensions to avoid circular dependency.
 */
function getExtensionNameFromId(extensionId: string): string {
  const [extensionName] = extensionId.split('#');
  return extensionName;
}
