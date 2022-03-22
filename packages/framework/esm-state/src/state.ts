/** @module @category Store */
import createStore, { Store } from "unistore";

interface StoreEntity {
  value: Store<any>;
  active: boolean;
}

const availableStores: Record<string, StoreEntity> = {};

/**
 * Creates a Unistore [store](https://github.com/developit/unistore#store).
 *
 * @param name A name by which the store can be looked up later.
 *    Must be unique across the entire application.
 * @param initialState An object which will be the initial state of the store.
 * @returns The newly created store.
 */
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

    return store;
  }
}

/**
 * Returns the existing [store](https://github.com/developit/unistore#store) named `name`,
 * or creates a new store named `name` if none exists.
 *
 * @param name The name of the store to look up.
 * @param fallbackState The initial value of the new store if no store named `name` exists.
 * @returns The found or newly created store.
 */
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
    return store;
  }

  return available.value;
}

export interface AppState {}

/**
 * @internal
 */
export function createAppState(initialState: AppState) {
  return createGlobalStore("app", initialState);
}

/**
 * @returns The [store](https://github.com/developit/unistore#store) named `app`.
 */
export function getAppState() {
  return getGlobalStore<AppState>("app", {});
}

export function subscribeTo<T, U>(
  store: Store<T>,
  select: (state: T) => U,
  handle: (subState: U) => void
) {
  let previous = select(store.getState());

  return store.subscribe((state) => {
    const current = select(state);

    if (current !== previous) {
      previous = current;
      handle(current);
    }
  });
}
