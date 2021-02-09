import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import {
  openmrsComponentDecorator,
  ComponentDecoratorOptions,
} from "./openmrsComponentDecorator";

export function getLifecycle<T>(
  Component: React.ComponentType<T>,
  options: ComponentDecoratorOptions
) {
  return singleSpaReact({
    React,
    ReactDOM,
    rootComponent: openmrsComponentDecorator(options)(Component),
  });
}

export function getAsyncLifecycle<T>(
  lazy: () => Promise<{ default: React.ComponentType<T> }>,
  options: ComponentDecoratorOptions
) {
  return () =>
    lazy().then(({ default: Component }) => getLifecycle(Component, options));
}
