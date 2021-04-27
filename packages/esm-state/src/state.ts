import createStore, { Store } from "unistore";

interface StoreEntity {
  value: Store<any>;
  active: boolean;
}

const availableStores: Record<string, StoreEntity> = {};

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

export function createAppState(initialState: AppState) {
  return createGlobalStore("app", initialState);
}

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
