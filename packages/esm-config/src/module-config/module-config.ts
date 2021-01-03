import {
  assocPath,
  dissocPath,
  clone,
  map,
  reduce,
  mergeDeepRight,
  prop,
} from "ramda";
import { invalidateConfigCache } from "./config-cache";
import {
  Config,
  ConfigObject,
  ConfigSchema,
  ExtensionSlotConfig,
  ExtensionSlotConfigObject,
  Type,
} from "../types";
import {
  isArray,
  isBoolean,
  isUuid,
  isNumber,
  isObject,
  isString,
} from "../validators/type-validators";
import {
  ConfigInternalStore,
  configInternalStore,
  getConfigStore,
  temporaryConfigStore,
} from "./state";

function computeModuleConfig(state: ConfigInternalStore) {
  if (state.importMapConfigLoaded) {
    for (let moduleName of Object.keys(state.schemas)) {
      const config = getConfigForModule(moduleName);
      const moduleStore = getConfigStore(moduleName);
      moduleStore.setState({ loaded: true, config });
    }
  }
}

loadConfigs();
computeModuleConfig(configInternalStore.getState());
configInternalStore.subscribe(computeModuleConfig);

/*
 * API
 */

export function defineConfigSchema(moduleName: string, schema: ConfigSchema) {
  validateConfigSchema(moduleName, schema);
  const state = configInternalStore.getState();
  configInternalStore.setState({
    schemas: { ...state.schemas, [moduleName]: schema },
  });
}

export function provide(config: Config, sourceName = "provided") {
  const state = configInternalStore.getState();
  configInternalStore.setState({
    providedConfigs: [...state.providedConfigs, { source: sourceName, config }],
  });
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
  const configOverride =
    slotModuleConfig?.extensions?.[slotName]?.configure?.[extensionId] ?? {};
  const extensionModuleConfig = mergeConfigsFor(
    extensionModuleName,
    getProvidedConfigs()
  );
  const extensionConfig = mergeConfigs([extensionModuleConfig, configOverride]);
  const schema = configInternalStore.getState().schemas[extensionModuleName]; // TODO: validate that a schema exists for the module
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
  const state = configInternalStore.getState();
  let result = getSchemaWithValuesAndSources(clone(state.schemas));
  await loadConfigs();
  const configsAndSources = [
    ...state.providedConfigs.map((c) => [c.config, c.source]),
    [state.importMapConfig, "config-file"],
    [temporaryConfigStore.getState(), "temporary config"],
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
 *
 * This function as written does not make sense. Its name and parameters
 * suggest that it corresponds to a particular ExtensionSlot, but its
 * return value is an object containing all extension slot configs. In its
 * implementation it does some partial validation.
 *
 * It should be fixed to either do what one would expect from a function called
 * `getExtensionSlotConfig`, or become a proper implementation of something called
 * `getAllExtensionSlotConfigs`.
 */
export async function getExtensionSlotConfig(
  slotName: string,
  moduleName: string
): Promise<ExtensionSlotConfigObject> {
  await loadConfigs();
  const moduleConfig = mergeConfigsFor(moduleName, getProvidedConfigs());
  const allExtensionSlotConfigs: Record<string, ExtensionSlotConfig> =
    moduleConfig?.extensions ?? {};
  const config = allExtensionSlotConfigs[slotName] || {};
  validateExtensionSlotConfig(config, moduleName, slotName);
  return config;
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
    if (
      !Array.isArray(config.add) ||
      !config.add.every((n) => typeof n === "string")
    ) {
      console.error(
        errorPrefix +
          `.add' is invalid. Must be an array of strings (extension IDs)`
      );
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
  if (config.configure) {
    if (!isOrdinaryObject(config.configure)) {
      console.error(
        errorPrefix +
          `.configure' is invalid. Must be an object with extension IDs for keys`
      );
    }
  }
}

/*
 * Helper functions
 */

function getProvidedConfigs(): Config[] {
  const state = configInternalStore.getState();
  return [
    ...state.providedConfigs.map((c) => c.config),
    state.importMapConfig,
    temporaryConfigStore.getState(),
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

// Get config file from import map
async function getImportMapConfigFile(): Promise<void> {
  let importMapConfigExists: boolean;

  try {
    System.resolve("config-file");
    importMapConfigExists = true;
  } catch {
    importMapConfigExists = false;
    configInternalStore.setState({
      importMapConfigLoaded: true,
    });
  }

  if (importMapConfigExists) {
    try {
      const configFileModule = await System.import("config-file");
      configInternalStore.setState({
        importMapConfig: configFileModule.default,
        importMapConfigLoaded: true,
      });
    } catch (e) {
      console.error(`Problem importing config-file ${e}`);
      throw e;
    }
  }
}

function getConfigForModule(moduleName: string): ConfigObject {
  const state = configInternalStore.getState();
  if (!state.schemas.hasOwnProperty(moduleName)) {
    throw Error("No config schema has been defined for " + moduleName);
  }

  const schema = state.schemas[moduleName];
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
  const allConfigsForModule = map(prop(moduleName), allConfigs).filter(
    (item) => item !== undefined && item !== null
  );

  return mergeConfigs(allConfigsForModule);
}

function mergeConfigs(configs: Config[]) {
  const mergeDeepAll = reduce(mergeDeepRight, {});
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
  for (const key of Object.keys(config)) {
    const value = config[key];
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
    for (const key of Object.keys(config)) {
      const value = config[key];
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
  const config = clone(inputConfig);

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
          for (let objectKey of Object.keys(config[key])) {
            config[key][objectKey] = setDefaults(
              elements,
              config[key][objectKey]
            );
          }
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
