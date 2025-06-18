/** @module @category Extension */
import React, { useMemo } from 'react';
import { getSingleAssignedExtension, type AssignedExtension } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';
import { Extension } from './Extension';
import { useExtensionSlot } from './useExtensionSlot';

export interface ExtensionSlotBaseProps {
  name: string;
  select?: (extensions: Array<AssignedExtension>) => Array<AssignedExtension>;
  state?: Record<string, unknown>;
}

export type ExtensionSlotProps = ExtensionSlotBaseProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    children?: React.ReactNode | ((extension: AssignedExtension, state?: Record<string, unknown>) => React.ReactNode);
  };

function defaultSelect(extensions: Array<AssignedExtension>) {
  return extensions;
}

/**
 * An [extension slot](https://o3-docs.openmrs.org/docs/extension-system).
 * A place with a name. Extensions that get connected to that name
 * will be rendered into this.
 *
 * @param props.name The name of the extension slot
 * @param props.select An optional function for filtering or otherwise modifying
 *   the list of extensions that will be rendered.
 * @param props.state *Only works if no children are provided*. Passes data
 *   through as props to the extensions that are mounted here. If `ExtensionSlot`
 *   has children, you must pass the state through the `state` param of the
 *   `Extension` component.
 * @param props.children There are two different ways to use `ExtensionSlot`
 *   children.
 *  - Passing a `ReactNode`, the "normal" way. The child must contain the component
 *     `Extension`. Whatever is passed as the child will be rendered once per extension.
 *     See the first example below.
 *  - Passing a function, the "render props" way. The child must be a function
 *     which takes a [[ConnectedExtension]] as argument and returns a `ReactNode`.
 *     the resulting react node must contain the component `Extension`. It will
 *     be run for each extension. See the second example below.
 *
 * @example
 * Passing a react node as children
 *
 * ```tsx
 * <ExtensionSlot name="Foo">
 *   <div style={{ width: 10rem }}>
 *     <Extension />
 *   </div>
 * </ExtensionSlot>
 * ```
 *
 * @example
 * Passing a function as children
 *
 * ```tsx
 * <ExtensionSlot name="Bar">
 *   {(extension) => (
 *     <h1>{extension.name}</h1>
 *     <div style={{ color: extension.meta.color }}>
 *       <Extension />
 *     </div>
 *   )}
 * </ExtensionSlot>
 * ```
 *
 */
export function ExtensionSlot({
  name,
  select = defaultSelect,
  children,
  state,
  style,
  ...divProps
}: ExtensionSlotProps) {
  if (children && state) {
    throw new Error(
      'Both children and state have been provided. If children are provided, the state must be passed as a prop to the `Extension` component.',
    );
  }

  const { extensions, extensionSlotModuleName } = useExtensionSlot(name);

  const extensionsToRender = useMemo(() => select(extensions), [select, extensions]);

  return (
    <RenderedExtensions
      {...{ children, state, extensionsToRender, name, style, extensionSlotModuleName, ...divProps }}
    />
  );
}

type SingleExtensionSlotProps = Omit<ExtensionSlotProps, 'name' | 'select'> & { extensionId: string };

/**
 * A special extension slot, with slot name 'global', that renders only one single extension
 * by its extensionId. The extensionId is the extension name, with an optional `#<string>` suffix
 * used to indicate specific configuration. (For example, given a extension with name 'foo',
 * then 'foo', 'foo#bar', 'foo#baz' are all valid extensionIds)
 *
 * @see ExtensionSlot
 *
 * @example
 * Passing a react node as children
 *
 * ```tsx
 * <SingleExtensionSlot extensionId="foo">
 *   <div style={{ width: 10rem }}>
 *     <Extension />
 *   </div>
 * </SingleExtensionSlot>
 * ```
 *
 * @example
 * Passing a function as children
 *
 * ```tsx
 * <SingleExtensionSlot extensionId="bar">
 *   {(extension) => (
 *     <h1>{extension.name}</h1>
 *     <div style={{ color: extension.meta.color }}>
 *       <Extension />
 *     </div>
 *   )}
 * </SingleExtensionSlot>
 * ```
 */
export function SingleExtensionSlot({ extensionId, children, state, style, ...divProps }: SingleExtensionSlotProps) {
  const singleExtension = getSingleAssignedExtension(extensionId);
  if (singleExtension == null) {
    return null;
  }

  return (
    <RenderedExtensions
      {...{
        children,
        state,
        extensionsToRender: [singleExtension],
        name: 'global',
        style,
        extensionSlotModuleName: '@openmrs/esm-app-shell',
        ...divProps,
      }}
    />
  );
}

type RenderedExtensionsProps = Omit<ExtensionSlotProps, 'select'> & {
  extensionsToRender: AssignedExtension[];
  extensionSlotModuleName: string;
};

function RenderedExtensions({
  children,
  state,
  extensionsToRender,
  name,
  style,
  extensionSlotModuleName,
  ...divProps
}: RenderedExtensionsProps) {
  const renderedExtensions: React.ReactNode[] = useMemo(() => {
    return extensionsToRender.map((extension) => {
      if (typeof children === 'function' && !React.isValidElement(children)) {
        return children(extension, state);
      } else if (children) {
        return children;
      } else {
        return <Extension state={state} />;
      }
    });
  }, [children, extensionsToRender, state]);

  return (
    <div
      data-extension-slot-name={name}
      data-extension-slot-module-name={extensionSlotModuleName}
      style={{ ...style, position: 'relative' }}
      {...divProps}
    >
      {extensionsToRender?.map((extension, i) => (
        <ComponentContext.Provider
          key={extension.id}
          value={{
            moduleName: extensionSlotModuleName, // moduleName is not used by the receiving Extension
            featureName: '', // featureName is not used by the receiving Extension
            extension: {
              extensionId: extension.id,
              extensionSlotName: name,
              extensionSlotModuleName,
            },
          }}
        >
          {renderedExtensions[i]}
        </ComponentContext.Provider>
      ))}
    </div>
  );
}
