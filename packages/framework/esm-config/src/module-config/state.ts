import { createGlobalStore, getGlobalStore } from '@openmrs/esm-state';
import { shallowEqual } from '@openmrs/esm-utils';
import { type StoreApi } from 'zustand';
import type { Config, ConfigObject, ConfigSchema, ExtensionSlotConfig, ProvidedConfig } from '../types';

/**
 * Internal store
 *   A store of the inputs and internal state
 * @internal
 */
export interface ConfigInternalStore {
  /** Configs added using the `provide` function */
  providedConfigs: Array<ProvidedConfig>;
  /** An object with module names for keys and schemas for values */
  schemas: Record<string, ConfigSchema>;
  /**
   * Before modules are loaded, they get implicit schemas added to `schemas`. Therefore
   * we need to track separately whether they have actually been loaded (that is,
   * whether the schema has actually been defined).
   */
  moduleLoaded: Record<string, boolean>;
}

const configInternalStoreInitialValue = {
  providedConfigs: [],
  schemas: {},
  moduleLoaded: {},
};

/**
 * @internal
 */
export const configInternalStore = createGlobalStore<ConfigInternalStore>(
  'config-internal',
  configInternalStoreInitialValue,
);

/**
 * Temporary config
 *   LocalStorage-based config used by the implementer tools
 * @internal
 */
export interface TemporaryConfigStore {
  config: Config;
}

/** @internal */
export const temporaryConfigStore = createGlobalStore<TemporaryConfigStore>('temporary-config', {
  config: getTemporaryConfig(),
});

temporaryConfigStore.subscribe((state) => {
  setTemporaryConfig(state.config);
});

function setTemporaryConfig(value: Config) {
  try {
    localStorage.setItem('openmrs:temporaryConfig', JSON.stringify(value));
  } catch (e) {
    // localStorage may not be available in all environments
  }
}

function getTemporaryConfig(): Config {
  try {
    return JSON.parse(localStorage.getItem('openmrs:temporaryConfig') || '{}');
  } catch (e) {
    return {};
  }
}

/**
 * Config-side extension store
 *   Just what esm-config needs to know about extension state. This
 *   is to avoid having esm-config depend on esm-extensions, which would
 *   create a circular dependency.
 * @internal
 */
export interface ConfigExtensionStore {
  mountedExtensions: Array<ConfigExtensionStoreElement>;
}

/** @internal */
export interface ConfigExtensionStoreElement {
  slotModuleName: string;
  extensionModuleName: string;
  slotName: string;
  extensionId: string;
}

/** @internal */
export const configExtensionStore = createGlobalStore<ConfigExtensionStore>('config-store-of-extension-state', {
  mountedExtensions: [],
});

/**
 * Output configs
 *
 * Each module has its own stores for its config and its extension slots' configs.
 * @internal
 */
export interface ConfigStore {
  config: ConfigObject | null;
  loaded: boolean;
  translationOverridesLoaded: boolean;
}

function initializeConfigStore() {
  return {
    config: null,
    loaded: false,
    translationOverridesLoaded: false,
  };
}

/**
 * Returns the configuration store for a specific module. Each module has its
 * own store that tracks the loading state and resolved configuration values.
 *
 * @param moduleName The name of the module whose config store to retrieve.
 * @returns A Zustand store containing the module's configuration state.
 *
 * @internal
 */
export function getConfigStore(moduleName: string) {
  // We use a store for each module's config, named `config-module-${moduleName}`
  return getGlobalStore<ConfigStore>(`config-module-${moduleName}`, initializeConfigStore());
}

/**
 * Configuration for all the specific extension slots
 * @internal
 */
export interface ExtensionSlotsConfigStore {
  slots: {
    [slotName: string]: {
      config: ExtensionSlotConfig;
      loaded: boolean;
    };
  };
}

/** @internal */
export function getExtensionSlotsConfigStore() {
  return getGlobalStore<ExtensionSlotsConfigStore>(`config-extension-slots`, {
    slots: {},
  });
}

/** @internal */
export function getExtensionSlotConfig(slotName: string) {
  return getExtensionSlotConfigFromStore(getExtensionSlotsConfigStore().getState(), slotName);
}

/** @internal */
export function getExtensionSlotConfigFromStore(state: ExtensionSlotsConfigStore, slotName: string) {
  const slotConfig = state.slots[slotName];
  return slotConfig ?? { loaded: false, config: {} };
}

/** @internal */
export interface ExtensionsConfigStore {
  configs: {
    [slotName: string]: {
      [extensionId: string]: ConfigStore;
    };
  };
}

/**
 * One store for all the extensions
 * @internal
 */
export function getExtensionsConfigStore() {
  return getGlobalStore<ExtensionsConfigStore>(`config-extensions`, {
    configs: {},
  });
}

/** @internal */
export function getExtensionConfig(
  slotName: string,
  extensionId: string,
): StoreApi<Omit<ConfigStore, 'translationOverridesLoaded'>> {
  if (
    typeof slotName !== 'string' ||
    typeof extensionId !== 'string' ||
    slotName === '__proto__' ||
    extensionId === '__proto__' ||
    slotName === 'constructor' ||
    extensionId === 'constructor' ||
    slotName === 'prototype' ||
    extensionId === 'prototype'
  ) {
    throw new Error('Attempted to call `getExtensionConfig()` with invalid argument');
  }

  const extensionConfigStore = getExtensionsConfigStore();
  const selector = (configStore: ExtensionsConfigStore) => configStore.configs[slotName]?.[extensionId];

  return {
    getInitialState() {
      return selector(extensionConfigStore.getInitialState());
    },
    getState() {
      return selector(extensionConfigStore.getState()) ?? { loaded: false, config: null };
    },
    setState(
      partial: ConfigStore | Partial<ConfigStore> | ((state: ConfigStore) => ConfigStore | Partial<ConfigStore>),
      replace: boolean = false,
    ) {
      extensionConfigStore.setState((state) => {
        if (!state.configs[slotName]) {
          state.configs[slotName] = {};
        }

        const newState = typeof partial === 'function' ? partial(state.configs.slotName[extensionId]) : partial;
        if (replace) {
          state.configs[slotName][extensionId] = Object.assign({}, newState) as ConfigStore;
        } else {
          state.configs[slotName][extensionId] = Object.assign({}, state.configs[slotName][extensionId], newState);
        }

        return state;
      });
    },
    subscribe(listener) {
      return extensionConfigStore.subscribe((state, prevState) => {
        const newState = selector(state);
        const oldState = selector(prevState);

        if (!shallowEqual(newState, oldState)) {
          listener(newState, oldState);
        }
      });
    },
    destroy() {
      /* this is a no-op */
    },
  };
}

/** @internal */
export function getExtensionConfigFromStore(state: ExtensionsConfigStore, slotName: string, extensionId: string) {
  const extensionConfig = state.configs[slotName]?.[extensionId];
  return extensionConfig ?? { loaded: false, config: null };
}

/** @internal */
export function getExtensionConfigFromExtensionSlotStore(
  state: ExtensionSlotConfig,
  slotName: string,
  extensionId: string,
) {
  const extensionConfig = state.configure?.[extensionId];
  return extensionConfig ?? null;
}

/**
 * A store of the implementer tools output config
 * @internal
 */
export interface ImplementerToolsConfigStore {
  config: Config;
}

const baseImplementerToolsConfigStore = createGlobalStore<ImplementerToolsConfigStore>('config-implementer-tools', {
  config: {},
});

/**
 * Deriving this config means cloning, walking and deep-comparing every module's schema, which
 * makes it by a wide margin the most expensive thing the config system computes — and nothing but
 * the implementer tools panel ever reads it. So it is only kept current while something is
 * subscribed. Once the panel closes and the last subscriber goes away, config changes just mark it
 * stale and the work stops again.
 */
let implementerToolsSubscribers = 0;
let implementerToolsConfigStale = true;
let isRecomputing = false;
let recomputeImplementerToolsConfig: (() => void) | undefined;

/**
 * Registers how to derive the implementer tools config; the store decides whether to.
 * @internal
 */
export function setImplementerToolsConfigRecomputer(recompute: () => void) {
  recomputeImplementerToolsConfig = recompute;
}

/**
 * Marks the implementer tools config stale, deriving it again only if something is watching.
 * @internal
 */
export function invalidateImplementerToolsConfig() {
  implementerToolsConfigStale = true;

  if (implementerToolsSubscribers > 0) {
    recomputeImplementerToolsConfigIfStale();
  }
}

function recomputeImplementerToolsConfigIfStale() {
  // The guard is load-bearing rather than defensive: deriving writes to this store, and when
  // nothing is subscribed that write re-enters through `getState`.
  if (!implementerToolsConfigStale || !recomputeImplementerToolsConfig || isRecomputing) {
    return;
  }

  isRecomputing = true;
  // Cleared before the work, so that a config change made while it runs marks this stale again
  // instead of being wiped when the pass finishes.
  implementerToolsConfigStale = false;

  try {
    recomputeImplementerToolsConfig();
  } catch (e) {
    // Never allowed to escape: this runs from a store listener, from `getState` during a render
    // and from `subscribe`, and a throw through any of those wedges far more than a developer
    // tool. Left stale so the next config change tries again.
    implementerToolsConfigStale = true;
    console.error('Failed to derive the implementer tools config', e);
  } finally {
    isRecomputing = false;
  }
}

/** @internal */
export const implementerToolsConfigStore: StoreApi<ImplementerToolsConfigStore> = {
  ...baseImplementerToolsConfigStore,
  getState() {
    // While something is subscribed the store is already current, so a read costs nothing. This
    // branch is what serves the panel's very first render, before it has subscribed.
    if (implementerToolsSubscribers === 0) {
      recomputeImplementerToolsConfigIfStale();
    }

    return baseImplementerToolsConfigStore.getState();
  },
  setState(...args: Parameters<StoreApi<ImplementerToolsConfigStore>['setState']>) {
    // An explicit write is the current value by definition, so don't overwrite it on the next read.
    implementerToolsConfigStale = false;
    return baseImplementerToolsConfigStore.setState(...args);
  },
  subscribe(listener) {
    implementerToolsSubscribers++;
    recomputeImplementerToolsConfigIfStale();

    const unsubscribe = baseImplementerToolsConfigStore.subscribe(listener);
    let hasUnsubscribed = false;

    return () => {
      if (!hasUnsubscribed) {
        hasUnsubscribed = true;
        implementerToolsSubscribers--;
      }

      unsubscribe();
    };
  },
};
