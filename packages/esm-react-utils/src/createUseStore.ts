import { useEffect, useMemo, useState } from "react";
import { Store, BoundAction } from "unistore";

export type Reducer = Function | Array<string> | Object;
export type Actions = Function | { [key: string]: Function };

function runReducer<T>(state: T, reducer: Reducer) {
  if (typeof reducer === "function") {
    return reducer(state);
  }
  const out = {};
  if (typeof reducer === "string") {
    out[reducer] = state[reducer];
  } else if (Array.isArray(reducer)) {
    for (let i of reducer) {
      out[i] = state[i];
    }
  } else if (reducer) {
    for (let i in reducer) {
      out[i] = state[reducer[i]];
    }
  }
  return out;
}

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

export function createUseStore<T>(store: Store<T>) {
  return function useStore(
    reducer: Reducer,
    actions?: Actions
  ): T & { [key: string]: BoundAction } {
    const [state, set] = useState(runReducer(store.getState(), reducer));
    useEffect(
      () => store.subscribe((state) => set(runReducer(state, reducer))),
      []
    );
    let boundActions = {};
    if (actions) {
      boundActions = useMemo(() => bindActions(store, actions), [
        store,
        actions,
      ]);
    }
    return { ...state, ...boundActions };
  };
}
