/** @module @category Context */
'use strict';

import { type Immutable, isDraft, freeze, original } from 'immer';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';
import { registerGlobalStore } from '@openmrs/esm-state';

interface OpenmrsAppContext {
  [namespace: string]: unknown;
}

/**
 * @internal
 *
 * The application context store, using immer to potentially simplify updates
 */
export const contextStore = createStore<OpenmrsAppContext>()(immer(() => ({})));

registerGlobalStore<OpenmrsAppContext>('openmrs-app-context', contextStore);

const nothing = Object();

/**
 * Used by callers to register a new namespace in the application context. Attempting to register
 * an already-registered namespace will display a warning and make no modifications to the state.
 *
 * @param namespace the namespace to register
 * @param initialValue the initial value of the namespace
 */
export function registerContext(namespace: string, initialValue: unknown = nothing) {
  contextStore.setState((state) => {
    if (namespace in state) {
      console.warn(
        `Attempting to re-register namespace ${namespace} in the app context. This may indicate that more than one place trying to manage this namespace.`,
      );
      return;
    }

    state[namespace] = initialValue === nothing ? {} : initialValue;
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
  });
}

/**
 * Returns an _immutable_ version of the state of the namespace currently
 */
export function getContext<T = unknown>(namespace: string): Immutable<T> | null {
  const state = contextStore.getState();
  if (namespace in state) {
    return freeze(state[namespace] as Immutable<T>);
  }

  return null;
}

/**
 * Updates a namespace in the global context. If the namespace does not exist, it is registered.
 */
export function updateContext<T = unknown>(namespace: string, update: (state: T) => T) {
  contextStore.setState((state) => {
    if (!(namespace in state)) {
      state[namespace] = {};
    }

    state[namespace] = update(state[namespace] as T);
  });
}

export type ContextCallback<T = unknown> = (state: Readonly<T> | null | undefined) => void;

/**
 * Subscribes to updates of a given namespace. Note that the returned object is immutable.
 *
 * @param namespace the namespace to subscribe to
 * @param callback a function invoked with the current context whenever
 */
export function subscribeToContext<T = unknown>(namespace: string, callback: ContextCallback<T>) {
  let previous = getContext(namespace);
  if (isDraft(previous)) {
    previous = original(previous);
  }

  return contextStore.subscribe((state) => {
    let current: T | null | undefined = namespace in state ? (state[namespace] as T) : null;
    if (isDraft(current)) {
      current = original(current);
    }

    if (current !== previous) {
      previous = current;
      callback(freeze(current));
    }
  });
}
