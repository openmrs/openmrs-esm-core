/** @module @category Store */
import { subscribeTo } from "@openmrs/esm-state";
import { useEffect, useMemo, useState } from "react";
import type { StoreApi } from "zustand";
import type { Actions, BoundActions } from "./createUseStore";

function bindActions<T>(store: StoreApi<T>, actions: Actions): BoundActions {
  if (typeof actions == "function") {
    actions = actions(store);
  }

  const bound = {};

  for (let i in actions) {
    bound[i] = () => {
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
  actions: Actions
): T & BoundActions;
function useStore<T, U>(
  store: StoreApi<T>,
  select: (state: T) => U,
  actions: Actions
): U & BoundActions;
function useStore<T, U>(
  store: StoreApi<T>,
  select: (state: T) => U = defaultSelectFunction,
  actions?: Actions
) {
  const [state, setState] = useState<U>(() => select(store.getState()));
  useEffect(() => subscribeTo(store, select, setState), [store, select]);

  let boundActions: BoundActions = useMemo(
    () => (actions ? bindActions(store, actions) : {}),
    [store, actions]
  );

  return { ...state, ...boundActions };
}

function useStoreWithActions<T>(
  store: StoreApi<T>,
  actions: Actions
): T & BoundActions {
  return useStore(store, defaultSelectFunction, actions);
}

export { useStore, useStoreWithActions };
