/** @module @category Framework */
import React, { ComponentType } from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import {
  openmrsComponentDecorator,
  ComponentDecoratorOptions,
} from "./openmrsComponentDecorator";

export function getLifecycle<T>(
  Component: ComponentType<T>,
  options: ComponentDecoratorOptions
) {
  return singleSpaReact({
    React,
    ReactDOMClient,
    rootComponent: openmrsComponentDecorator(options)(Component),
  });
}

export function getAsyncLifecycle<T>(
  lazy: () => Promise<{ default: ComponentType<T> }>,
  options: ComponentDecoratorOptions
) {
  return () =>
    lazy().then(({ default: Component }) => getLifecycle(Component, options));
}

export function getSyncLifecycle<T>(
  Component: ComponentType<T>,
  options: ComponentDecoratorOptions
) {
  return () => Promise.resolve(getLifecycle(Component, options));
}

/**
 * @deprecated Use getAsyncLifecycle instead.
 */
export const getAsyncExtensionLifecycle = getAsyncLifecycle;
