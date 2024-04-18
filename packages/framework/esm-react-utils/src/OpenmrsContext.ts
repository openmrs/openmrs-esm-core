import { type PropsWithChildren, memo } from 'react';
import useDefineAppContextNamespace from './useDefineAppContextNamespace';

interface OpenmrsAppContextProps<T = unknown> {
  namespace: string;
  value?: T;
}

/**
 * OpenmrsAppContext is a simple React component meant to function similarly to React's Context,
 * but built on top of the OpenmrsAppContext.
 *
 * In essence, this component can be used like:
 * ```ts
 *    <OpenmrsAppContext namespace="something" value={{ key: "1234" }} />
 * ```
 *
 * **Notes on usage:** Unlike a proper React context where the value is limited to the subtree under the
 * context component, the `OpenmrsAppContext` is inherently global in scope. That means that _all applications_
 * will see the values that you set for the namespace if they load the value of the namespace.
 *
 * Similarly, while for ergonomic reasons, this object can take child nodes, this is likely to lead to undesirable
 * re-renders, so it is recommended to not provide any child components for this one.
 */
export default function OpenmrsAppContext<T = unknown>({
  namespace,
  value,
  children,
}: PropsWithChildren<OpenmrsAppContextProps<T>>) {
  useDefineAppContextNamespace(namespace, value);

  return children;
}
