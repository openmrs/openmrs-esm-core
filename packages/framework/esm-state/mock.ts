import { vi } from 'vitest';
import { createStore, type StoreApi } from 'zustand';
export { subscribeTo } from './src/index';

// Needed for all mocks using stores
const availableStores: Record<string, StoreEntity> = {};
const initialStates: Record<string, any> = {};

interface StoreEntity {
  value: StoreApi<any>;
  active: boolean;
}

export type MockedStore<T> = StoreApi<T> & {
  resetMock: () => void;
};

export const mockStores = availableStores;

export function createGlobalStore<T>(name: string, initialState: T): StoreApi<T> {
  // We ignore whether there's already a store with this name so that tests
  // don't have to worry about clearing old stores before re-creating them.
  const store = createStore<T>()(() => initialState);
  initialStates[name] = initialState;

  availableStores[name] = {
    value: store,
    active: true,
  };

  return instrumentedStore(name, store);
}

export function registerGlobalStore<T>(name: string, store: StoreApi<T>): StoreApi<T> {
  availableStores[name] = {
    value: store,
    active: true,
  };

  return instrumentedStore(name, store);
}

export function getGlobalStore<T>(name: string, fallbackState?: T): StoreApi<T> {
  const available = availableStores[name];

  if (!available) {
    const store = createStore<T>()(() => fallbackState ?? ({} as unknown as T));
    initialStates[name] = fallbackState;
    availableStores[name] = {
      value: store,
      active: false,
    };
    return instrumentedStore(name, store);
  }

  return instrumentedStore(name, available.value);
}

function instrumentedStore<T>(name: string, store: StoreApi<T>) {
  return {
    getInitialState: vi.spyOn(store, 'getInitialState'),
    getState: vi.spyOn(store, 'getState'),
    setState: vi.spyOn(store, 'setState'),
    subscribe: vi.spyOn(store, 'subscribe'),
    destroy: vi.spyOn(store, 'destroy'),
    resetMock: () => store.setState(initialStates[name]),
  } as unknown as MockedStore<T>;
}
