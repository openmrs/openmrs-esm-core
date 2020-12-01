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

export interface AppState {
  /**
   * The simplified route of the currently active page.
   * Pages are declared in `setupOpenMRS`, as a `pages` array.
   *
   * For example, for route `/^patient\/.+\/chart/` the activePage
   * will be `patient-chart`.
   */
  activePage: string | null;
}

export function createAppState(initialState: AppState) {
  return createGlobalStore("app", initialState);
}

export function getAppState() {
  return getGlobalStore<AppState>("app", {
    activePage: null,
  });
}
