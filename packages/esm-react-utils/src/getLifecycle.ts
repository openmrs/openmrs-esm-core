import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import { openmrsExtensionDecorator } from "./openmrsExtensionDecorator";
import {
  openmrsRootDecorator,
  RootDecoratorOptions,
} from "./openmrsRootDecorator";

export function getRootedLifecycle<T>(
  Root: React.ComponentType<T>,
  options: RootDecoratorOptions
) {
  return singleSpaReact({
    React,
    ReactDOM,
    rootComponent: openmrsRootDecorator(options)(Root),
  });
}

export function getAsyncLifecycle<T>(
  lazyRoot: () => Promise<{ default: React.ComponentType<T> }>,
  options: RootDecoratorOptions
) {
  return () =>
    lazyRoot().then(({ default: Root }) => getRootedLifecycle(Root, options));
}

export function getExtensionLifecycle<T>(
  Root: React.ComponentType<T>,
  options: RootDecoratorOptions
) {
  return singleSpaReact({
    React,
    ReactDOM,
    rootComponent: openmrsExtensionDecorator(options)(Root),
  });
}

export function getAsyncExtensionLifecycle<T>(
  lazyExtension: () => Promise<{ default: React.ComponentType<T> }>,
  options: RootDecoratorOptions
) {
  return () =>
    lazyExtension().then(({ default: Root }) =>
      getExtensionLifecycle(Root, options)
    );
}
