import { jest } from '@jest/globals';
import { createGlobalStore } from '@openmrs/esm-state/mock';
import * as utils from '@openmrs/esm-utils';

export { validators, validator } from './src/index';

export const configInternalStore = createGlobalStore('config-internal', {});

export const implementerToolsConfigStore = createGlobalStore('implementer-tools-config', {});

export const temporaryConfigStore = createGlobalStore('temporary-config', {});

export enum Type {
  Array = 'Array',
  Boolean = 'Boolean',
  ConceptUuid = 'ConceptUuid',
  Number = 'Number',
  Object = 'Object',
  String = 'String',
  UUID = 'UUID',
}

export let configSchema = {};

// Track extension-specific config schemas
export const extensionConfigSchemas: Record<string, object> = {};

export const getConfig = jest
  .fn()
  .mockImplementation(() => Promise.resolve(utils.getDefaultsFromConfigSchema(configSchema)));

export function defineConfigSchema(moduleName, schema) {
  configSchema = schema;
}

export function defineExtensionConfigSchema(extensionName: string, schema) {
  extensionConfigSchemas[extensionName] = schema;
  // Also set as the current schema for backwards compatibility
  configSchema = schema;
}

export const extensionHasOwnConfigSchema = jest.fn((extensionName: string) => {
  return !!extensionConfigSchemas[extensionName];
});

export const clearConfigErrors = jest.fn();

/**
 * Resets the mock state - useful in test cleanup
 */
export function resetMockConfig() {
  configSchema = {};
  Object.keys(extensionConfigSchemas).forEach((key) => delete extensionConfigSchemas[key]);
}
