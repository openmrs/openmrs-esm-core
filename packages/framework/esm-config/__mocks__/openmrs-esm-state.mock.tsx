import { createStore, StoreApi } from "zustand";
interface StoreEntity {
  value: StoreApi<any>;
  active: boolean;
}

export type MockedStore<T> = StoreApi<T> & {
  resetMock: () => void;
};
const initialStates: Record<string, any> = {};

const availableStores: Record<string, StoreEntity> = {};

export const mockStores = availableStores;

export function createGlobalStore<T>(
  name: string,
  initialState: T
): StoreApi<T> {
  const available = availableStores[name];

  if (available) {
    if (available.active) {
      console.error(
        "Cannot override an existing store. Make sure that stores are only created once."
      );
    } else {
      available.value.setState(initialState, true);
    }

    available.active = true;
    return available.value;
  } else {
    const store = createStore<T>()(() => initialState);
    initialStates[name] = initialState;

    availableStores[name] = {
      value: store,
      active: true,
    };

    return instrumentedStore(name, store);
  }
}

export function getGlobalStore<T>(
  name: string,
  fallbackState?: T
): StoreApi<T> {
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
    getState: jest.spyOn(store, "getState"),
    setState: jest.spyOn(store, "setState"),
    subscribe: jest.spyOn(store, "subscribe"),
    resetMock: () => store.setState(initialStates[name]),
  } as any as MockedStore<T>;
}
