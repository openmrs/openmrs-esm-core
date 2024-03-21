import { getGlobalStore } from '@openmrs/esm-state/mock';

export const attach = jest.fn();
export const detach = jest.fn();
export const detachAll = jest.fn();

export const switchTo = jest.fn();

export const getExtensionStore = () => getGlobalStore('extensions', { slots: {} });

export const getExtensionInternalStore = () =>
  getGlobalStore('extensions-internal', {
    slots: {},
    extensions: {},
  });
