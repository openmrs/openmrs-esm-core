import { vi } from 'vitest';
import { getGlobalStore } from '@openmrs/esm-state/mock';
import { type WorkspaceGroupRegistration, type WorkspaceRegistration } from '.';

export const attach = vi.fn();
export const detach = vi.fn();
export const detachAll = vi.fn();

export const switchTo = vi.fn();

export const getExtensionStore = () => getGlobalStore('extensions', { slots: {} });

export const getExtensionInternalStore = () =>
  getGlobalStore('extensions-internal', {
    slots: {},
    extensions: {},
  });

const mockExtensionRegistry = {};

export const getExtensionRegistration = vi.fn((name) => {
  return mockExtensionRegistry[name];
});

export const registerExtension = vi.fn((ext) => {
  mockExtensionRegistry[ext.name] = ext;
});

export function clearMockExtensionRegistry() {
  Object.keys(mockExtensionRegistry).forEach((key) => {
    delete mockExtensionRegistry[key];
  });
}
