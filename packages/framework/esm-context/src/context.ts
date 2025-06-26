/** @module @category Context */
'use strict';

import { createStore } from 'zustand/vanilla';
import { registerGlobalStore } from '@openmrs/esm-state';

interface OpenmrsAppContext {
  [namespace: string]: NonNullable<object>;
}

/**
 * @internal
 *
 * The application context store, using immer to potentially simplify updates
 */
export const contextStore = createStore<OpenmrsAppContext>()(() => ({}));

registerGlobalStore<OpenmrsAppContext>('openmrs-app-context', contextStore);

const nothing = Object();

/**
 * Used by callers to register a new namespace in the application context. Attempting to register
 * an already-registered namespace will display a warning and make no modifications to the state.
 *
 * @param namespace the namespace to register
 * @param initialValue the initial value of the namespace
 */
export function registerContext<T extends NonNullable<object> = NonNullable<object>>(
  namespace: string,
  initialValue: T = nothing,
) {
  contextStore.setState((state) => {
    if (namespace in state) {
      throw new Error(
        `Attempted to re-register namespace ${namespace} in the app context. Each namespace must be unregistered before the name can be registered again.`,
      );
    }

    return Object.assign({}, state, { [namespace]: initialValue === nothing ? {} : initialValue });
  });
}

/**
 * Used by caller to unregister a namespace in the application context. Unregistering a namespace
 * will remove the namespace and all associated data.
 */
export function unregisterContext(namespace: string) {
  contextStore.setState((state) => {
    if (namespace in state) {
      delete state[namespace];
    }
    return state;
  });
}

/**
 * Returns an _immutable_ version of the state of the namespace as it is currently
 *
 * @typeParam T The type of the value stored in the namespace
 * @param namespace The namespace to load properties from
 */
export function getContext<T extends NonNullable<object> = NonNullable<object>>(namespace: string): Readonly<T> | null;
/**
 * Returns an _immutable_ version of the state of the namespace as it is currently
 *
 * @typeParam T The type of the value stored in the namespace
 * @typeParam U The return type of this hook which is mostly relevant when using a selector
 * @param namespace The namespace to load properties from
 * @param selector An optional function which extracts the relevant part of the state
 */
export function getContext<T extends NonNullable<object> = NonNullable<object>, U extends NonNullable<object> = T>(
  namespace: string,
  selector: (state: Readonly<T>) => U = (state) => state as unknown as U,
): Readonly<U> | null {
  const state = contextStore.getState();
  if (namespace in state) {
    return Object.freeze(Object.assign({}, (selector ? selector(state[namespace] as T) : state[namespace]) as U));
  }

  return null;
}

/**
 * Updates a namespace in the global context. If the namespace does not exist, it is registered.
 */
export function updateContext<T extends NonNullable<object> = NonNullable<object>>(
  namespace: string,
  update: (state: T) => T,
) {
  contextStore.setState((state) => {
    if (!(namespace in state)) {
      state[namespace] = {};
    }

    state[namespace] = update(state[namespace] as T);
    return Object.assign({}, state);
  });
}

export type ContextCallback<T extends NonNullable<object> = NonNullable<object>> = (
  state: Readonly<T> | null | undefined,
) => void;

/**
 * Subscribes to updates of a given namespace. Note that the returned object is immutable.
 *
 * @param namespace the namespace to subscribe to
 * @param callback a function invoked with the current context whenever
 * @returns A function to unsubscribe from the context
 */
export function subscribeToContext<T extends NonNullable<object> = NonNullable<object>>(
  namespace: string,
  callback: ContextCallback<T>,
) {
  let previous = getContext<T>(namespace);

  // set initial value
  callback(Object.freeze(Object.assign({}, previous)));

  return contextStore.subscribe((state) => {
    let current: Readonly<T> | null | undefined = namespace in state ? (state[namespace] as T) : null;

    if (current !== previous) {
      previous = current;
      callback(Object.freeze(Object.assign({}, current)));
    }
  });
}
