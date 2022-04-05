import { subscribeTo } from "@openmrs/esm-state";
import { useEffect, useMemo, useState } from "react";
import { Store } from "unistore";
import { Actions, BoundActions } from "./createUseStore";

function bindActions<T>(store: Store<T>, actions: Actions) {
  if (typeof actions == "function") {
    actions = actions(store);
  }

  const bound = {};

  for (let i in actions) {
    bound[i] = store.action(actions[i]);
  }

  return bound;
}

const defaultSelectFunction = (x) => x;

function useStore<T, U>(store: Store<T>): T;
function useStore<T, U>(store: Store<T>, select: (state: T) => U): U;
function useStore<T, U>(
  store: Store<T>,
  select: undefined,
  actions: Actions
): T & BoundActions;
function useStore<T, U>(
  store: Store<T>,
  select: (state: T) => U,
  actions: Actions
): U & BoundActions;
function useStore<T, U>(
  store: Store<T>,
  select: (state: T) => U = defaultSelectFunction,
  actions?: Actions
) {
  const [state, setState] = useState<U>(() => select(store.getState()));
  useEffect(() => subscribeTo(store, select, setState), [store, select]);

  let boundActions: BoundActions = {};

  if (actions) {
    boundActions = useMemo(() => bindActions(store, actions), [store, actions]);
  }

  return { ...state, ...boundActions };
}

function useStoreWithActions<T>(
  store: Store<T>,
  actions: Actions
): T & BoundActions {
  return useStore(store, defaultSelectFunction, actions);
}

export { useStore, useStoreWithActions };
