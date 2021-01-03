import { createGlobalStore, getGlobalStore } from "@openmrs/esm-state";
import { equals } from "ramda";
import { Config, ConfigObject, ConfigSchema, ProvidedConfig } from "../types";

/*
 * Internal store
 *   A store of the inputs
 */

export interface ConfigInternalStore {
  // Configs added using the `provide` function
  providedConfigs: Array<ProvidedConfig>;
  // A config file provided as `config-file` in the import map
  importMapConfig: Config;
  // An object with module names for keys and schemas for values.
  schemas: Record<string, ConfigSchema>;
  // A flag to keep track of whether the import map config has been loaded
  importMapConfigLoaded: boolean;
}

export const configInternalStore = createGlobalStore<ConfigInternalStore>(
  "config-internal",
  {
    providedConfigs: [],
    importMapConfig: {},
    schemas: {},
    importMapConfigLoaded: false,
  }
);

/*
 * Output configs
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

// We use a store for each module's config, named `config-${moduleName}`
export function getConfigStore(moduleName: string) {
  return getGlobalStore<ConfigStore>(
    `config-${moduleName}`,
    initializeConfigStore()
  );
}

// A store for each extension's config
export function getExtensionConfigStore(
  extensionSlotModuleName: string,
  extensionModuleName: string,
  attachedExtensionSlotName: string,
  extensionId: string
) {
  return getGlobalStore<ConfigStore>(
    `ext-config-${extensionSlotModuleName}-${attachedExtensionSlotName}-${extensionId}`,
    initializeConfigStore()
  );
}

// A store of the implementer tools output config
export const implementerToolsConfigStore = createGlobalStore<Config>(
  "config-implementer-tools",
  {}
);

/*
 * Temporary config
 *   LocalStorage-based config used by the implementer tools
 */

export const temporaryConfigStore = createGlobalStore<Config>(
  "temporary-config",
  getTemporaryConfig()
);

let lastValueOfTemporaryConfig = getTemporaryConfig();
temporaryConfigStore.subscribe((state) => {
  if (equals(state, lastValueOfTemporaryConfig)) {
    setTemporaryConfig(state);
    lastValueOfTemporaryConfig = state;
  }
});

function setTemporaryConfig(value: Config): void {
  localStorage.setItem("openmrs:temporaryConfig", JSON.stringify(value));
}

function getTemporaryConfig(): Config {
  return JSON.parse(localStorage.getItem("openmrs:temporaryConfig") || "{}");
}
