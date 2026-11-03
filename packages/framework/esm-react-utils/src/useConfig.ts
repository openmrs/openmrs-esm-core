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

/**
 * The promise a suspended `useConfig()` throws, so every component waiting on the same config waits on
 * one promise and a re-render throws the same one rather than starting again.
 *
 * The entry is dropped once it settles: an extension's config exists only while that extension is
 * mounted, so the same id can have to wait a second time and a settled promise cannot describe that.
 */
function whenConfigReady<S>(
  cacheId: string,
  store: StoreApi<S>,
  read: (state: S) => ConfigObject | null | undefined,
): Promise<ConfigObject> {
  const cached = promises[cacheId];

  if (cached) {
    return cached;
  }

  const promise = new Promise<ConfigObject>((resolve) => {
    const current = read(store.getState());

    if (current) {
      resolve(current);
      return;
    }

    const unsubscribe = store.subscribe((state) => {
      const config = read(state);

      if (config) {
        unsubscribe();
        resolve(config);
      }
    });
  });

  promises[cacheId] = promise;
  void promise.then(() => {
    // Guarded so that a later wait under the same id, started after this one settled, is left alone.
    if (promises[cacheId] === promise) {
      delete promises[cacheId];
    }
  });

  return promise;
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
    // React will prevent the client component from rendering until the promise resolves
    throw whenConfigReady(`${extension.extensionSlotName}-${extension.extensionId}`, store, (storeState) => {
      const extConfig = getExtensionConfigFromStore(storeState, extension.extensionSlotName, extension.extensionId);
      return extConfig.loaded ? extConfig.config : null;
    });
  }

  return state || {};
}

function useNormalConfig(moduleName: string) {
  const store = useMemo(() => getConfigStore(moduleName), [moduleName]);
  const state = useConfigStore(store);

  if (!state) {
    // React will prevent the client component from rendering until the promise resolves
    throw whenConfigReady(moduleName, store, (storeState) => (storeState.loaded ? storeState.config : null));
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
  const config = useMemo(
    () =>
      options?.externalModuleName && moduleName === options.externalModuleName
        ? { ...normalConfig }
        : { ...normalConfig, ...extensionConfig },
    [moduleName, options?.externalModuleName, normalConfig, extensionConfig],
  );

  return config as T;
}
