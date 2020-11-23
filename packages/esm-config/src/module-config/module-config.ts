import * as R from "ramda";
import { invalidateConfigCache } from "../react-hook/config-cache";
import { Validator } from "../validators/validator";
import {
  isArray,
  isBoolean,
  isUuid,
  isNumber,
  isObject,
  isString,
} from "../validators/type-validators";

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
  if (schema.hasOwnProperty("_default")) {
    return { ...schema, _value: schema._default, _source: "default" };
  } else {
    return Object.keys(schema).reduce((obj, key) => {
      obj[key] = getSchemaWithValuesAndSources(schema[key]);
      return obj;
    }, {});
  }
}

function createValuesAndSourcesTree(config: ConfigObject, source: string) {
  if (isOrdinaryObject(config)) {
    return Object.keys(config).reduce((obj, key) => {
      obj[key] = createValuesAndSourcesTree(config[key], source);
      return obj;
    }, {});
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
export async function getExtensionSlotConfig(
  slotName: string,
  moduleName: string
): Promise<Record<string, ExtensionSlotConfigObject>> {
  await loadConfigs();
  const moduleConfig = mergeConfigsFor(moduleName, getProvidedConfigs());
  const allExtensionSlotConfigs: Record<string, ExtensionSlotConfig> =
    moduleConfig?.extensions ?? {};
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

  for (const key of Object.keys(schema).filter((k) => !k.startsWith("_"))) {
    const thisKeyPath = keyPath + (keyPath && ".") + key;
    const schemaPart = schema[key] as ConfigSchema;

    if (!isOrdinaryObject(schemaPart)) {
      console.error(
        `${moduleName} has bad config schema definition for key '${thisKeyPath}'. ${updateMessage}`
      );
      continue;
    }

    if (!schemaPart.hasOwnProperty("_default")) {
      // recurse for nested config keys
      validateConfigSchema(moduleName, schemaPart, thisKeyPath);
    }

    const elements = schemaPart._elements;
    if (hasObjectSchema(elements)) {
      validateConfigSchema(moduleName, elements, thisKeyPath + "._elements");
    }

    if (schemaPart._validators) {
      for (let validator of schemaPart._validators) {
        if (typeof validator !== "function") {
          console.error(
            `${moduleName} has invalid validator for key '${thisKeyPath}' ${updateMessage}.` +
              `\n\nIf you're the maintainer: validators must be functions that return either ` +
              `undefined or an error string. Received ${validator}.`
          );
        }
      }
    }

    const valueType = schemaPart._type;
    if (valueType && !Object.values(Type).includes(valueType)) {
      console.error(
        `${moduleName} has invalid type for key '${thisKeyPath}' ${updateMessage}.` +
          `\n\nIf you're the maintainer: the allowed types are ${Object.values(
            Type
          ).join(", ")}. ` +
          `Received '${valueType}'`
      );
    }

    if (
      Object.keys(schemaPart).every((k) =>
        ["_description", "_validators", "_elements", "_type"].includes(k)
      ) &&
      !keyPath.includes("._elements")
    ) {
      console.error(
        `${moduleName} has bad config schema definition for key '${thisKeyPath}'. ${updateMessage}.` +
          `\n\nIf you're the maintainer: all config elements must have a default. ` +
          `Received ${JSON.stringify(schemaPart)}`
      );
    }

    if (
      elements &&
      valueType &&
      ![Type.Array, Type.Object].includes(valueType)
    ) {
      console.error(
        `${moduleName} has bad config schema definition for key '${thisKeyPath}'. ${updateMessage}.` +
          `\n\nIf you're the maintainer: the 'elements' key only works with '_type' equal to 'Array' or 'Object'. ` +
          `Received ${JSON.stringify(valueType)}`
      );
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

function getEntries(config: ConfigObject): Array<[string, any]> {
  return Object.keys(config).map((key) => [key, config[key]]);
}

// Recursively check the provided config tree to make sure that all
// of the provided properties exist in the schema. Run validators
// where present in the schema.
const validateConfig = (
  schema: ConfigSchema,
  config: ConfigObject,
  keyPath: string = ""
) => {
  for (let [key, value] of getEntries(config)) {
    const thisKeyPath = keyPath + "." + key;
    const schemaPart = schema[key] as ConfigSchema;
    if (!schema.hasOwnProperty(key)) {
      if (key !== "extensions") {
        console.error(
          `Unknown config key '${thisKeyPath}' provided. Ignoring.`
        );
      }
      continue;
    }
    checkType(thisKeyPath, schemaPart._type, value);
    runValidators(thisKeyPath, schemaPart._validators, value);

    if (isOrdinaryObject(value)) {
      // structurally validate only if there's elements specified
      // or there's a `_default` value, which indicates a freeform object
      if (schemaPart._type === Type.Object) {
        validateDictionary(schemaPart, value, thisKeyPath);
      } else if (!schemaPart.hasOwnProperty("_default")) {
        // recurse to validate nested object structure
        validateConfig(schemaPart, value, thisKeyPath);
      }
    } else {
      if (schemaPart._type === Type.Array) {
        validateArray(schemaPart, value, thisKeyPath);
      }
    }
  }
};

function validateDictionary(
  dictionarySchema: ConfigSchema,
  config: ConfigObject,
  keyPath: string
) {
  if (dictionarySchema._elements) {
    for (let [key, value] of getEntries(config)) {
      validateConfig(dictionarySchema._elements, value, `${keyPath}.${key}`);
    }
  }
}

function validateArray(
  arraySchema: ConfigSchema,
  value: ConfigObject,
  keyPath: string
) {
  // if there is an array element object schema, verify that elements match it
  if (hasObjectSchema(arraySchema._elements)) {
    for (let i = 0; i < value.length; i++) {
      validateConfig(arraySchema._elements, value[i], `${keyPath}[${i}]`);
    }
  }
  for (let i = 0; i < value.length; i++) {
    checkType(`${keyPath}[${i}]`, arraySchema._elements?._type, value[i]);
    runValidators(
      `${keyPath}[${i}]`,
      arraySchema._elements?._validators,
      value[i]
    );
  }
}

function checkType(keyPath: string, _type: Type | undefined, value: any) {
  if (_type) {
    const validator: Record<string, Function> = {
      Array: isArray,
      Boolean: isBoolean,
      ConceptUuid: isUuid,
      Number: isNumber,
      Object: isObject,
      String: isString,
      UUID: isUuid,
    };
    runValidators(keyPath, [validator[_type]], value);
  }
}

function runValidators(
  keyPath: string,
  validators: Function[] | undefined,
  value: any
) {
  if (validators) {
    try {
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
    } catch (e) {
      console.error("Skipping invalid validator at " + keyPath);
    }
  }
}

// Recursively fill in the config with values from the schema.
const setDefaults = (schema: ConfigSchema, inputConfig: Config) => {
  const config = R.clone(inputConfig);

  for (const key of Object.keys(schema)) {
    const schemaPart = schema[key] as ConfigSchema;
    // The `schemaPart &&` clause of this `if` statement will only fail
    // if the schema is very invalid. It is there to prevent the app from
    // crashing completely, though it will produce unexpected behavior.
    // If this happens, there should be legible errors in the console from
    // the schema validator.
    if (schemaPart && schemaPart.hasOwnProperty("_default")) {
      // We assume that schemaPart defines a config value, since it has
      // a property `_default`.
      if (!config.hasOwnProperty(key)) {
        const devDefault = schemaPart["_devDefault"] || schemaPart["_default"];
        (config[key] as any) = getAreDevDefaultsOn()
          ? devDefault
          : schemaPart["_default"];
      }
      // We also check if it is an object or array with object elements, in which case we recurse
      const elements = schemaPart._elements;
      if (hasObjectSchema(elements)) {
        if (schemaPart._type == Type.Array) {
          const configWithDefaults = config[key].map((conf: Config) =>
            setDefaults(elements, conf)
          );
          config[key] = configWithDefaults;
        } else if (schemaPart._type == Type.Object) {
          const configWithDefaults = Object.values(
            config[key]
          ).map((conf: Config) => setDefaults(elements, conf));
          config[key] = configWithDefaults;
        }
      }
    } else if (isOrdinaryObject(schemaPart)) {
      // Since schemaPart has no property "_default", if it's an ordinary object
      // (unlike, importantly, the validators array), we assume it is a parent config property.
      // We recurse to config[key] and schema[key]. Default config[key] to {}.
      const configPart = config.hasOwnProperty(key) ? config[key] : {};
      if (isOrdinaryObject(configPart)) {
        config[key] = setDefaults(schemaPart, configPart);
      }
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

function hasObjectSchema(
  elementsSchema: Object | undefined
): elementsSchema is ConfigSchema {
  return (
    elementsSchema != null &&
    Object.keys(elementsSchema).filter(
      (e) => !["_default", "_validators"].includes(e)
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

// Full-powered typing for Config and Schema trees depends on being able to
// have types like `string not "_default"`. There is an experimental PR
// for this feature, https://github.com/microsoft/TypeScript/pull/29317
// But it is not likely to be merged any time terribly soon. (Nov 11, 2020)
export interface ConfigSchema {
  [key: string]: ConfigSchema | ConfigValue;
  _type?: Type;
  _validators?: Array<Validator>;
  _elements?: ConfigSchema;
}

export interface Config extends Object {
  [moduleName: string]: { [key: string]: any };
}

export interface ConfigObject extends Object {
  [key: string]: any;
}

export type ConfigValue = string | number | boolean | void | Array<any>;

export enum Type {
  Array = "Array",
  Boolean = "Boolean",
  ConceptUuid = "ConceptUuid",
  Number = "Number",
  Object = "Object",
  String = "String",
  UUID = "UUID",
}

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
