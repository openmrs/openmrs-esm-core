/** @module @category Store */
import { useEffect, useMemo, useState } from "react";
import type { StoreApi } from "zustand";

export type Actions = Function | Record<string, Function>;
export type BoundActions = { [key: string]: (...args: any[]) => void };

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

        return actions[i](_args);
      });
    };
  }

  return bound;
}

/** Avoid this; generally prefer to have clients use `useStore(yourStore)` */
export function createUseStore<T>(store: StoreApi<T>) {
  function useStore(): T;
  function useStore(actions: Actions): T & BoundActions;
  function useStore(actions?: Actions): T & BoundActions;
  function useStore(actions?: Actions) {
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
