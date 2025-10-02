/** @module @category Extension */
import React, { useRef, useMemo, useEffect } from 'react';
import { updateInternalExtensionStore, type AssignedExtension } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';
import { Extension } from './Extension';
import { useExtensionSlot } from './useExtensionSlot';

export interface ExtensionSlotBaseProps {
  /** The name of the extension slot */
  name: string;
  /**
   * The name of the extension slot
   * @deprecated Use `name`
   */
  extensionSlotName?: string;
  /**
   * An optional function for filtering or otherwise modifying
   *   the list of extensions that will be rendered.
   */
  select?: (extensions: Array<AssignedExtension>) => Array<AssignedExtension>;
  /**
   *Only works if no children are provided*. Passes data
   *   through as props to the extensions that are mounted here. If `ExtensionSlot`
   *   has children, you must pass the state through the `state` param of the
   *   `Extension` component.
   */
  state?: Record<string | symbol | number, unknown>;
}

export interface ExtensionSlotProps
  extends ExtensionSlotBaseProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode | ((extension: AssignedExtension, state?: Record<string, unknown>) => React.ReactNode);
}

function defaultSelect(extensions: Array<AssignedExtension>) {
  return extensions;
}

/**
 * An [extension slot](https://o3-docs.openmrs.org/docs/extension-system).
 * A place with a name. Extensions that get connected to that name
 * will be rendered into this.
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
  name: extensionSlotName,
  extensionSlotName: legacyExtensionSlotName,
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

  const name = (extensionSlotName ?? legacyExtensionSlotName) as string;
  const slotRef = useRef(null);
  const { extensions, extensionSlotModuleName } = useExtensionSlot(name, state);

  const extensionsToRender = useMemo(() => select(extensions), [select, extensions]);

  const extensionsFromChildrenFunction = useMemo(() => {
    if (typeof children == 'function' && !React.isValidElement(children)) {
      return extensionsToRender.map((extension) => children(extension, state));
    }
  }, [children, extensionsToRender]);

  return (
    <div
      ref={slotRef}
      data-extension-slot-name={name}
      data-extension-slot-module-name={extensionSlotModuleName}
      style={{ ...style, position: 'relative' }}
      {...divProps}
    >
      {name &&
        extensionsToRender?.map((extension, i) => (
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
            {extensionsFromChildrenFunction?.[i] ?? (typeof children !== 'function' ? children : null) ?? (
              <Extension state={state} />
            )}
          </ComponentContext.Provider>
        ))}
    </div>
  );
}
