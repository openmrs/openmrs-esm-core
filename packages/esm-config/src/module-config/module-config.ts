import * as R from "ramda";

// The configurations that have been provided
const configs: Config[] = [];

// An object with module names for keys and schemas for values.
const schemas = {};

/**
 * API
 */

export function defineConfigSchema(moduleName: string, schema: ConfigSchema) {
  validateConfigSchema(moduleName, schema);
  schemas[moduleName] = schema;
}

export function provide(config: Config) {
  configs.push(config);
}

export async function getConfig(moduleName: string): Promise<ConfigObject> {
  await loadConfigs();
  return getConfigForModule(moduleName);
}

export async function getDevtoolsConfig(): Promise<object> {
  await loadConfigs();
  return getAllConfigs();
}

/**
 * Helper functions
 */

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
  for (let key of Object.keys(schema)) {
    if (!["description", "validators"].includes(key)) {
      if (!isOrdinaryObject(schema[key])) {
        console.error(
          `${moduleName} has bad config schema definition for key ${keyPath}${key}. ` +
            `Please verify that you are running the latest version and, if so, ` +
            `alert the maintainer.`
        );
        return;
      }
      if (!schema[key].hasOwnProperty("default")) {
        // recurse for nested config keys
        validateConfigSchema(moduleName, schema[key], keyPath + key + ".");
      }
    }
  }
}

// Get config file from import map and prepend it to `configs`
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
      configs.push(configFileModule.default);
    } catch (e) {
      throw Error("Problem importing config-file: " + e);
    }
  }
}

function getAllConfigs() {
  const providedConfigs = mergeConfigs(configs);
  const resultConfigs = {};
  for (let [moduleName, schema] of Object.entries(schemas)) {
    const providedConfig = providedConfigs[moduleName] || {};
    resultConfigs[moduleName] = setDefaults(schema, providedConfig);
  }
  return resultConfigs;
}

function getConfigForModule(moduleName: string): ConfigObject {
  if (!schemas.hasOwnProperty(moduleName)) {
    throw Error("No config schema has been defined for " + moduleName);
  }
  const schema = schemas[moduleName];
  const providedConfig = mergeConfigsFor(moduleName, configs);
  validateConfig(schema, providedConfig, moduleName);
  const config = setDefaults(schema, providedConfig);
  return config;
}

function mergeConfigsFor(moduleName: string, allConfigs: Config[]) {
  const allConfigsForModule = R.map(R.prop(moduleName), allConfigs).filter(
    item => item !== undefined && item !== null
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
export const validateConfig = (
  schema: ConfigSchema,
  config: ConfigObject,
  keyPath: string = ""
) => {
  if (schema.hasOwnProperty("dictionaryElements")) {
    validateDictionary(schema, config, keyPath);
    return;
  }
  for (let [key, value] of Object.entries(config)) {
    const thisKeyPath = keyPath + "." + key;
    if (!schema.hasOwnProperty(key)) {
      console.error(`Unknown config key '${thisKeyPath}' provided. Ignoring.`);
    } else if (schema[key].skipValidations === true) {
      continue;
    } else if (isOrdinaryObject(value)) {
      // nested config; recurse
      const schemaPart = schema[key];
      validateConfig(schemaPart, value, thisKeyPath);
    } else {
      // config value; validate
      runValidators(thisKeyPath, schema[key].validators, value);
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
  if (
    hasObjectSchema(arraySchema.arrayElements) &&
    arraySchema.arrayElements.skipValidations
  ) {
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
const setDefaults = (schema, config) => {
  for (let key of Object.keys(schema)) {
    if (schema[key].hasOwnProperty("default")) {
      // We assume that schema[key] defines a config value, since it has
      // a property "default."
      if (!config.hasOwnProperty(key)) {
        config[key] = schema[key]["default"];
      }
      // We also check if it is an array with object elements, in which case we recurse
      if (
        schema[key].hasOwnProperty("arrayElements") &&
        hasObjectSchema(schema[key].arrayElements)
      ) {
        const configWithDefaults = config[key].map(conf =>
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

function hasObjectSchema(arrayElementsSchema) {
  return (
    Object.keys(arrayElementsSchema).filter(
      e => !["default", "validators"].includes(e)
    ).length > 0
  );
}

function isOrdinaryObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

/**
 * Package-scoped functions
 */

export function clearAll() {
  getImportMapConfigPromise = undefined;
  configs.length = 0;
  for (var member in schemas) delete schemas[member];
}

/**
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
