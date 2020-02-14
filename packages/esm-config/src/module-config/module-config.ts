import * as R from "ramda";

// The configurations that have been provided
const configs: object[] = [];

// An object with module names for keys and schemas for values.
const schemas = {};

export function defineConfigSchema(moduleName, schema) {
  validateConfigSchema(moduleName, schema);
  schemas[moduleName] = schema;
}

function validateConfigSchema(moduleName, schema, keyPath = "") {
  for (let key of Object.keys(schema)) {
    if (typeof schema[key] !== "object" || schema[key] == null) {
      console.error(
        `${moduleName} has bad config schema definition for key ${keyPath}${key}. Please alert the maintainer.`
      );
      return;
    }
    if (!schema[key].hasOwnProperty("default")) {
      // recurse for nested config keys
      validateConfigSchema(moduleName, schema[key], keyPath + key + ".");
    }
  }
}

export function provide(config) {
  configs.push(config);
}

// We cache the Promise that loads the import mapped config file
// so that we can be sure to only call it once
let getImportMapConfigPromise;
export async function getConfig(moduleName: string): Promise<ConfigObject> {
  if (!getImportMapConfigPromise) {
    getImportMapConfigPromise = getImportMapConfigFile();
  }
  await getImportMapConfigPromise;
  return getConfigForModule(moduleName);
}

// Get config file from import map and prepend it to `configs`
async function getImportMapConfigFile(): Promise<void> {
  let importMapConfigExists;
  try {
    System.resolve("config-file");
    importMapConfigExists = true;
  } catch {
    importMapConfigExists = false;
  }
  if (importMapConfigExists) {
    try {
      const configFileModule = await System.import("config-file");
      configs.unshift(configFileModule.default);
    } catch (e) {
      throw Error("Problem importing config-file: " + e);
    }
  }
}

function getConfigForModule(moduleName: string): ConfigObject {
  if (!schemas.hasOwnProperty(moduleName)) {
    throw Error("No config schema has been defined for " + moduleName);
  }
  const schema = schemas[moduleName];

  // Merge all of the configs provided for moduleName
  const mergeDeepAll = R.reduce(R.mergeDeepRight, {});
  const allConfigsForModule = R.map(R.prop(moduleName), configs);
  const providedConfig = mergeDeepAll(allConfigsForModule);

  // Recursively check the provided config tree to make sure that all
  // of the provided properties exist in the schema. Run validators
  // where present in the schema.
  const validateConfig = (schema, config, keyPath = "") => {
    for (let [key, value] of Object.entries(config)) {
      const thisKeyPath = keyPath + key;
      if (!schema.hasOwnProperty(key)) {
        throw Error(
          `Unknown config key '${thisKeyPath}' provided for module ${moduleName}. Please see the config schema for ${moduleName}.`
        );
      } else if (isOrdinaryObject(value)) {
        // value is a normal object; recurse to config[key] and schema[key].
        const schemaPart = schema[key];
        validateConfig(schemaPart, value, thisKeyPath + ".");
      } else {
        // value is a defined config property; validate it
        if (schema[key].validators) {
          for (let validator of schema[key].validators) {
            const validatorResult = validator(value);
            if (typeof validatorResult === "string") {
              throw Error(
                `Invalid configuration value ${value} for ${thisKeyPath}: ${validatorResult}`
              );
            }
          }
        }
        if (schema[key].arrayElements) {
          if (!Array.isArray(value)) {
            throw Error(
              `Invalid configuration value ${value} for ${thisKeyPath}: value must be an array.`
            );
          }
          // if there is an array element object schema, verify that elements match it
          const allowedKeys = Object.keys(schema[key].arrayElements).filter(
            e => !["default", "validators"].includes(e)
          );
          if (allowedKeys.length > 0) {
            for (let i = 0; i < value.length; i++) {
              const arrayElement = value[i];
              if (isOrdinaryObject(arrayElement)) {
                for (let [arrayObjectKey, arrayObjectValue] of Object.entries(
                  arrayElement
                )) {
                  if (!allowedKeys.includes(arrayObjectKey)) {
                    throw Error(
                      `For module ${moduleName}, in the array provided for '${thisKeyPath}', ` +
                        `element #${i +
                          1} contains unknown key '${arrayObjectKey}'. ` +
                        `Allowed keys are ${allowedKeys.join(", ")}. ` +
                        `Please see the config schema for ${moduleName}.`
                    );
                  }
                }
              }
            }
          }
          if (schema[key].arrayElements.validators) {
            for (let validator of schema[key].arrayElements.validators) {
              for (let element of value) {
                const validatorResult = validator(element);
                if (typeof validatorResult === "string") {
                  throw Error(
                    `Invalid array element ${element} in configuration value for ${thisKeyPath}: ${validatorResult}`
                  );
                }
              }
            }
          }
        }
      }
    }
  };
  validateConfig(schema, providedConfig);

  // Recursively fill in the config with values from the schema.
  const setDefaults = (schema, config) => {
    for (let key of Object.keys(schema)) {
      if (schema[key].hasOwnProperty("default")) {
        // We assume that schema[key] defines a config value, since it has
        // a property "default."
        if (!config.hasOwnProperty(key)) {
          config[key] = schema[key]["default"];
        }
      } else {
        // Since schema[key] has no property "default", we assume it is a
        // parent config property. We recurse to config[key] and schema[key].
        // Default config[key] to {}.
        const schemaPart = schema[key];
        const configPart = config.hasOwnProperty(key) ? config[key] : {};
        config[key] = setDefaults(schemaPart, configPart);
      }
    }
    return config;
  };
  const config = setDefaults(schema, providedConfig);

  return config;
}

function isOrdinaryObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

export function clearAll() {
  getImportMapConfigPromise = undefined;
  configs.length = 0;
  for (var member in schemas) delete schemas[member];
}

export interface ConfigObject extends Object {
  [key: string]: any;
}
