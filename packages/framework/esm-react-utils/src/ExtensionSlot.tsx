import React, { useRef, useMemo } from "react";
import { ConnectedExtension } from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";
import { Extension } from "./Extension";
import { useExtensionSlot } from "./useExtensionSlot";

function isShallowEqual(prevDeps: any, nextDeps: any) {
  if (prevDeps === nextDeps) {
    return true;
  }

  if (!prevDeps && nextDeps) {
    return false;
  }

  if (prevDeps && !nextDeps) {
    return false;
  }

  if (typeof prevDeps !== "object" || typeof nextDeps !== "object") {
    return false;
  }

  const prev = Object.keys(prevDeps);
  const next = Object.keys(nextDeps);

  if (prev.length !== next.length) {
    return false;
  }

  for (let i = 0; i < prev.length; i++) {
    const key = prev[i];

    if (!(key in nextDeps) || nextDeps[key] !== prevDeps[key]) {
      return false;
    }
  }

  return true;
}

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
  React.HTMLAttributes<HTMLDivElement>;

function defaultSelect(extensions: Array<ConnectedExtension>) {
  return extensions;
}

export const ExtensionSlot: React.FC<ExtensionSlotProps> = ({
  name: goodName,
  extensionSlotName,
  select = defaultSelect,
  children,
  state,
  style,
  ...divProps
}: ExtensionSlotProps) => {
  const name = (goodName ?? extensionSlotName) as string;
  const slotRef = useRef(null);
  const { extensions, extensionSlotModuleName } = useExtensionSlot(name);
  const stateRef = useRef(state);

  if (!isShallowEqual(stateRef.current, state)) {
    stateRef.current = state;
  }

  const content = useMemo(
    () =>
      name &&
      select(extensions).map((extension) => (
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
          {children ?? <Extension state={stateRef.current} />}
        </ComponentContext.Provider>
      )),
    [select, extensions, name, stateRef.current]
  );

  return (
    <div
      ref={slotRef}
      data-extension-slot-name={name}
      data-extension-slot-module-name={extensionSlotModuleName}
      style={{ ...style, position: "relative" }}
      {...divProps}
    >
      {content}
    </div>
  );
};
