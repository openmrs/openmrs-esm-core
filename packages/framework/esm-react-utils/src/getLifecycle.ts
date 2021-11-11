import React from "react";
import ReactDOM from "react-dom";
import { LifeCycles } from "single-spa";
import singleSpaReact, { SingleSpaReactOpts } from "single-spa-react";
import {
  openmrsComponentDecorator,
  ComponentDecoratorOptions,
} from "./openmrsComponentDecorator";

export interface LifecycleWithContext<T> extends LifeCycles {
  framework: "react";
  lifecycleOpts: SingleSpaReactOpts<T>;
}

export function getLifecycle<T>(
  Component: React.ComponentType<T>,
  options: ComponentDecoratorOptions
): LifecycleWithContext<T> {
  const lifecycleOpts = {
    React,
    ReactDOM,
    rootComponent: openmrsComponentDecorator(options)(Component),
  };
  const lifecycle = singleSpaReact(lifecycleOpts);
  return { ...lifecycle, framework: "react", lifecycleOpts };
}

export function getAsyncLifecycle<T>(
  lazy: () => Promise<{ default: React.ComponentType<T> }>,
  options: ComponentDecoratorOptions
) {
  return () =>
    lazy().then(({ default: Component }) => getLifecycle(Component, options));
}

export function getSyncLifecycle<T>(
  Component: React.ComponentType<T>,
  options: ComponentDecoratorOptions
) {
  return () => Promise.resolve(getLifecycle(Component, options));
}

/**
 * @deprecated Use getAsyncLifecycle instead.
 */
export const getAsyncExtensionLifecycle = getAsyncLifecycle;
