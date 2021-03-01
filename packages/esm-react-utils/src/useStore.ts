import { Store } from "unistore";
import { Actions, BoundActions, createUseStore } from "./createUseStore";

export function useStore<T>(store: Store<T>): T;
export function useStore<T>(
  store: Store<T>,
  actions: Actions
): T & BoundActions;
export function useStore<T>(store: Store<T>, actions?: Actions) {
  return createUseStore<T>(store)(actions);
}
