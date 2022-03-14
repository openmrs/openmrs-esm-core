import { useEffect, useMemo, useState } from "react";
import { Store, BoundAction } from "unistore";

export type Actions = Function | { [key: string]: Function };
export type BoundActions = { [key: string]: BoundAction };

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

/** Avoid this; generally prefer to have clients use `useStore(yourStore)` */
export function createUseStore<T>(store: Store<T>) {
  function useStore(): T;
  function useStore(actions: Actions): T & BoundActions;
  function useStore(actions?: Actions): T & BoundActions;
  function useStore(actions?: Actions) {
    const [state, set] = useState(store.getState());
    useEffect(() => store.subscribe((state) => set(state)), []);
    let boundActions: BoundActions = {};

    if (actions) {
      boundActions = useMemo(
        () => bindActions(store, actions),
        [store, actions]
      );
    }

    return { ...state, ...boundActions };
  }

  return useStore;
}
