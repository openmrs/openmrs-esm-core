/** @module @category Config */
import { createGlobalStore, getGlobalStore } from "@openmrs/esm-state";
import { omit } from "ramda";
import {
  Config,
  ConfigObject,
  ConfigSchema,
  ExtensionSlotConfigObject,
  ProvidedConfig,
} from "../types";

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
  /** Whether to use dev defaults or not */
}

const configInternalStoreInitialValue = {
  providedConfigs: [],
  schemas: {},
};

/**
 * @internal
 */
export const configInternalStore = createGlobalStore<ConfigInternalStore>(
  "config-internal",
  configInternalStoreInitialValue
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
export const temporaryConfigStore = createGlobalStore<TemporaryConfigStore>(
  "temporary-config",
  { config: getTemporaryConfig() }
);

temporaryConfigStore.subscribe((state) => {
  setTemporaryConfig(state.config);
});

function setTemporaryConfig(value: Config) {
  localStorage.setItem("openmrs:temporaryConfig", JSON.stringify(value));
}

function getTemporaryConfig(): Config {
  try {
    return JSON.parse(localStorage.getItem("openmrs:temporaryConfig") || "{}");
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
export const configExtensionStore = createGlobalStore<ConfigExtensionStore>(
  "config-store-of-extension-state",
  { mountedExtensions: [] }
);

/**
 * Output configs
 *
 * Each module has its own stores for its config and its extension slots' configs.
 * @internal
 */
export interface ConfigStore {
  config: ConfigObject | null;
  loaded: boolean;
}

function initializeConfigStore() {
  return {
    config: null,
    loaded: false,
  };
}

/** @internal */
export function getConfigStore(moduleName: string) {
  // We use a store for each module's config, named `config-${moduleName}`
  return getGlobalStore<ConfigStore>(
    `config-module-${moduleName}`,
    initializeConfigStore()
  );
}

/**
 * Configuration for all the specific extension slots
 * @internal
 */
export interface ExtensionSlotsConfigStore {
  slots: {
    [slotName: string]: {
      config: ExtensionSlotConfigObject;
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
  return getExtensionSlotConfigFromStore(
    getExtensionSlotsConfigStore().getState(),
    slotName
  );
}

/** @internal */
export function getExtensionSlotConfigFromStore(
  state: ExtensionSlotsConfigStore,
  slotName: string
) {
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
export function getExtensionConfig(slotName: string, extensionId: string) {
  const extensionConfig = Object.assign(
    {},
    getExtensionConfigFromStore(
      getExtensionsConfigStore().getState(),
      slotName,
      extensionId
    )
  );
  extensionConfig.config = omit(
    ["Display conditions", "Translation overrides"],
    extensionConfig.config
  );
  return extensionConfig;
}

/** @internal */
export function getExtensionConfigFromStore(
  state: ExtensionsConfigStore,
  slotName: string,
  extensionId: string
) {
  const extensionConfig = state.configs[slotName]?.[extensionId];
  return extensionConfig ?? { loaded: false, config: null };
}

/**
 * A store of the implementer tools output config
 * @internal
 */
export interface ImplementerToolsConfigStore {
  config: Config;
}

/** @internal */
export const implementerToolsConfigStore =
  createGlobalStore<ImplementerToolsConfigStore>("config-implementer-tools", {
    config: {},
  });
