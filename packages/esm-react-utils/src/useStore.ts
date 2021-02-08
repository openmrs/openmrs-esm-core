import { Store } from "unistore";
import { Actions, createUseStore } from "./createUseStore";

export function useStore<T>(store: Store<T>, actions?: Actions) {
  return createUseStore<T>(store)(actions);
}
