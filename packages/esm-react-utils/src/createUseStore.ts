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

export function createUseStore<T>(store: Store<T>) {
  return function useStore(actions?: Actions): T & BoundActions {
    const [state, set] = useState(store.getState());
    useEffect(() => store.subscribe((state) => set(state)), []);
    let boundActions = {};
    if (actions) {
      boundActions = useMemo(() => bindActions(store, actions), [
        store,
        actions,
      ]);
    }
    return { ...state, ...(boundActions as BoundActions) };
  };
}
