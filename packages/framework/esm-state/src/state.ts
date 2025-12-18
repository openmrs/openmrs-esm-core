/** @module @category Store */
import type {} from '@openmrs/esm-globals';
import { shallowEqual } from '@openmrs/esm-utils';
import type { StoreApi } from 'zustand/vanilla';
import { createStore } from 'zustand/vanilla';
import { isTestEnvironment } from './utils';

interface StoreEntity {
  value: StoreApi<unknown>;
  active: boolean;
}

const availableStores: Record<string, StoreEntity> = {};

// spaEnv isn't available immediately. Wait a bit before making stores available
// on window in development mode.
globalThis.setTimeout?.(() => {
  if (typeof window !== 'undefined' && window.spaEnv === 'development') {
    window['stores'] = availableStores;
  }
}, 1000);

/**
 * Creates a Zustand store.
 *
 * @param name A name by which the store can be looked up later.
 *    Must be unique across the entire application.
 * @param initialState An object which will be the initial state of the store.
 * @returns The newly created store.
 */
export function createGlobalStore<T>(name: string, initialState: T): StoreApi<T> {
  const available = availableStores[name];

  if (available) {
    if (available.active) {
      if (!isTestEnvironment()) {
        console.error(`Attempted to override the existing store ${name}. Make sure that stores are only created once.`);
      }
    } else {
      available.value.setState(initialState, true);
    }

    available.active = true;
    return available.value as StoreApi<T>;
  } else {
    const store = createStore<T>()(() => initialState);

    availableStores[name] = {
      value: store,
      active: true,
    };

    return store;
  }
}

/**
 * Registers an existing Zustand store.
 *
 * @param name A name by which the store can be looked up later.
 *    Must be unique across the entire application.
 * @param store The Zustand store to use for this.
 * @returns The newly registered store.
 */
export function registerGlobalStore<T>(name: string, store: StoreApi<T>): StoreApi<T> {
  const available = availableStores[name];

  if (available) {
    if (available.active) {
      if (!isTestEnvironment()) {
        console.error(`Attempted to override the existing store ${name}. Make sure that stores are only created once.`);
      }
    } else {
      available.value = store;
    }

    available.active = true;
    return available.value as StoreApi<T>;
  } else {
    availableStores[name] = {
      value: store,
      active: true,
    };

    return store;
  }
}

/**
 * Returns the existing store named `name`,
 * or creates a new store named `name` if none exists.
 *
 * @param name The name of the store to look up.
 * @param fallbackState The initial value of the new store if no store named `name` exists.
 * @returns The found or newly created store.
 */
export function getGlobalStore<T>(name: string, fallbackState?: T): StoreApi<T> {
  const available = availableStores[name];

  if (!available) {
    const store = createStore<T>()(() => fallbackState ?? ({} as unknown as T));
    availableStores[name] = {
      value: store,
      active: false,
    };
    return store;
  }

  return available.value as StoreApi<T>;
}

type SubscribeToArgs<T, U> = [StoreApi<T>, (state: T) => void] | [StoreApi<T>, (state: T) => U, (state: U) => void];

export function subscribeTo<T, U = T>(store: StoreApi<T>, handle: (state: T) => void): () => void;
export function subscribeTo<T, U>(
  store: StoreApi<T>,
  select: (state: T) => U,
  handle: (subState: U) => void,
): () => void;
export function subscribeTo<T, U>(...args: SubscribeToArgs<T, U>): () => void {
  const [store, select, handle] = args;
  const handler = typeof handle === 'undefined' ? (select as unknown as (state: U) => void) : handle;
  const selector = typeof handle === 'undefined' ? (state: T) => state as unknown as U : (select as (state: T) => U);

  let previous = selector(store.getState());
  handler(previous);
  return store.subscribe((state) => {
    const current = selector(state);

    if (!shallowEqual(previous, current)) {
      previous = current;
      handler(current);
    }
  });
}
