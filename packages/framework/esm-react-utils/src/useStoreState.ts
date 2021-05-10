import { subscribeTo } from "@openmrs/esm-state";
import { useEffect, useState } from "react";
import { Store } from "unistore";

export function useStoreState<T, U>(store: Store<T>, select: (state: T) => U) {
  const [state, setState] = useState<U>(() => select(store.getState()));

  useEffect(() => subscribeTo(store, select, setState), [store, select]);

  return state;
}
