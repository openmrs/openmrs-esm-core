import * as R from "ramda";

// The configurations that have been provided
const configs: object[] = [];

// An object with module names for keys and schemas for values.
const schemas = {};

export function defineConfigSchema(moduleName, schema) {
  schemas[moduleName] = schema;
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
    const configFileModule = await System.import("config-file");
    configs.unshift(configFileModule.default);
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
  // of the provided properties exist in the schema.
  const checkForUnknownConfigProperties = (schema, config, keyPath = "") => {
    for (let [key, value] of Object.entries(config)) {
      keyPath += key;
      if (!schema.hasOwnProperty(key)) {
        throw Error(
          `Unknown config key ${keyPath} provided for module ${moduleName}. Please see the config schema for ${moduleName}.`
        );
      } else if (typeof value === "object" && value !== null) {
        // Recurse to config[key] and schema[key].
        const schemaPart = schema[key];
        checkForUnknownConfigProperties(schemaPart, value, keyPath + ".");
      }
    }
  };
  checkForUnknownConfigProperties(schema, providedConfig);

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

export function clearAll() {
  getImportMapConfigPromise = undefined;
  configs.length = 0;
  for (var member in schemas) delete schemas[member];
}

export interface ConfigObject extends Object {
  [key: string]: any;
}
