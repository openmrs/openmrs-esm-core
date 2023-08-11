/** @module @category Store */
import { subscribeTo } from "@openmrs/esm-state";
import { useEffect, useMemo, useState } from "react";
import type { StoreApi } from "zustand";

export type ActionFunction<T> = (state: T, ...args: any[]) => Partial<T>;
export type Actions<T> =
  | ((store: StoreApi<T>) => Record<string, ActionFunction<T>>)
  | Record<string, ActionFunction<T>>;
export type BoundActions = { [key: string]: (...args: any[]) => void };

function bindActions<T>(store: StoreApi<T>, actions: Actions<T>): BoundActions {
  if (typeof actions == "function") {
    actions = actions(store);
  }

  const bound = {};

  for (let i in actions) {
    bound[i] = function () {
      const args = arguments;
      store.setState((state) => {
        let _args = [state];
        for (let i = 0; i < args.length; i++) {
          _args.push(args[i]);
        }

        return actions[i](..._args);
      });
    };
  }

  return bound;
}

const defaultSelectFunction = (x) => x;

function useStore<T, U>(store: StoreApi<T>): T;
function useStore<T, U>(store: StoreApi<T>, select: (state: T) => U): U;
function useStore<T, U>(
  store: StoreApi<T>,
  select: undefined,
  actions: Actions<T>
): T & BoundActions;
function useStore<T, U>(
  store: StoreApi<T>,
  select: (state: T) => U,
  actions: Actions<T>
): U & BoundActions;
function useStore<T, U>(
  store: StoreApi<T>,
  select: (state: T) => U = defaultSelectFunction,
  actions?: Actions<T>
) {
  const [state, setState] = useState<U>(() => select(store.getState()));
  useEffect(() => subscribeTo(store, select, setState), [store, select]);

  let boundActions: BoundActions = useMemo(
    () => (actions ? bindActions(store, actions) : {}),
    [store, actions]
  );

  return { ...state, ...boundActions };
}

/**
 *
 * @param store A zustand store
 * @param actions
 * @returns
 */
function useStoreWithActions<T>(
  store: StoreApi<T>,
  actions: Actions<T>
): T & BoundActions {
  return useStore(store, defaultSelectFunction, actions);
}

/**
 * Whenever possible, use `useStore(yourStore)` instead. This function is for creating a
 * custom hook for a specific store.
 */
function createUseStore<T>(store: StoreApi<T>) {
  function useStore(): T;
  function useStore(actions: Actions<T>): T & BoundActions;
  function useStore(actions?: Actions<T>): T & BoundActions;
  function useStore(actions?: Actions<T>) {
    const [state, set] = useState(store.getState());
    useEffect(() => store.subscribe((state) => set(state)), []);
    let boundActions: BoundActions = useMemo(
      () => (actions ? bindActions(store, actions) : {}),
      [actions]
    );

    return { ...state, ...boundActions };
  }

  return useStore;
}

export { createUseStore, useStore, useStoreWithActions };
