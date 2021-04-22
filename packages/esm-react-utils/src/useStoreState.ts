import { useEffect, useState } from "react";
import { Store } from "unistore";

export function useStoreState<T, U>(store: Store<T>, select: (state: T) => U) {
  const [state, setState] = useState<U>(() => select(store.getState()));

  useEffect(() => {
    return store.subscribe((newState) => {
      const result = select(newState);

      if (result !== state) {
        setState(result);
      }
    });
  }, [state, select]);

  return state;
}
