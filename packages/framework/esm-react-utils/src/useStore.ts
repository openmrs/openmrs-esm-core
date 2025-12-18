/** @module @category Store */
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { StoreApi } from 'zustand';

export type ActionFunction<T> = (state: T, ...args: any[]) => Partial<T>;

type ActionFunctionsRecord<T> = Record<string, ActionFunction<T>>;

export type Actions<T> = ((store: StoreApi<T>) => ActionFunctionsRecord<T>) | ActionFunctionsRecord<T>;

export type BoundActions<T, A extends Actions<T>> = A extends ActionFunctionsRecord<T>
  ? BindFunctionsIn<A>
  : A extends (store: StoreApi<T>) => ActionFunctionsRecord<T>
    ? BindFunctionsIn<ActionFunctionsRecord<T>>
    : never;

// Given function type F, returns a new function type
// with F's first input argument removed and its return type set to void
type Bind<F extends (...args: any[]) => any> = F extends (firstArg, ...restArgs: infer RestArgsType) => any
  ? (...args: RestArgsType) => void
  : never;

// Given record type R, returns a new record type with Bind applied to every function in R
type BindFunctionsIn<R extends Record<string, (...args: any[]) => any>> = {
  [Prop in keyof R]: Bind<R[Prop]>;
};

function bindActions<T>(store: StoreApi<T>, actions: Actions<T>): BoundActions<T, Actions<T>> {
  if (typeof actions == 'function') {
    actions = actions(store);
  }

  const bound = {};

  for (const [actionName, actionFunction] of Object.entries(actions)) {
    const boundFunction: Bind<ActionFunction<T>> = function (...args) {
      store.setState((state) => {
        return actionFunction(state, ...args);
      });
    };
    bound[actionName] = boundFunction;
  }

  return bound;
}

const defaultSelectFunction =
  <T, U>() =>
  (x: T) =>
    x as unknown as U;

function useStore<T>(store: StoreApi<T>): T;
function useStore<T, U>(store: StoreApi<T>, select: (state: T) => U): U;
function useStore<T, U, A extends Actions<T>>(
  store: StoreApi<T>,
  select: undefined,
  actions: A,
): T & BoundActions<T, A>;
function useStore<T, U, A extends Actions<T>>(
  store: StoreApi<T>,
  select: (state: T) => U,
  actions: A,
): U & BoundActions<T, A>;
function useStore<T, U, A extends Actions<T>>(
  store: StoreApi<T>,
  select: (state: T) => U = defaultSelectFunction(),
  actions?: A,
) {
  // Use useSyncExternalStore to subscribe synchronously during render
  // This ensures React can properly track all state updates
  const subscribe = useCallback(
    (callback: () => void) => {
      return store.subscribe(callback);
    },
    [store],
  );

  const getSnapshot = useCallback(() => select(store.getState()), [store, select]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  let boundActions: BoundActions<T, Actions<T>> = useMemo(
    () => (actions ? bindActions(store, actions) : {}),
    [store, actions],
  );

  return { ...state, ...boundActions };
}

/**
 *
 * @param store A zustand store
 * @param actions
 * @returns
 */
function useStoreWithActions<T, A extends Actions<T>>(store: StoreApi<T>, actions: A): T & BoundActions<T, A> {
  return useStore(store, defaultSelectFunction<T, T>(), actions);
}

/**
 * Whenever possible, use `useStore(yourStore)` instead. This function is for creating a
 * custom hook for a specific store.
 */
function createUseStore<T>(store: StoreApi<T>) {
  function useStore(): T;
  function useStore<A extends Actions<T>>(actions: A): T & BoundActions<T, A>;
  function useStore<A extends Actions<T>>(actions?: A): T & BoundActions<T, A>;
  function useStore<A extends Actions<T>>(actions?: A) {
    const subscribe = useCallback((callback: () => void) => store.subscribe(callback), []);
    const getSnapshot = useCallback(() => store.getState(), []);
    const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    let boundActions: BoundActions<T, Actions<T>> = useMemo(
      () => (actions ? bindActions(store, actions) : {}),
      [actions],
    );

    return { ...state, ...boundActions };
  }

  return useStore;
}

export { createUseStore, useStore, useStoreWithActions };
