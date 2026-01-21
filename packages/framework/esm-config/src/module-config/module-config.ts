/** @module @category Config */
import { clone, equals, reduce, mergeDeepRight, omit } from 'ramda';
import type { Config, ConfigObject, ConfigSchema, ExtensionSlotConfig } from '../types';
import { Type } from '../types';
import { isArray, isBoolean, isUuid, isNumber, isObject, isString } from '../validators/type-validators';
import { validator } from '../validators/validator';
import { type ConfigExtensionStore, type ConfigInternalStore, type ConfigStore } from './state';
import {
  configExtensionStore,
  configInternalStore,
  getConfigStore,
  getExtensionConfig,
  getExtensionSlotsConfigStore,
  getExtensionsConfigStore,
  implementerToolsConfigStore,
  temporaryConfigStore,
} from './state';
import { type TemporaryConfigStore } from '..';

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
// Store unsubscribe functions to allow cleanup (e.g., in tests or hot module reloading)
const configSubscriptions: Array<() => void> = [];

/**
 * Recomputes all configuration derived stores based on current state of input stores.
 * Called whenever any input store (configInternalStore, temporaryConfigStore, configExtensionStore) changes.
 */
function recomputeAllConfigs() {
  const configState = configInternalStore.getState();
  const tempConfigState = temporaryConfigStore.getState();
  const extensionState = configExtensionStore.getState();

  computeModuleConfig(configState, tempConfigState);
  computeImplementerToolsConfig(configState, tempConfigState);
  computeExtensionSlotConfigs(configState, tempConfigState);
  computeExtensionConfigs(configState, extensionState, tempConfigState);
}

function setupConfigSubscriptions() {
  // Initial computation
  recomputeAllConfigs();

  // Subscribe to all input stores with a single handler
  // This ensures we only recompute once even if multiple stores change simultaneously
  configSubscriptions.push(configInternalStore.subscribe(recomputeAllConfigs));
  configSubscriptions.push(temporaryConfigStore.subscribe(recomputeAllConfigs));
  configSubscriptions.push(configExtensionStore.subscribe(recomputeAllConfigs));
}

// Set up subscriptions at module load time
setupConfigSubscriptions();

function computeModuleConfig(state: ConfigInternalStore, tempState: TemporaryConfigStore) {
  for (let moduleName of Object.keys(state.schemas)) {
    // At this point the schema could be either just the implicit schema or the actually
    // defined schema. We run with just the implicit schema because we want to populate
    // the config store with the translation overrides as soon as possible. In fact, the
    // translation system will throw for Suspense until the translation overrides are
    // available, which as of this writing blocks the schema definition from occurring
    // for modules loaded based on their extensions.
    const moduleStore = getConfigStore(moduleName);
    let newState;
    if (state.moduleLoaded[moduleName]) {
      const config = getConfigForModule(moduleName, state, tempState);
      newState = {
        translationOverridesLoaded: true,
        loaded: true,
        config,
      };
    } else {
      const config = getConfigForModuleImplicitSchema(moduleName, state, tempState);
      newState = {
        translationOverridesLoaded: true,
        loaded: false,
        config,
      };
    }

    moduleStore.setState(newState);
  }
}

function computeExtensionSlotConfigs(state: ConfigInternalStore, tempState: TemporaryConfigStore) {
  const slotConfigs = getExtensionSlotConfigs(state, tempState);
  const newSlotStoreEntries = Object.fromEntries(
    Object.entries(slotConfigs).map(([slotName, config]) => [slotName, { loaded: true, config }]),
  );
  const slotStore = getExtensionSlotsConfigStore();
  const oldState = slotStore.getState();
  const newState = { slots: { ...oldState.slots, ...newSlotStoreEntries } };

  if (!equals(oldState.slots, newState.slots)) {
    slotStore.setState(newState);
  }
}

function computeImplementerToolsConfig(state: ConfigInternalStore, tempConfigState: TemporaryConfigStore) {
  const oldState = implementerToolsConfigStore.getState();
  const config = getImplementerToolsConfig(state, tempConfigState);
  const newState = { config };

  // Use deep equality on the actual config content, not the wrapper object
  if (!equals(oldState.config, newState.config)) {
    implementerToolsConfigStore.setState(newState);
  }
}

function computeExtensionConfigs(
  configState: ConfigInternalStore,
  extensionState: ConfigExtensionStore,
  tempConfigState: TemporaryConfigStore,
) {
  const configs = {};
  // We assume that the module schema has already been defined, since the extension
  // it contains is mounted.
  for (let extension of extensionState.mountedExtensions) {
    const config = computeExtensionConfig(
      extension.slotModuleName,
      extension.extensionModuleName,
      extension.slotName,
      extension.extensionId,
      configState,
      tempConfigState,
    );

    if (!configs[extension.slotName]) {
      configs[extension.slotName] = {};
    }
    configs[extension.slotName][extension.extensionId] = { config, loaded: true };
  }
  const extensionsConfigStore = getExtensionsConfigStore();
  const oldState = extensionsConfigStore.getState();
  const newState = { configs };

  // Use deep equality to only update if configs actually changed
  if (!equals(oldState.configs, newState.configs)) {
    extensionsConfigStore.setState(newState);
  }
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
 * See [Configuration System](https://o3-docs.openmrs.org/docs/configuration-system)
 * for more information about defining a config schema.
 *
 * @param moduleName Name of the module the schema is being defined for. Generally
 *   should be the one in which the `defineConfigSchema` call takes place.
 * @param schema The config schema for the module
 */
export function defineConfigSchema(moduleName: string, schema: ConfigSchema) {
  validateConfigSchema(moduleName, schema);
  const enhancedSchema = mergeDeepRight(schema, implicitConfigSchema) as ConfigSchema;

  configInternalStore.setState((state) => ({
    ...state,
    schemas: { ...state.schemas, [moduleName]: enhancedSchema },
    moduleLoaded: { ...state.moduleLoaded, [moduleName]: true },
  }));
}

/**
 * This alerts the configuration system that a module exists. This allows config to be
 * processed, while still allowing the extension system to know whether the module has
 * actually had its front bundle executed yet.
 *
 * This should only be used in esm-app-shell.
 *
 * @internal
 * @param moduleName
 */
export function registerModuleWithConfigSystem(moduleName: string) {
  configInternalStore.setState((state) => ({
    ...state,
    schemas: { ...state.schemas, [moduleName]: implicitConfigSchema },
  }));
}

/**
 * This alerts the configuration system that a module has been loaded.
 *
 * This should only be used in esm-app-shell.
 *
 * @internal
 * @param moduleName
 */
export function registerModuleLoad(moduleName: string) {
  configInternalStore.setState((state) => ({
    ...state,
    moduleLoaded: { ...state.moduleLoaded, [moduleName]: true },
  }));
}

/**
 * This allows the config system to support translation overrides for namespaces that
 * do not correspond to modules.
 *
 * This should only be used in esm-app-shell.
 *
 * @internal
 * @param namespace
 */
export function registerTranslationNamespace(namespace: string) {
  configInternalStore.setState((state) => ({
    ...state,
    schemas: { ...state.schemas, [namespace]: translationOverridesSchema },
  }));
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
 * See [Configuration System](https://o3-docs.openmrs.org/docs/configuration-system)
 * for more information about defining a config schema.
 *
 * @param extensionName Name of the extension the schema is being defined for.
 *   Should match the `name` of one of the `extensions` entries defined in
 *   the app's `routes.json` file.
 * @param schema The config schema for the extension
 */
export function defineExtensionConfigSchema(extensionName: string, schema: ConfigSchema) {
  validateConfigSchema(extensionName, schema);
  const enhancedSchema = mergeDeepRight(schema, implicitConfigSchema) as ConfigSchema;

  const state = configInternalStore.getState();
  if (state.schemas[extensionName]) {
    console.error(
      `Config schema for extension ${extensionName} already exists. If there are multiple extensions with this same name, one will probably crash.`,
    );
  }

  configInternalStore.setState((state) => ({
    ...state,
    schemas: { ...state.schemas, [extensionName]: enhancedSchema },
  }));
}

export function provide(config: Config, sourceName = 'provided') {
  configInternalStore.setState((state) => ({
    ...state,
    providedConfigs: [...state.providedConfigs, { source: sourceName, config }],
  }));
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
export function getConfig<T = Record<string, any>>(moduleName: string): Promise<T> {
  return new Promise<T>((resolve) => {
    const store = getConfigStore(moduleName);
    function update(state: ConfigStore) {
      if (state.loaded && state.config) {
        const config = omit(['Display conditions', 'Translation overrides'], state.config);
        resolve(config as T);

        if (unsubscribe) {
          unsubscribe();
        }
      }
    }
    update(store.getState());
    const unsubscribe = store.subscribe(update);
  });
}

/** @internal */
export function getTranslationOverrides(
  moduleName: string,
  slotName?: string,
  extensionId?: string,
): Promise<Array<Record<string, Record<string, string>>>> {
  const promises = [
    new Promise<Record<string, Record<string, string>>>((resolve) => {
      const configStore = getConfigStore(moduleName);
      function update(state: ReturnType<(typeof configStore)['getState']>) {
        if (state.translationOverridesLoaded && state.config) {
          const translationOverrides = state.config['Translation overrides'] ?? {};
          resolve(translationOverrides);

          if (unsubscribe) {
            unsubscribe();
          }
        }
      }
      update(configStore.getState());
      const unsubscribe = configStore.subscribe(update);
    }),
  ];

  if (slotName && extensionId) {
    promises.push(
      new Promise<Record<string, Record<string, string>>>((resolve) => {
        const configStore = getExtensionConfig(slotName, extensionId);
        function update(state: ReturnType<(typeof configStore)['getState']>) {
          if (state.loaded && state.config) {
            const translationOverrides = state.config['Translation overrides'] ?? {};
            resolve(translationOverrides);

            if (unsubscribe) {
              unsubscribe();
            }
          }
        }
        update(configStore.getState());
        const unsubscribe = configStore.subscribe(update);
      }),
    );
  }

  return Promise.all(promises);
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
export function processConfig(schema: ConfigSchema, providedConfig: ConfigObject, keyPathContext: string) {
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
  tempConfigState: TemporaryConfigStore,
) {
  const extensionName = getExtensionNameFromId(extensionId);
  const extensionConfigSchema = configState.schemas[extensionName];
  const nameOfSchemaSource = extensionConfigSchema ? extensionName : extensionModuleName;
  const providedConfigs = getProvidedConfigs(configState, tempConfigState);
  const slotModuleConfig = mergeConfigsFor(slotModuleName, providedConfigs);
  const configOverride = slotModuleConfig?.extensionSlots?.[slotName]?.configure?.[extensionId] ?? {};
  const extensionConfig = mergeConfigsFor(nameOfSchemaSource, providedConfigs);
  const combinedConfig = mergeConfigs([extensionConfig, configOverride]);
  const schema = extensionConfigSchema ?? configState.schemas[extensionModuleName];
  validateStructure(schema, combinedConfig, nameOfSchemaSource);
  const config = setDefaults(schema, combinedConfig);
  runAllValidatorsInConfigTree(schema, config, nameOfSchemaSource);
  delete config.extensionSlots;
  return config;
}

function getImplementerToolsConfig(
  configState: ConfigInternalStore,
  tempConfigState: TemporaryConfigStore,
): Record<string, Config> {
  let result = getSchemaWithValuesAndSources(clone(configState.schemas));
  const configsAndSources = [
    ...configState.providedConfigs.map((c) => [c.config, c.source]),
    [tempConfigState.config, 'temporary config'],
  ] as Array<[Config, string]>;
  for (let [config, source] of configsAndSources) {
    result = mergeConfigs([result, createValuesAndSourcesTree(config, source)]);
  }
  return result;
}

function getSchemaWithValuesAndSources(schema) {
  if (schema.hasOwnProperty('_default')) {
    return { ...schema, _value: schema._default, _source: 'default' };
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
  tempConfigState: TemporaryConfigStore,
): Record<string, ExtensionSlotConfig> {
  const allConfigs = mergeConfigs(getProvidedConfigs(configState, tempConfigState));
  const slotConfigPerModule: Record<string, Record<string, ExtensionSlotConfig>> = Object.keys(allConfigs).reduce(
    (obj, key) => {
      if (allConfigs[key]?.extensionSlots) {
        obj[key] = allConfigs[key]?.extensionSlots;
      }
      return obj;
    },
    {},
  );
  validateAllExtensionSlotConfigs(slotConfigPerModule);
  const slotConfigs = Object.keys(slotConfigPerModule).reduce((obj, key) => {
    obj = { ...obj, ...slotConfigPerModule[key] };
    return obj;
  }, {});
  return slotConfigs;
}

function validateAllExtensionSlotConfigs(slotConfigPerModule: Record<string, Record<string, ExtensionSlotConfig>>) {
  for (let [moduleName, configBySlotName] of Object.entries(slotConfigPerModule)) {
    for (let [slotName, config] of Object.entries(configBySlotName)) {
      validateExtensionSlotConfig(config, moduleName, slotName);
    }
  }
}

function validateExtensionSlotConfig(config: ExtensionSlotConfig, moduleName: string, slotName: string): void {
  const keyPath = `${moduleName}.extensionSlots.${slotName}`;
  const errorPrefix = `Extension slot config '${keyPath}'`;
  const invalidKeys = Object.keys(config).filter((k) => !['add', 'remove', 'order', 'configure'].includes(k));
  if (invalidKeys.length) {
    logError(keyPath, errorPrefix + `' contains invalid keys '${invalidKeys.join("', '")}'`);
  }
  if (config.add) {
    if (!Array.isArray(config.add) || !config.add.every((n) => typeof n === 'string')) {
      logError(keyPath, errorPrefix + `.add' is invalid. Must be an array of strings (extension IDs)`);
    }
  }
  if (config.remove) {
    if (!Array.isArray(config.remove) || !config.remove.every((n) => typeof n === 'string')) {
      logError(keyPath, errorPrefix + `.remove' is invalid. Must be an array of strings (extension IDs)`);
    }
  }
  if (config.order) {
    if (!Array.isArray(config.order) || !config.order.every((n) => typeof n === 'string')) {
      logError(keyPath, errorPrefix + `.order' is invalid. Must be an array of strings (extension IDs)`);
    }
  }
  if (config.configure) {
    if (!isOrdinaryObject(config.configure)) {
      logError(keyPath, errorPrefix + `.configure' is invalid. Must be an object with extension IDs for keys`);
    }
  }
}

function getProvidedConfigs(configState: ConfigInternalStore, tempConfigState: TemporaryConfigStore): Array<Config> {
  return [...configState.providedConfigs.map((c) => c.config), tempConfigState.config];
}

/**
 * Validates the config schema for a module. Since problems identified here are programming errors
 * that hopefully will be caught during development, this function logs errors to the console directly;
 * it's fine if we spam the user with these errors.
 */
function validateConfigSchema(moduleName: string, schema: ConfigSchema, keyPath = '') {
  const updateMessage = `Please verify that you are running the latest version and, if so, alert the maintainer.`;

  for (const key of Object.keys(schema).filter((k) => !k.startsWith('_'))) {
    const thisKeyPath = keyPath + (keyPath && '.') + key;
    const schemaPart = schema[key] as ConfigSchema;

    if (thisKeyPath === 'Display conditions') {
      console.error(
        `${moduleName} declares a configuration option called "Display conditions"; the "Display conditions" option is a reserved name. ${updateMessage}`,
      );
    }

    if (thisKeyPath === 'Translation overrides') {
      console.error(
        `${moduleName} declares a configuration option called "Translation overrides"; the "Translation overrides" option is a reserved name. ${updateMessage}`,
      );
    }

    if (!isOrdinaryObject(schemaPart)) {
      console.error(`${moduleName} has bad config schema definition for key '${thisKeyPath}'. ${updateMessage}`);
      continue;
    }

    if (!schemaPart.hasOwnProperty('_default')) {
      // recurse for nested config keys
      validateConfigSchema(moduleName, schemaPart, thisKeyPath);
    }

    const elements = schemaPart._elements;
    if (hasObjectSchema(elements)) {
      validateConfigSchema(moduleName, elements, thisKeyPath + '._elements');
    }

    if (schemaPart._validators) {
      for (let validator of schemaPart._validators) {
        if (typeof validator !== 'function') {
          console.error(
            `${moduleName} has invalid validator for key '${thisKeyPath}' ${updateMessage}.` +
              `\n\nIf you're the maintainer: validators must be functions that return either ` +
              `undefined or an error string. Received ${validator}.`,
          );
        }
      }
    }

    const valueType = schemaPart._type;
    if (valueType && !Object.values(Type).includes(valueType)) {
      console.error(
        `${moduleName} has invalid type for key '${thisKeyPath}' ${updateMessage}.` +
          `\n\nIf you're the maintainer: the allowed types are ${Object.values(Type).join(', ')}. ` +
          `Received '${valueType}'`,
      );
    }

    if (
      Object.keys(schemaPart).every((k) => ['_description', '_validators', '_elements', '_type'].includes(k)) &&
      !keyPath.includes('._elements')
    ) {
      console.error(
        `${moduleName} has bad config schema definition for key '${thisKeyPath}'. ${updateMessage}.` +
          `\n\nIf you're the maintainer: all config elements must have a default. ` +
          `Received ${JSON.stringify(schemaPart)}`,
      );
    }

    if (elements && valueType && ![Type.Array, Type.Object].includes(valueType)) {
      console.error(
        `${moduleName} has bad config schema definition for key '${thisKeyPath}'. ${updateMessage}.` +
          `\n\nIf you're the maintainer: the 'elements' key only works with '_type' equal to 'Array' or 'Object'. ` +
          `Received ${JSON.stringify(valueType)}`,
      );
    }
  }
}

function getConfigForModule(
  moduleName: string,
  configState: ConfigInternalStore,
  tempConfigState: TemporaryConfigStore,
): ConfigObject {
  const schema = configState.schemas[moduleName];
  const inputConfig = mergeConfigsFor(moduleName, getProvidedConfigs(configState, tempConfigState));
  validateStructure(schema, inputConfig, moduleName);
  const config = setDefaults(schema, inputConfig);
  runAllValidatorsInConfigTree(schema, config, moduleName);
  delete config.extensionSlots;
  return config;
}

function getConfigForModuleImplicitSchema(
  moduleName: string,
  configState: ConfigInternalStore,
  tempConfigState: TemporaryConfigStore,
): ConfigObject {
  const inputConfig = mergeConfigsFor(moduleName, getProvidedConfigs(configState, tempConfigState));
  const config = setDefaults(implicitConfigSchema, inputConfig);
  runAllValidatorsInConfigTree(implicitConfigSchema, config, moduleName);
  delete config.extensionSlots;
  return config;
}

function mergeConfigsFor(moduleName: string, allConfigs: Array<Config>): ConfigObject {
  const allConfigsForModule = allConfigs.map(({ [moduleName]: c }) => c).filter((c) => !!c);

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
function validateStructure(schema: ConfigSchema, config: ConfigObject, keyPath = '') {
  // validate each constituent element
  for (const key of Object.keys(config)) {
    const value = config[key];
    const thisKeyPath = keyPath + '.' + key;
    const schemaPart = schema[key] as ConfigSchema;

    if (!schema.hasOwnProperty(key)) {
      if (!(key === 'extensionSlots' && keyPath !== '')) {
        logError(thisKeyPath, `Unknown config key '${thisKeyPath}' provided. Ignoring.`);
      }

      continue;
    }

    validateBranchStructure(schemaPart, value, thisKeyPath);
  }
}

function validateBranchStructure(schemaPart: ConfigSchema, value: any, keyPath: string) {
  checkType(keyPath, schemaPart._type, value);

  if (isOrdinaryObject(value)) {
    if (schemaPart._type === Type.Object) {
      // validate as freeform object
      validateFreeformObjectStructure(schemaPart, value, keyPath);
    } else if (!(schemaPart.hasOwnProperty('_default') || schemaPart.hasOwnProperty('_type'))) {
      // validate as normal nested config
      validateStructure(schemaPart, value, keyPath);
    }
  } else {
    if (schemaPart._type === Type.Array) {
      validateArrayStructure(schemaPart, value, keyPath);
    }
  }
}

function validateFreeformObjectStructure(freeformObjectSchema: ConfigSchema, config: ConfigObject, keyPath: string) {
  if (freeformObjectSchema._elements) {
    for (const key of Object.keys(config)) {
      const value = config[key];
      validateBranchStructure(freeformObjectSchema._elements, value, `${keyPath}.${key}`);
    }
  }
}

function validateArrayStructure(arraySchema: ConfigSchema, value: ConfigObject, keyPath: string) {
  const validatedAsArray = checkType(keyPath, Type.Array, value);
  if (!validatedAsArray) {
    return;
  }
  // if there is an array element object schema, verify that elements match it
  if (hasObjectSchema(arraySchema._elements)) {
    for (let i = 0; i < value.length; i++) {
      validateBranchStructure(arraySchema._elements, value[i], `${keyPath}[${i}]`);
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
function runAllValidatorsInConfigTree(schema: ConfigSchema, config: ConfigObject, keyPath = '') {
  // If `!schema`, there should have been a structural validation error printed already.
  if (schema) {
    if (config !== schema._default) {
      runValidators(keyPath, schema._validators, config);
    }

    if (isOrdinaryObject(config)) {
      for (const key of Object.keys(config)) {
        const value = config[key];
        const thisKeyPath = keyPath + '.' + key;
        const schemaPart = schema[key] as ConfigSchema;
        if (schema._type === Type.Object && schema._elements) {
          runAllValidatorsInConfigTree(schema._elements, value, thisKeyPath);
        } else {
          runAllValidatorsInConfigTree(schemaPart, value, thisKeyPath);
        }
      }
    } else if (Array.isArray(config) && schema._elements) {
      for (let i = 0; i < config.length; i++) {
        runAllValidatorsInConfigTree(schema._elements, config[i], `${keyPath}[${i}]`);
      }
    }
  }
}

/**
 * Run type validation for the value, logging any errors.
 * @returns true if validation passes, false otherwise
 */
function checkType(keyPath: string, _type: Type | undefined, value: any) {
  if (_type) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
    return runValidators(keyPath, [validator[_type]], value);
  }
  return true;
}

/**
 * Runs validators, logging errors.
 * @returns true if all pass, false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function runValidators(keyPath: string, validators: Array<Function> | undefined, value: any) {
  let returnValue = true;
  if (validators) {
    try {
      for (let validator of validators) {
        const validatorResult = validator(value);

        if (typeof validatorResult === 'string') {
          const message =
            typeof value === 'object'
              ? `Invalid configuration for ${keyPath}: ${validatorResult}`
              : `Invalid configuration value ${value} for ${keyPath}: ${validatorResult}`;
          logError(keyPath, message);
          returnValue = false;
        }
      }
    } catch (e) {
      console.error(`Skipping invalid validator at "${keyPath}". Encountered error\n\t${e}`);
    }
  }
  return returnValue;
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
    if (schemaPart && (schemaPart.hasOwnProperty('_type') || schemaPart.hasOwnProperty('_default'))) {
      // We assume that schemaPart defines a config value, since it has
      // a property `_type` or `_default`.
      if (!config.hasOwnProperty(key)) {
        (config[key] as any) = schemaPart['_default'];
      }

      // We also check if it is an object or array with object elements, in which case we recurse
      const elements = schemaPart._elements;

      if (configPart && hasObjectSchema(elements)) {
        if (schemaPart._type === Type.Array && Array.isArray(configPart)) {
          const configWithDefaults = configPart.map((conf: Config) => setDefaults(elements, conf));
          config[key] = configWithDefaults;
        } else if (schemaPart._type === Type.Object) {
          for (let objectKey of Object.keys(configPart)) {
            configPart[objectKey] = setDefaults(elements, configPart[objectKey]);
          }
        }
      }
    } else if (isOrdinaryObject(schemaPart)) {
      // Since schemaPart has no property "_type", if it's an ordinary object
      // (unlike, importantly, the validators array), we assume it is a parent config property.
      // We recurse to config[key] and schema[key]. Default config[key] to {}.
      const selectedConfigPart = configPart ?? {};

      // There will have been a validation error already if configPart is not a plain object.
      if (isOrdinaryObject(selectedConfigPart)) {
        config[key] = setDefaults(schemaPart, selectedConfigPart);
      }
    }
  }

  return config;
};

function hasObjectSchema(elementsSchema: unknown): elementsSchema is ConfigSchema {
  return (
    !!elementsSchema && Object.keys(elementsSchema).filter((e) => !['_default', '_validators'].includes(e)).length > 0
  );
}

function isOrdinaryObject(value) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
/** Keep track of which validation errors we have displayed. Each one should only be displayed once. */
let displayedValidationMessages = new Set<string>();

function logError(keyPath: string, message: string) {
  const key = `${keyPath}:::${message}`;
  // technically, this should not be possible, but because of how things wind-up transpiled, this isn't impossible
  if (!displayedValidationMessages) {
    displayedValidationMessages = new Set<string>();
  }

  if (!displayedValidationMessages.has(key)) {
    console.error(message);
    displayedValidationMessages.add(key);
  }
}

/**
 * Normally, configuration errors are only displayed once. This function clears the list of
 * displayed errors, so that they will be displayed again.
 *
 * @internal
 */
export function clearConfigErrors(keyPath?: string) {
  if (keyPath) {
    displayedValidationMessages.forEach((key) => {
      if (key.startsWith(keyPath)) {
        displayedValidationMessages.delete(key);
      }
    });
  } else {
    displayedValidationMessages.clear();
  }
}

/**
 * Cleans up all config store subscriptions and re-establishes them. This is primarily
 * useful for testing, where subscriptions set up at module load time need to be cleared
 * between tests to prevent infinite update loops. After clearing, subscriptions are
 * re-established so the config system continues to work normally.
 *
 * @internal
 */
export function resetConfigSystem() {
  configSubscriptions.forEach((unsubscribe) => unsubscribe());
  configSubscriptions.length = 0;
  setupConfigSubscriptions();
}

/**
 * Copied over from esm-extensions. It rightly belongs to that module, but esm-config
 * cannot depend on esm-extensions.
 */
function getExtensionNameFromId(extensionId: string) {
  const [extensionName] = extensionId.split('#');
  return extensionName;
}

/**
 * The translation overrides schema is used in the implicit schema given to every module;
 * plus any additional translation namespaces (at time of writing, this is just 'core').
 */
const translationOverridesSchema: ConfigSchema = {
  'Translation overrides': {
    _description:
      'Per-language overrides for frontend translations should be keyed by language code and each language dictionary contains the translation key and the display value',
    _type: Type.Object,
    _default: {},
    _validators: [
      validator(
        (o) => Object.keys(o).every((k) => /^[a-z]{2,3}(-[A-Z]{2,3})?$/.test(k)),
        (o) => {
          const badKeys = Object.keys(o).filter((k) => !/^[a-z]{2,3}(-[A-Z]{2,3})?$/.test(k));
          return `The 'Translation overrides' object should have language codes for keys. Language codes must be in the form of a two-to-three letter language code optionally followed by a hyphen and a two-to-three letter country code. The following keys do not conform: ${badKeys.join(
            ', ',
          )}.`;
        },
      ),
    ],
  },
};

/**
 * The implicitConfigSchema is implicitly included in every configuration schema
 */
const implicitConfigSchema: ConfigSchema = {
  'Display conditions': {
    privileges: {
      _description: 'The privilege(s) the user must have to use this extension',
      _type: Type.Array,
      _default: [],
    },
    expression: {
      _description: 'The expression that determines whether the extension is displayed',
      _type: Type.String,
      _default: undefined,
    },
  },
  ...translationOverridesSchema,
};
