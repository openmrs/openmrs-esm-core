import * as R from "ramda";
import { invalidateConfigCache } from "../react-hook/config-cache";

// The input configs
type ProvidedConfig = {
  source: string;
  config: Config;
};
let _providedConfigs: ProvidedConfig[] = [];
let _importMapConfig: Config = {};
let _temporaryConfig: Config = {};
updateTemporaryConfigValueFromLocalStorage();

// An object with module names for keys and schemas for values.
const _schemas: Record<string, ConfigSchema> = {};

/*
 * API
 */

export function defineConfigSchema(moduleName: string, schema: ConfigSchema) {
  validateConfigSchema(moduleName, schema);
  _schemas[moduleName] = schema;
}

export function provide(config: Config, sourceName = "provided") {
  _providedConfigs.push({ source: sourceName, config });
}

export async function getConfig(moduleName: string): Promise<ConfigObject> {
  await loadConfigs();
  return getConfigForModule(moduleName);
}

/**
 * Returns the configuration for an extension. This configuration is specific
 * to the slot in which it is mounted, and its ID within that slot.
 *
 * The schema for that configuration is the schema for the module in which the
 * extension is defined.
 *
 * *If writing an extension in React, do not use this. Just use the `useExtensionConfig` hook.*
 *
 * @param slotModuleName The name of the module which defines the extension slot
 * @param extensionModuleName The name of the module which defines the extension (and therefore the config schema)
 * @param slotName The name of the extension slot where the extension is mounted
 * @param extensionId The ID of the extension in its slot
 */
export async function getExtensionConfig(
  slotModuleName: string,
  extensionModuleName: string,
  slotName: string,
  extensionId: string
) {
  await loadConfigs();
  const slotModuleConfig = mergeConfigsFor(
    slotModuleName,
    getProvidedConfigs()
  );
  const addedConfig = slotModuleConfig?.extensions?.[slotName]?.add?.find(
    (a) => a.extension == extensionId
  )?.config;
  const configuredConfig =
    slotModuleConfig?.extensions?.[slotName]?.configure?.[extensionId];
  const configOverride = addedConfig ?? configuredConfig ?? {};
  const extensionModuleConfig = mergeConfigsFor(
    extensionModuleName,
    getProvidedConfigs()
  );
  const extensionConfig = mergeConfigs([extensionModuleConfig, configOverride]);
  const schema = _schemas[extensionModuleName];
  validateConfig(schema, extensionConfig, extensionModuleName);
  const config = setDefaults(schema, extensionConfig);
  delete config.extensions;
  return config;
}

/**
 * Validate and interpolate defaults for `providedConfig` according to `schema`
 *
 * @param schema  a configuration schema
 * @param providedConfig  an object of config values (without the top-level module name)
 * @param keyPathContext  a dot-deparated string which helps the user figure out where
 *     the provided config came from
 */
export function processConfig(
  schema: ConfigSchema,
  providedConfig: ConfigObject,
  keyPathContext: string
) {
  validateConfig(schema, providedConfig, keyPathContext);
  const config = setDefaults(schema, providedConfig);
  return config;
}

/**
 * @internal
 */
export async function getImplementerToolsConfig(): Promise<object> {
  let result = getSchemaWithValuesAndSources(R.clone(_schemas));
  await loadConfigs();
  const configsAndSources = [
    ..._providedConfigs.map((c) => [c.config, c.source]),
    [_importMapConfig, "config-file"],
    [_temporaryConfig, "temporary config"],
  ] as Array<[Config, string]>;
  for (let [config, source] of configsAndSources) {
    result = mergeConfigs([result, createValuesAndSourcesTree(config, source)]);
  }
  return result;
}

function getSchemaWithValuesAndSources(schema) {
  if (schema.hasOwnProperty("default")) {
    return { ...schema, _value: schema.default, _source: "default" };
  } else {
    return Object.fromEntries(
      Object.entries(schema).map(([key, subtree]) => [
        key,
        getSchemaWithValuesAndSources(subtree),
      ])
    );
  }
}

function createValuesAndSourcesTree(config: ConfigObject, source: string) {
  if (isOrdinaryObject(config)) {
    return Object.fromEntries(
      Object.entries(config).map(([key, subtree]) => [
        key,
        createValuesAndSourcesTree(subtree, source),
      ])
    );
  } else {
    return { _value: config, _source: source };
  }
}

/**
 * @internal
 */
export function setAreDevDefaultsOn(value: boolean): void {
  localStorage.setItem("openmrsConfigAreDevDefaultsOn", JSON.stringify(value));
  invalidateConfigCache();
}

/**
 * @internal
 */
export function getAreDevDefaultsOn(): boolean {
  return JSON.parse(
    localStorage.getItem("openmrsConfigAreDevDefaultsOn") || "false"
  );
}

/**
 * @internal
 */
export function getTemporaryConfig(): Config {
  return _temporaryConfig;
}

/**
 * @internal
 */
export function setTemporaryConfigValue(path: string[], value: any): void {
  const current = getTemporaryConfig();
  _temporaryConfig = R.assocPath(path, value, current);
  localStorage.setItem(
    "openmrsTemporaryConfig",
    JSON.stringify(_temporaryConfig)
  );
  invalidateConfigCache();
}

/**
 * @internal
 */
export function unsetTemporaryConfigValue(path: string[]): void {
  const current = getTemporaryConfig();
  _temporaryConfig = R.dissocPath(path, current);
  localStorage.setItem(
    "openmrsTemporaryConfig",
    JSON.stringify(_temporaryConfig)
  );
  invalidateConfigCache();
}

/**
 * @internal
 */
export function clearTemporaryConfig(): void {
  _temporaryConfig = {};
  localStorage.removeItem("openmrsTemporaryConfig");
  invalidateConfigCache();
}

/**
 * @internal
 */
export async function getExtensionSlotConfigs(
  slotName: string,
  moduleName: string
): Promise<Record<string, ExtensionSlotConfigObject>> {
  await loadConfigs();
  const moduleConfig = mergeConfigsFor(moduleName, getProvidedConfigs());
  const allExtensionSlotConfigs: Record<string, ExtensionSlotConfig> = moduleConfig?.extensions ?? {};
  for (const config of Object.values(allExtensionSlotConfigs)) {
    validateExtensionSlotConfig(config, moduleName, slotName);
  }
  return processExtensionSlotConfigs(allExtensionSlotConfigs);
}

function validateExtensionSlotConfig(
  config: ExtensionSlotConfig,
  moduleName: string,
  slotName: string
): void {
  const errorPrefix = `Extension slot config '${moduleName}.extensions.${slotName}`;
  const invalidKeys = Object.keys(config).filter(
    (k) => !["add", "remove", "order", "configure"].includes(k)
  );
  if (invalidKeys.length) {
    console.error(
      errorPrefix + `' contains invalid keys '${invalidKeys.join("', '")}'`
    );
  }
  if (config.add) {
    if (!Array.isArray(config.add)) {
      console.error(
        errorPrefix +
          `.add' is invalid. Must be an array of objects with keys 'extension' and 'config'.`
      );
    } else {
      for (let i = 0; i++; i < config.add.length) {
        if (!isOrdinaryObject(config.add[i])) {
          console.error(
            errorPrefix +
              `.add[${i}]' is invalid. Must be an object with keys 'extension' and 'config'. Received ${JSON.stringify(
                config.add[i]
              )}`
          );
        } else {
          const invalidAddKeys = Object.keys(config.add[i]).filter(
            (k) => !["extension", "config"].includes(k)
          );
          if (invalidAddKeys.length) {
            console.error(
              errorPrefix +
                `.add[${i}]' contains invalid keys '${invalidAddKeys.join(
                  "', '"
                )}'`
            );
          }
          if (!config.add[i].extension) {
            console.error(
              errorPrefix +
                `.add[${i}]' is invalid. The 'extension' key specifying the extension name/ID is mandatory.`
            );
          }
        }
      }
    }
  }
  if (config.remove) {
    if (
      !Array.isArray(config.remove) ||
      !config.remove.every((n) => typeof n === "string")
    ) {
      console.error(
        errorPrefix +
          `.remove' is invalid. Must be an array of strings (extension IDs)`
      );
    }
  }
  if (config.order) {
    if (
      !Array.isArray(config.order) ||
      !config.order.every((n) => typeof n === "string")
    ) {
      console.error(
        errorPrefix +
          `.order' is invalid. Must be an array of strings (extension IDs)`
      );
    }
  }
}

function processExtensionSlotConfigs(
  allExtensionSlotConfigs: Record<string, ExtensionSlotConfig>
): Record<string, ExtensionSlotConfigObject> {
  const result: Record<string, ExtensionSlotConfigObject> = {};
  for (const [key, config] of Object.entries(allExtensionSlotConfigs)) {
    result[key] = {};
    if (config.remove) {
      result[key].remove = config.remove;
    }
    if (config.order) {
      result[key].order = config.order;
    }
    if (config.add) {
      result[key].add = config.add.map((e) => e.extension);
    }
  }
  return result;
}

/*
 * Helper functions
 */

function getProvidedConfigs(): Config[] {
  return [
    ..._providedConfigs.map((c) => c.config),
    _importMapConfig,
    _temporaryConfig,
  ];
}

// We cache the Promise that loads the import mapped config file
// so that we can be sure to only call it once
let getImportMapConfigPromise;
async function loadConfigs() {
  if (!getImportMapConfigPromise) {
    getImportMapConfigPromise = getImportMapConfigFile();
  }
  return await getImportMapConfigPromise;
}

function validateConfigSchema(
  moduleName: string,
  schema: ConfigSchema,
  keyPath = ""
) {
  const updateMessage = `Please verify that you are running the latest version and, if so, alert the maintainer.`;
  for (let key of Object.keys(schema)) {
    const thisKeyPath = keyPath + (keyPath && ".") + key;
    if (!["description", "validators"].includes(key)) {
      if (!isOrdinaryObject(schema[key])) {
        console.error(
          `${moduleName} has bad config schema definition for key '${thisKeyPath}'. ${updateMessage}`
        );
        continue;
      }
      if (!schema[key].hasOwnProperty("default")) {
        // recurse for nested config keys
        validateConfigSchema(moduleName, schema[key], thisKeyPath);
      }
      if (schema[key].hasOwnProperty("arrayElements")) {
        if (hasObjectSchema(schema[key].arrayElements)) {
          validateConfigSchema(
            moduleName,
            schema[key].arrayElements,
            thisKeyPath + ".arrayElements"
          );
        }
      }
      if (
        Object.keys(schema[key]).every((k) =>
          [
            "description",
            "validators",
            "arrayElements",
            "dictionaryElements",
          ].includes(k)
        ) &&
        !keyPath.includes(".arrayElements")
      ) {
        console.error(
          `${moduleName} has bad config schema definition for key '${thisKeyPath}'. ${updateMessage}.` +
            `\n\nIf you're the maintainer: all config elements must have a default. Received ${JSON.stringify(
              schema[key]
            )}`
        );
      }
    } else if (key === "validators") {
      for (let validator of schema[key]) {
        if (typeof validator !== "function") {
          console.error(
            `${moduleName} has invalid validator for key '${keyPath}' ${updateMessage}.` +
              `\n\nIf you're the maintainer: validators must be functions that return either ` +
              `undefined or an error string. Received ${validator}.`
          );
        }
      }
    }
  }
}

// Get config file from import map and append it to `configs`
async function getImportMapConfigFile(): Promise<void> {
  let importMapConfigExists: boolean;
  try {
    System.resolve("config-file");
    importMapConfigExists = true;
  } catch {
    importMapConfigExists = false;
  }
  if (importMapConfigExists) {
    try {
      const configFileModule = await System.import("config-file");
      _importMapConfig = configFileModule.default;
    } catch (e) {
      console.error(`Problem importing config-file ${e}`);
      throw e;
    }
  }
}

function getAllConfigsWithoutValidating() {
  const configs = mergeConfigs(getProvidedConfigs());
  const resultConfigs = {};
  for (let [moduleName, schema] of Object.entries(_schemas)) {
    const config = configs[moduleName] || {};
    resultConfigs[moduleName] = setDefaults(schema, config);
  }
  return resultConfigs;
}

function getConfigForModule(moduleName: string): ConfigObject {
  if (!_schemas.hasOwnProperty(moduleName)) {
    throw Error("No config schema has been defined for " + moduleName);
  }
  const schema = _schemas[moduleName];
  const inputConfig = mergeConfigsFor(moduleName, getProvidedConfigs());
  validateConfig(schema, inputConfig, moduleName);
  const config = setDefaults(schema, inputConfig);
  delete config.extensions;
  return config;
}

function mergeConfigsFor(
  moduleName: string,
  allConfigs: Config[]
): ConfigObject {
  const allConfigsForModule = R.map(R.prop(moduleName), allConfigs).filter(
    (item) => item !== undefined && item !== null
  );
  return mergeConfigs(allConfigsForModule);
}

function mergeConfigs(configs: Config[]) {
  const mergeDeepAll = R.reduce(R.mergeDeepRight, {});
  return mergeDeepAll(configs);
}

// Recursively check the provided config tree to make sure that all
// of the provided properties exist in the schema. Run validators
// where present in the schema.
const validateConfig = (
  schema: ConfigSchema,
  config: ConfigObject,
  keyPath: string = ""
) => {
  for (let [key, value] of Object.entries(config)) {
    const thisKeyPath = keyPath + "." + key;
    if (!schema.hasOwnProperty(key)) {
      if (key !== "extensions") {
        console.error(
          `Unknown config key '${thisKeyPath}' provided. Ignoring.`
        );
      }
      continue;
    }
    runValidators(thisKeyPath, schema[key].validators, value);
    if (isOrdinaryObject(value)) {
      // structurally validate only if there's dictionaryElements specified
      // or there's a `default` value, which indicates a freeform object
      if (schema[key].dictionaryElements) {
        validateDictionary(schema[key], value, thisKeyPath);
      } else if (!schema[key].default) {
        // recurse to validate nested object structure
        const schemaPart = schema[key];
        validateConfig(schemaPart, value, thisKeyPath);
      }
    } else {
      if (schema[key].arrayElements) {
        validateArray(schema[key], value, thisKeyPath);
      }
    }
  }
};

function validateDictionary(
  dictionarySchema: ConfigSchema,
  config: ConfigObject,
  keyPath: string
) {
  for (let [key, value] of Object.entries(config)) {
    validateConfig(
      dictionarySchema.dictionaryElements,
      value,
      `${keyPath}.${key}`
    );
  }
}

function validateArray(
  arraySchema: ConfigSchema,
  value: ConfigObject,
  keyPath: string
) {
  // value should be an array
  if (!Array.isArray(value)) {
    console.error(
      `Invalid configuration value ${value} for ${keyPath}: value must be an array.`
    );
    return;
  }
  // if there is an array element object schema, verify that elements match it
  if (hasObjectSchema(arraySchema.arrayElements)) {
    for (let i = 0; i < value.length; i++) {
      const arrayElement = value[i];
      validateConfig(
        arraySchema.arrayElements,
        arrayElement,
        `${keyPath}[${i}]`
      );
    }
  }
  for (let i = 0; i < value.length; i++) {
    runValidators(
      `${keyPath}[${i}]`,
      arraySchema.arrayElements.validators,
      value[i]
    );
  }
}

function runValidators(keyPath, validators, value) {
  if (validators) {
    for (let validator of validators) {
      const validatorResult = validator(value);
      if (typeof validatorResult === "string") {
        const valueString =
          typeof value === "object" ? JSON.stringify(value) : value;
        console.error(
          `Invalid configuration value ${valueString} for ${keyPath}: ${validatorResult}`
        );
      }
    }
  }
}

// Recursively fill in the config with values from the schema.
const setDefaults = (schema: ConfigSchema, inputConfig: Config) => {
  const config = R.clone(inputConfig);
  for (let key of Object.keys(schema)) {
    if (schema[key].hasOwnProperty("default")) {
      // We assume that schema[key] defines a config value, since it has
      // a property `default`.
      if (!config.hasOwnProperty(key)) {
        const devDefault = schema[key]["devDefault"] || schema[key]["default"];
        config[key] = getAreDevDefaultsOn()
          ? devDefault
          : schema[key]["default"];
      }
      // We also check if it is an array with object elements, in which case we recurse
      if (
        schema[key].hasOwnProperty("arrayElements") &&
        hasObjectSchema(schema[key].arrayElements)
      ) {
        const configWithDefaults = config[key].map((conf) =>
          setDefaults(schema[key].arrayElements, conf)
        );
        config[key] = configWithDefaults;
      }
    } else if (isOrdinaryObject(schema[key])) {
      // Since schema[key] has no property "default", if it's an ordinary object
      // (unlike, importantly, the validators array), we assume it is a parent config property.
      // We recurse to config[key] and schema[key]. Default config[key] to {}.
      const schemaPart = schema[key];
      const configPart = config.hasOwnProperty(key) ? config[key] : {};
      config[key] = setDefaults(schemaPart, configPart);
    }
  }
  return config;
};

function updateTemporaryConfigValueFromLocalStorage() {
  try {
    _temporaryConfig = JSON.parse(
      localStorage.getItem("openmrsTemporaryConfig") || "{}"
    );
  } catch (e) {
    console.error(
      "Failed to parse temporary config in localStorage key 'openmrsTemporaryConfig'. Try clearing or fixing the value."
    );
  }
}

function hasObjectSchema(arrayElementsSchema) {
  return (
    Object.keys(arrayElementsSchema).filter(
      (e) => !["default", "validators"].includes(e)
    ).length > 0
  );
}

function isOrdinaryObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

/*
 * Package-scoped functions
 */

export function clearAll() {
  getImportMapConfigPromise = undefined;
  _providedConfigs.length = 0;
  _importMapConfig = {};
  _temporaryConfig = {};
  for (var member in _schemas) delete _schemas[member];
}

/*
 * Types
 */

export interface ConfigSchema extends Object {
  [key: string]: any;
}

export interface Config extends Object {
  [moduleName: string]: { [key: string]: any };
}

export interface ConfigObject extends Object {
  [key: string]: any;
}

export type ConfigValue = string | number | void | Array<any>;

export interface ExtensionSlotConfig {
  add?: Array<{
    extension: string;
    config: {};
  }>;
  remove?: string[];
  order?: string[];
}

interface ExtensionSlotConfigObject {
  add?: string[];
  remove?: string[];
  order?: string[];
}
