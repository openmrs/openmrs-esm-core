import { createGlobalStore, getGlobalStore, registerGlobalStore } from '@openmrs/esm-state';
import { type StoreApi } from 'zustand';
import { createStore } from 'zustand/vanilla';
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
   * Which names in `schemas` hold a module's real schema rather than the implicit one. Until this
   * is set, a module's config is derived against the implicit schema alone.
   *
   * Extension schemas are never listed: an extension is not a module, and listing one would produce
   * a module config for a name that has no module.
   */
  schemaDefined: Record<string, boolean>;
  /**
   * Whether the app shell has finished starting each module (run its `startupApp`). Unlike
   * `schemaDefined`, defining a schema does not set this, so it stays false while `startupApp`
   * is still defining the module's extension schemas.
   */
  moduleStarted: Record<string, boolean>;
  /**
   * Where each real schema, module or extension, came from. A `'static'` schema was read from the
   * routes registry and wins: a later `defineConfigSchema` for the same name is ignored. A
   * `'runtime'` schema was declared by the module itself.
   */
  schemaSource: Record<string, 'static' | 'runtime'>;
  /**
   * Whether the configs the application boots with have been provided.
   *
   * Defaults to `true`, so tests and code outside the app shell see configuration as ready. The app
   * shell clears it between registering the apps and providing their configs: schemas are known
   * before the configs that fill them in, and `getConfig()` resolves only once, so without this it
   * would resolve to defaults.
   */
  initialConfigsLoaded: boolean;
}

const configInternalStoreInitialValue = {
  providedConfigs: [],
  schemas: {},
  schemaDefined: {},
  moduleStarted: {},
  schemaSource: {},
  initialConfigsLoaded: true,
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
  /**
   * Set when the last attempt to derive `config` threw, in which case `config` is whatever was
   * last derived successfully — on a first failure, nothing at all. Cleared by a later success.
   */
  derivationError?: string;
}

// Deliberately not registered: the wrapper below is what gets published under
// `config-implementer-tools`, so that a lookup can't hand out the store that skips the derivation.
const baseImplementerToolsConfigStore = createStore<ImplementerToolsConfigStore>()(() => ({
  config: {},
}));

/**
 * Deriving this config walks every module's schema, making it the most expensive thing the config
 * system computes — and nothing but the implementer tools panel reads it. So it is only kept current
 * while something is subscribed; otherwise config changes just mark it stale.
 */
let implementerToolsSubscribers = 0;
let implementerToolsConfigStale = true;
let isRecomputing = false;
let recomputeImplementerToolsConfig: (() => void) | undefined;

let configValidationRequested = false;

/**
 * Whether configuration should be validated. Validation only writes to the console, so it is
 * skipped in production unless the implementer tools are open or validation was requested with
 * `setConfigValidationEnabled`.
 *
 * @internal
 */
export function shouldValidateConfig(): boolean {
  if (configValidationRequested || implementerToolsSubscribers > 0) {
    return true;
  }

  // Read on each call: the app shell may define `spaEnv` after this module is evaluated.
  return typeof window === 'undefined' || window.spaEnv !== 'production';
}

/**
 * Restores the default validation behaviour. Part of `resetConfigSystem`, so one test's setting
 * does not leak into the next.
 *
 * @internal
 */
export function resetConfigValidation() {
  configValidationRequested = false;
  implementerToolsSubscribers = 0;
}

/**
 * Requests configuration validation regardless of environment. Passing `false` withdraws the
 * request; it cannot suppress validation that a non-production environment or the implementer
 * tools turn on.
 *
 * @internal
 */
export function setConfigValidationEnabled(enabled: boolean) {
  configValidationRequested = enabled;
}

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
    implementerToolsConfigStale = true;
    recordConfigDerivationError(e);
    console.error('Failed to derive the implementer tools config', e);
  } finally {
    isRecomputing = false;
  }
}

/**
 * Records that configuration could not be rebuilt so that the user can be informed
 *
 * @internal
 */
export function recordConfigDerivationError(error: unknown) {
  baseImplementerToolsConfigStore.setState({
    derivationError: error instanceof Error ? error.message : String(error),
  });
}

/**
 * Cleared at the start of a derivation pass rather than the end of a successful one, so that a
 * failure recorded partway through the pass is not wiped by the pass completing.
 *
 * @internal
 */
export function clearConfigDerivationError() {
  if (baseImplementerToolsConfigStore.getState().derivationError) {
    baseImplementerToolsConfigStore.setState({ derivationError: undefined });
  }
}

const lazyImplementerToolsConfigStore: StoreApi<ImplementerToolsConfigStore> = {
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

/**
 * Published rather than the store it wraps, so that a lookup by name can't hand out the one that
 * skips the derivation and always reads empty.
 *
 * @internal
 */
export const implementerToolsConfigStore = registerGlobalStore(
  'config-implementer-tools',
  lazyImplementerToolsConfigStore,
);
