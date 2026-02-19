// Storybook-compatible mock for @openmrs/esm-state.

const stores: Record<string, any> = {};

export function createGlobalStore<T>(name: string, initialState: T) {
  const state = { ...initialState } as T;
  const listeners = new Set<(state: T) => void>();

  const store = {
    getState: () => state,
    setState: (partial: Partial<T>) => {
      Object.assign(state as any, partial);
      listeners.forEach((fn) => fn(state));
    },
    subscribe: (fn: (state: T) => void) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };

  stores[name] = store;
  return store;
}

export function getGlobalStore<T>(name: string, fallbackState?: T) {
  if (!stores[name] && fallbackState !== undefined) {
    return createGlobalStore(name, fallbackState);
  }
  return stores[name] ?? createGlobalStore(name, {} as T);
}

export function registerGlobalStore<T>(name: string, store: any) {
  stores[name] = store;
  return store;
}

export function subscribeTo<T>(store: any, select: (state: T) => any, callback: (value: any) => void) {
  const unsubscribe = store.subscribe((state: T) => {
    callback(select(state));
  });
  callback(select(store.getState()));
  return unsubscribe;
}
