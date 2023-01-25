/** @module @category Config */
import { clone, reduce, mergeDeepRight, equals, omit } from "ramda";
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
  ConfigExtensionStore,
  ConfigInternalStore,
  configInternalStore,
  ConfigStore,
  configExtensionStore,
  getConfigStore,
  getExtensionsConfigStore,
  implementerToolsConfigStore,
  temporaryConfigStore,
  getExtensionSlotsConfigStore,
} from "./state";
import type {} from "@openmrs/esm-globals";
import { TemporaryConfigStore } from "..";

/**
 * Store setup
 *
 *
 * Set up stores and subscriptions so that inputs get processed appropriately.
 *
 * There are *input* stores and *output* stores. The *input* stores
 * are configInternalStore, temporaryConfigStore, and configExtensionStore. The
 * output stores are set in the `compute...` functions. They are the module
 * config stores, the extension slot config stores (by module), the extension
 * config stores, and the implementer tools config store.
 *
 * This code sets up the subscriptions so that when an input store changes,
 * the correct set of output stores are updated.
 *
 * All `compute...` functions except `computeExtensionConfigs` are pure
 * (or are supposed to be), other than the fact that they all `setState`
 * store values at the end. `computeExtensionConfigs` calls `getGlobalStore`,
 * which creates stores.
 */
computeModuleConfig(
  configInternalStore.getState(),
  temporaryConfigStore.getState()
);
configInternalStore.subscribe((configState) =>
  computeModuleConfig(configState, temporaryConfigStore.getState())
);
temporaryConfigStore.subscribe((tempConfigState) =>
  computeModuleConfig(configInternalStore.getState(), tempConfigState)
);

computeImplementerToolsConfig(
  configInternalStore.getState(),
  temporaryConfigStore.getState()
);
configInternalStore.subscribe((configState) =>
  computeImplementerToolsConfig(configState, temporaryConfigStore.getState())
);
temporaryConfigStore.subscribe((tempConfigState) =>
  computeImplementerToolsConfig(configInternalStore.getState(), tempConfigState)
);

computeExtensionSlotConfigs(
  configInternalStore.getState(),
  temporaryConfigStore.getState()
);
configInternalStore.subscribe((configState) =>
  computeExtensionSlotConfigs(configState, temporaryConfigStore.getState())
);
temporaryConfigStore.subscribe((tempConfigState) =>
  computeExtensionSlotConfigs(configInternalStore.getState(), tempConfigState)
);

computeExtensionConfigs(
  configInternalStore.getState(),
  configExtensionStore.getState(),
  temporaryConfigStore.getState()
);
configInternalStore.subscribe((configState) => {
  computeExtensionConfigs(
    configState,
    configExtensionStore.getState(),
    temporaryConfigStore.getState()
  );
});
configExtensionStore.subscribe((extensionState) => {
  computeExtensionConfigs(
    configInternalStore.getState(),
    extensionState,
    temporaryConfigStore.getState()
  );
});
temporaryConfigStore.subscribe((tempConfigState) => {
  computeExtensionConfigs(
    configInternalStore.getState(),
    configExtensionStore.getState(),
    tempConfigState
  );
});

function computeModuleConfig(
  state: ConfigInternalStore,
  tempState: TemporaryConfigStore
) {
  for (let moduleName of Object.keys(state.schemas)) {
    const config = getConfigForModule(moduleName, state, tempState);
    const moduleStore = getConfigStore(moduleName);
    moduleStore.setState({ loaded: true, config });
  }
}

function computeExtensionSlotConfigs(
  state: ConfigInternalStore,
  tempState: TemporaryConfigStore
) {
  const slotConfigs = getExtensionSlotConfigs(state, tempState);
  const newSlotStoreEntries = Object.fromEntries(
    Object.entries(slotConfigs).map(([slotName, config]) => [
      slotName,
      { loaded: true, config },
    ])
  );
  const slotStore = getExtensionSlotsConfigStore();
  const oldState = slotStore.getState();
  const newState = { slots: { ...oldState.slots, ...newSlotStoreEntries } };
  if (!equals(oldState, newState)) {
    slotStore.setState(newState);
  }
}

function computeImplementerToolsConfig(
  state: ConfigInternalStore,
  tempConfigState: TemporaryConfigStore
) {
  const config = getImplementerToolsConfig(state, tempConfigState);
  implementerToolsConfigStore.setState({ config });
}

function computeExtensionConfigs(
  configState: ConfigInternalStore,
  extensionState: ConfigExtensionStore,
  tempConfigState: TemporaryConfigStore
) {
  const configs = {};
  for (let extension of extensionState.mountedExtensions) {
    const config = computeExtensionConfig(
      extension.slotModuleName,
      extension.extensionModuleName,
      extension.slotName,
      extension.extensionId,
      configState,
      tempConfigState
    );
    configs[extension.slotName] = {
      ...configs[extension.slotName],
      [extension.extensionId]: { config, loaded: true },
    };
  }
  getExtensionsConfigStore().setState({ configs });
}

/*
 * API
 *
 */

/**
 * This defines a configuration schema for a module. The schema tells the
 * configuration system how the module can be configured. It specifies
 * what makes configuration valid or invalid.
 *
 * See [Configuration System](http://o3-dev.docs.openmrs.org/#/main/config)
 * for more information about defining a config schema.
 *
 * @param moduleName Name of the module the schema is being defined for. Generally
 *   should be the one in which the `defineConfigSchema` call takes place.
 * @param schema The config schema for the module
 */
export function defineConfigSchema(moduleName: string, schema: ConfigSchema) {
  validateConfigSchema(moduleName, schema);
  const enhancedSchema = mergeDeepRight(
    schema,
    implicitConfigSchema
  ) as ConfigSchema;

  const state = configInternalStore.getState();
  configInternalStore.setState({
    schemas: { ...state.schemas, [moduleName]: enhancedSchema },
  });
}

/**
 * This defines a configuration schema for an extension. When a schema is defined
 * for an extension, that extension will receive the configuration corresponding
 * to that schema, rather than the configuration corresponding to the module
 * in which it is defined.
 *
 * The schema tells the configuration system how the module can be configured.
 * It specifies what makes configuration valid or invalid.
 *
 * See [Configuration System](http://o3-dev.docs.openmrs.org/#/main/config)
 * for more information about defining a config schema.
 *
 * @param extensionName Name of the extension the schema is being defined for.
 *   Should match the `name` of one of the `extensions` entries being returned
 *   by `setupOpenMRS`.
 * @param schema The config schema for the extension
 */
export function defineExtensionConfigSchema(
  extensionName: string,
  schema: ConfigSchema
) {
  validateConfigSchema(extensionName, schema);
  const enhancedSchema = mergeDeepRight(
    schema,
    implicitConfigSchema
  ) as ConfigSchema;

  const state = configInternalStore.getState();
  if (state.schemas[extensionName]) {
    console.warn(
      `Config schema for extension ${extensionName} already exists. If there are multiple extensions with this same name, one will probably crash.`
    );
  }

  configInternalStore.setState({
    schemas: { ...state.schemas, [extensionName]: enhancedSchema },
  });
}

export function provide(config: Config, sourceName = "provided") {
  const state = configInternalStore.getState();
  configInternalStore.setState({
    providedConfigs: [...state.providedConfigs, { source: sourceName, config }],
  });
}

/**
 * A promise-based way to access the config as soon as it is fully loaded.
 * If it is already loaded, resolves the config in its present state.
 *
 * This is a useful function if you need to get the config in the course
 * of the execution of a function.
 *
 * @param moduleName The name of the module for which to look up the config
 */
export function getConfig(moduleName: string): Promise<Config> {
  return new Promise<Config>((resolve) => {
    const store = getConfigStore(moduleName);
    function update(state: ConfigStore) {
      if (state.loaded && state.config) {
        const config = omit(
          ["Display conditions", "Translation overrides"],
          state.config
        );
        resolve(config);
        unsubscribe && unsubscribe();
      }
    }
    update(store.getState());
    const unsubscribe = store.subscribe(update);
  });
}

/** @internal */
export function getConfigInternal(moduleName: string): Promise<Config> {
  return new Promise<Config>((resolve) => {
    const store = getConfigStore(moduleName);
    function update(state: ConfigStore) {
      if (state.loaded && state.config) {
        const config = state.config;
        resolve(config);
        unsubscribe && unsubscribe();
      }
    }
    update(store.getState());
    const unsubscribe = store.subscribe(update);
  });
}

/**
 * Validate and interpolate defaults for `providedConfig` according to `schema`
 *
 * @param schema  a configuration schema
 * @param providedConfig  an object of config values (without the top-level module name)
 * @param keyPathContext  a dot-deparated string which helps the user figure out where
 *     the provided config came from
 * @internal
 */
export function processConfig(
  schema: ConfigSchema,
  providedConfig: ConfigObject,
  keyPathContext: string
) {
  validateStructure(schema, providedConfig, keyPathContext);
  const config = setDefaults(schema, providedConfig);
  runAllValidatorsInConfigTree(schema, config, keyPathContext);
  return config;
}

/*
 * Helper functions
 *
 */

/**
 * Returns the configuration for an extension. This configuration is specific
 * to the slot in which it is mounted, and its ID within that slot.
 *
 * The schema for that configuration is the extension schema. If no extension
 * schema has been provided, the schema used is the schema of the module in
 * which the extension is defined.
 *
 * @param slotModuleName The name of the module which defines the extension slot
 * @param extensionModuleName The name of the module which defines the extension (and therefore the config schema)
 * @param slotName The name of the extension slot where the extension is mounted
 * @param extensionId The ID of the extension in its slot
 */
function computeExtensionConfig(
  slotModuleName: string,
  extensionModuleName: string,
  slotName: string,
  extensionId: string,
  configState: ConfigInternalStore,
  tempConfigState: TemporaryConfigStore
) {
  const extensionName = getExtensionNameFromId(extensionId);
  const extensionConfigSchema = configState.schemas[extensionName];
  const nameOfSchemaSource = extensionConfigSchema
    ? extensionName
    : extensionModuleName;
  const providedConfigs = getProvidedConfigs(configState, tempConfigState);
  const slotModuleConfig = mergeConfigsFor(slotModuleName, providedConfigs);
  const configOverride =
    slotModuleConfig?.extensionSlots?.[slotName]?.configure?.[extensionId] ??
    {};
  const extensionConfig = mergeConfigsFor(nameOfSchemaSource, providedConfigs);
  const combinedConfig = mergeConfigs([extensionConfig, configOverride]);
  // TODO: validate that a schema exists for the module
  const schema =
    extensionConfigSchema ?? configState.schemas[extensionModuleName];
  validateStructure(schema, combinedConfig, nameOfSchemaSource);
  const config = setDefaults(schema, combinedConfig);
  runAllValidatorsInConfigTree(schema, config, nameOfSchemaSource);
  delete config.extensionSlots;
  return config;
}

function getImplementerToolsConfig(
  configState: ConfigInternalStore,
  tempConfigState: TemporaryConfigStore
): Record<string, Config> {
  let result = getSchemaWithValuesAndSources(clone(configState.schemas));
  const configsAndSources = [
    ...configState.providedConfigs.map((c) => [c.config, c.source]),
    [tempConfigState.config, "temporary config"],
  ] as Array<[Config, string]>;
  for (let [config, source] of configsAndSources) {
    result = mergeConfigs([result, createValuesAndSourcesTree(config, source)]);
  }
  return result;
}

function getSchemaWithValuesAndSources(schema) {
  if (schema.hasOwnProperty("_default")) {
    return { ...schema, _value: schema._default, _source: "default" };
  } else if (isOrdinaryObject(schema)) {
    return Object.keys(schema).reduce((obj, key) => {
      obj[key] = getSchemaWithValuesAndSources(schema[key]);
      return obj;
    }, {});
  } else {
    // at this point, the schema is bad and an error will have been logged during schema validation
    return {};
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

function getExtensionSlotConfigs(
  configState: ConfigInternalStore,
  tempConfigState: TemporaryConfigStore
): Record<string, ExtensionSlotConfigObject> {
  const allConfigs = mergeConfigs(
    getProvidedConfigs(configState, tempConfigState)
  );
  const slotConfigPerModule: Record<
    string,
    Record<string, ExtensionSlotConfig>
  > = Object.keys(allConfigs).reduce((obj, key) => {
    if (allConfigs[key]?.extensionSlots) {
      obj[key] = allConfigs[key]?.extensionSlots;
    }
    return obj;
  }, {});
  validateAllExtensionSlotConfigs(slotConfigPerModule);
  const slotConfigs = Object.keys(slotConfigPerModule).reduce((obj, key) => {
    obj = { ...obj, ...slotConfigPerModule[key] };
    return obj;
  }, {});
  return slotConfigs;
}

function validateAllExtensionSlotConfigs(
  slotConfigPerModule: Record<string, Record<string, ExtensionSlotConfig>>
) {
  for (let [moduleName, configBySlotName] of Object.entries(
    slotConfigPerModule
  )) {
    for (let [slotName, config] of Object.entries(configBySlotName)) {
      validateExtensionSlotConfig(config, moduleName, slotName);
    }
  }
}

function validateExtensionSlotConfig(
  config: ExtensionSlotConfig,
  moduleName: string,
  slotName: string
): void {
  const errorPrefix = `Extension slot config '${moduleName}.extensionSlots.${slotName}`;
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

function getProvidedConfigs(
  configState: ConfigInternalStore,
  tempConfigState: TemporaryConfigStore
): Array<Config> {
  return [
    ...configState.providedConfigs.map((c) => c.config),
    tempConfigState.config,
  ];
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

    if (thisKeyPath === "Display conditions") {
      console.error(
        `${moduleName} declares a configuration option called "Display conditions"; the "Display conditions" option is a reserved name. ${updateMessage}`
      );
    }

    if (thisKeyPath === "Translation overrides") {
      console.error(
        `${moduleName} declares a configuration option called "Translation overrides"; the "Translation overrides" option is a reserved name. ${updateMessage}`
      );
    }

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

function getConfigForModule(
  moduleName: string,
  configState: ConfigInternalStore,
  tempConfigState: TemporaryConfigStore
): ConfigObject {
  if (!configState.schemas.hasOwnProperty(moduleName)) {
    throw Error("No config schema has been defined for " + moduleName);
  }

  const schema = configState.schemas[moduleName];
  const inputConfig = mergeConfigsFor(
    moduleName,
    getProvidedConfigs(configState, tempConfigState)
  );
  validateStructure(schema, inputConfig, moduleName);
  const config = setDefaults(schema, inputConfig);
  runAllValidatorsInConfigTree(schema, config, moduleName);
  delete config.extensionSlots;
  return config;
}

function mergeConfigsFor(
  moduleName: string,
  allConfigs: Array<Config>
): ConfigObject {
  const allConfigsForModule = allConfigs
    .map(({ [moduleName]: c }) => c)
    .filter((c) => !!c);

  return mergeConfigs(allConfigsForModule);
}

function mergeConfigs(configs: Array<Config>) {
  const mergeDeepAll = reduce(mergeDeepRight);
  return mergeDeepAll({}, configs) as Config;
}

/**
 * Recursively check the provided config tree to make sure that all
 * of the provided properties exist in the schema, and that types are
 * correct. Does not run validators yet, since those will be run on
 * the config with the defaults filled in.
 */
function validateStructure(
  schema: ConfigSchema,
  config: ConfigObject,
  keyPath = ""
) {
  // validate each constituent element
  for (const key of Object.keys(config)) {
    const value = config[key];
    const thisKeyPath = keyPath + "." + key;
    const schemaPart = schema[key] as ConfigSchema;

    if (!schema.hasOwnProperty(key)) {
      if (!(key === "extensionSlots" && keyPath !== "")) {
        console.error(
          `Unknown config key '${thisKeyPath}' provided. Ignoring.`
        );
      }

      continue;
    }

    validateBranchStructure(schemaPart, value, thisKeyPath);
  }
}

function validateBranchStructure(
  schemaPart: ConfigSchema,
  value: any,
  keyPath: string
) {
  checkType(keyPath, schemaPart._type, value);

  if (isOrdinaryObject(value)) {
    // structurally validate only if there's elements specified
    // or there's no `_default` value (which would indicate a freeform object)
    if (schemaPart._type === Type.Object) {
      validateDictionaryStructure(schemaPart, value, keyPath);
    } else if (!schemaPart.hasOwnProperty("_default")) {
      // recurse to validate nested object structure
      validateStructure(schemaPart, value, keyPath);
    }
  } else {
    if (schemaPart._type === Type.Array) {
      validateArrayStructure(schemaPart, value, keyPath);
    }
  }
}

function validateDictionaryStructure(
  dictionarySchema: ConfigSchema,
  config: ConfigObject,
  keyPath: string
) {
  if (dictionarySchema._elements) {
    for (const key of Object.keys(config)) {
      const value = config[key];
      validateStructure(dictionarySchema._elements, value, `${keyPath}.${key}`);
    }
  }
}

function validateArrayStructure(
  arraySchema: ConfigSchema,
  value: ConfigObject,
  keyPath: string
) {
  // if there is an array element object schema, verify that elements match it
  if (hasObjectSchema(arraySchema._elements)) {
    for (let i = 0; i < value.length; i++) {
      validateBranchStructure(
        arraySchema._elements,
        value[i],
        `${keyPath}[${i}]`
      );
    }
  }

  for (let i = 0; i < value.length; i++) {
    checkType(`${keyPath}[${i}]`, arraySchema._elements?._type, value[i]);
  }
}

/**
 * Run all the validators in the config tree. This should be run
 * on the config object after it has been filled in with all the defaults, since
 * higher-level validators may refer to default values.
 */
function runAllValidatorsInConfigTree(
  schema: ConfigSchema,
  config: ConfigObject,
  keyPath = ""
) {
  // If `!schema`, there should have been a structural validation error printed already.
  if (schema) {
    if (config !== schema._default) {
      runValidators(keyPath, schema._validators, config);
    }

    if (isOrdinaryObject(config)) {
      for (const key of Object.keys(config)) {
        const value = config[key];
        const thisKeyPath = keyPath + "." + key;
        const schemaPart = schema[key] as ConfigSchema;
        if (schema._type === Type.Object && schema._elements) {
          runAllValidatorsInConfigTree(schema._elements, value, thisKeyPath);
        } else {
          runAllValidatorsInConfigTree(schemaPart, value, thisKeyPath);
        }
      }
    } else if (Array.isArray(config) && schema._elements) {
      for (let i = 0; i < config.length; i++) {
        runAllValidatorsInConfigTree(
          schema._elements,
          config[i],
          `${keyPath}[${i}]`
        );
      }
    }
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
      PersonAttributeTypeUuid: isUuid,
      PatientIdentifierTypeUuid: isUuid,
    };
    runValidators(keyPath, [validator[_type]], value);
  }
}

function runValidators(
  keyPath: string,
  validators: Array<Function> | undefined,
  value: any
) {
  if (validators) {
    try {
      for (let validator of validators) {
        const validatorResult = validator(value);

        if (typeof validatorResult === "string") {
          if (typeof value === "object") {
            console.error(
              `Invalid configuration for ${keyPath}: ${validatorResult}`
            );
          } else {
            console.error(
              `Invalid configuration value ${value} for ${keyPath}: ${validatorResult}`
            );
          }
        }
      }
    } catch (e) {
      console.error(
        `Skipping invalid validator at "${keyPath}". Encountered error\n\t${e}`
      );
    }
  }
}

// Recursively fill in the config with values from the schema.
const setDefaults = (schema: ConfigSchema, inputConfig: Config) => {
  const config = clone(inputConfig);

  if (!schema) {
    return config;
  }

  for (const key of Object.keys(schema)) {
    const configPart = config[key];
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
        (config[key] as any) = schemaPart["_default"];
      }

      // We also check if it is an object or array with object elements, in which case we recurse
      const elements = schemaPart._elements;

      if (configPart && hasObjectSchema(elements)) {
        if (schemaPart._type === Type.Array && Array.isArray(configPart)) {
          const configWithDefaults = configPart.map((conf: Config) =>
            setDefaults(elements, conf)
          );
          config[key] = configWithDefaults;
        } else if (schemaPart._type === Type.Object) {
          for (let objectKey of Object.keys(configPart)) {
            configPart[objectKey] = setDefaults(
              elements,
              configPart[objectKey]
            );
          }
        }
      }
    } else if (isOrdinaryObject(schemaPart)) {
      // Since schemaPart has no property "_default", if it's an ordinary object
      // (unlike, importantly, the validators array), we assume it is a parent config property.
      // We recurse to config[key] and schema[key]. Default config[key] to {}.
      const selectedConfigPart = config.hasOwnProperty(key) ? configPart : {};

      if (isOrdinaryObject(selectedConfigPart)) {
        config[key] = setDefaults(schemaPart, selectedConfigPart);
      }
    }
  }

  return config;
};

function hasObjectSchema(
  elementsSchema: Object | undefined
): elementsSchema is ConfigSchema {
  return (
    !!elementsSchema &&
    Object.keys(elementsSchema).filter(
      (e) => !["_default", "_validators"].includes(e)
    ).length > 0
  );
}

function isOrdinaryObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

/**
 * Copied over from esm-extensions. It rightly belongs to that module, but esm-config
 * cannot depend on esm-extensions.
 */
function getExtensionNameFromId(extensionId: string) {
  const [extensionName] = extensionId.split("#");
  return extensionName;
}

/**
 * The implicitConfigSchema is implicitly included in every configuration schema
 */
const implicitConfigSchema: ConfigSchema = {
  "Display conditions": {
    privileges: {
      _description: "The privilege(s) the user must have to use this extension",
      _type: Type.Array,
      _default: [],
    },
  },
  "Translation overrides": {
    _description:
      "Per-language overrides for frontend translations should be keyed by language code and each language dictionary contains the translation key and the display value",
    _type: Type.Object,
    _default: {},
  },
};
