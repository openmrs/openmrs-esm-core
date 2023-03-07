import React, { useRef, useMemo } from "react";
import type { ConnectedExtension } from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";
import { Extension } from "./Extension";
import { useExtensionSlot } from "./useExtensionSlot";

export interface ExtensionSlotBaseProps {
  name: string;
  /** @deprecated Use `name` */
  extensionSlotName?: string;
  select?: (extensions: Array<ConnectedExtension>) => Array<ConnectedExtension>;
  state?: Record<string, any>;
}

export interface OldExtensionSlotBaseProps {
  name?: string;
  /** @deprecated Use `name` */
  extensionSlotName: string;
  select?: (extensions: Array<ConnectedExtension>) => Array<ConnectedExtension>;
  state?: Record<string, any>;
}

export type ExtensionSlotProps = (
  | OldExtensionSlotBaseProps
  | ExtensionSlotBaseProps
) &
  Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
    children?:
      | React.ReactNode
      | ((extension: ConnectedExtension) => React.ReactNode);
  };

function defaultSelect(extensions: Array<ConnectedExtension>) {
  return extensions;
}

/**
 * An [extension slot](https://o3-dev.docs.openmrs.org/#/main/extensions).
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
      "Both children and state have been provided. If children are provided, the state must be passed as a prop to the `Extension` component."
    );
  }

  const name = (extensionSlotName ?? legacyExtensionSlotName) as string;
  const slotRef = useRef(null);
  const { extensions, extensionSlotModuleName } = useExtensionSlot(name);

  const extensionsToRender = useMemo(
    () => select(extensions),
    [select, extensions]
  );

  const extensionsFromChildrenFunction = useMemo(() => {
    if (typeof children == "function" && !React.isValidElement(children)) {
      return extensionsToRender.map((extension) => children(extension));
    }
  }, [children, extensionsToRender]);

  return (
    <div
      ref={slotRef}
      data-extension-slot-name={name}
      data-extension-slot-module-name={extensionSlotModuleName}
      style={{ ...style, position: "relative" }}
      {...divProps}
    >
      {name &&
        extensionsToRender.map((extension, i) => (
          <ComponentContext.Provider
            key={extension.id}
            value={{
              moduleName: extensionSlotModuleName, // moduleName is not used by the receiving Extension
              extension: {
                extensionId: extension.id,
                extensionSlotName: name,
                extensionSlotModuleName,
              },
            }}
          >
            {extensionsFromChildrenFunction?.[i] ??
              (typeof children != "function" ? children : null) ?? (
                <Extension state={state} />
              )}
          </ComponentContext.Provider>
        ))}
    </div>
  );
}
