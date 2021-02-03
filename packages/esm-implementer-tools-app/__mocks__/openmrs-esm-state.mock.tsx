// import merge from 'lodash-es/merge';

// let stores = {};

// export const createGlobalStore = jest.fn().mockImplementation((name, value) => {
//   stores[name] = value;
// });

// export const getGlobalStore = jest.fn().mockImplementation((name, defaultValue) => ({
//   getState: () => stores[name] ?? defaultValue,
//   setState: (val) => {
//     stores[name] = merge(stores[name], val);
//   },
//   subscribe: (updateFcn) => {
//     updateFcn(stores[name]);
//     return () => {};
//   },
//   unsubscribe: () => {},
// }));

import createStore, { Store } from "unistore";

interface StoreEntity {
  value: Store<any>;
  active: boolean;
}

const availableStores: Record<string, StoreEntity> = {};

export const mockStores = availableStores;

export function createGlobalStore<TState>(
  name: string,
  initialState: TState
): Store<TState> {
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
    const store = createStore(initialState);

    availableStores[name] = {
      value: store,
      active: true,
    };

    return instrumentedStore(store);
  }
}

export function getGlobalStore<TState = any>(
  name: string,
  fallbackState?: TState
): Store<TState> {
  const available = availableStores[name];

  if (!available) {
    const store = createStore(fallbackState);
    availableStores[name] = {
      value: store,
      active: false,
    };
    return instrumentedStore(store);
  }

  return instrumentedStore(available.value);
}

function instrumentedStore<T>(store: Store<T>) {
  return ({
    getState: jest.spyOn(store, "getState"),
    setState: jest.spyOn(store, "setState"),
    subscribe: jest.spyOn(store, "subscribe"),
    unsubscribe: jest.spyOn(store, "unsubscribe"),
  } as any) as Store<T>;
}
