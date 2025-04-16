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

export const getConfig = jest
  .fn()
  .mockImplementation(() => Promise.resolve(utils.getDefaultsFromConfigSchema(configSchema)));

export function defineConfigSchema(moduleName, schema) {
  configSchema = schema;
}

export function defineExtensionConfigSchema(extensionName, schema) {
  configSchema = schema;
}

export const clearConfigErrors = jest.fn();
