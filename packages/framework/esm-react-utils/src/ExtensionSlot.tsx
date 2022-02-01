import React, { useRef, useMemo } from "react";
import { ConnectedExtension } from "./useConnectedExtensions";
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
  extensionSlotName: string;
  select?: (extensions: Array<ConnectedExtension>) => Array<ConnectedExtension>;
  state?: Record<string, any>;
}

export type ExtensionSlotProps = ExtensionSlotBaseProps &
  React.HTMLAttributes<HTMLDivElement>;

function defaultSelect(extensions: Array<ConnectedExtension>) {
  return extensions;
}

export const ExtensionSlot: React.FC<ExtensionSlotProps> = ({
  extensionSlotName,
  select = defaultSelect,
  children,
  state,
  style,
  ...divProps
}: ExtensionSlotProps) => {
  const slotRef = useRef(null);
  const { extensions, extensionSlotModuleName } =
    useExtensionSlot(extensionSlotName);
  const stateRef = useRef(state);

  if (!isShallowEqual(stateRef.current, state)) {
    stateRef.current = state;
  }

  const content = useMemo(() => {
    console.log("creating new Context and Extension instance");
    return (
      extensionSlotName &&
      select(extensions).map((extension) => (
        <ComponentContext.Provider
          key={extension.id}
          value={{
            moduleName: extension.moduleName,
            extension: {
              extensionId: extension.id,
              extensionSlotName,
              extensionSlotModuleName,
            },
          }}
        >
          {children ?? <Extension state={stateRef.current} />}
        </ComponentContext.Provider>
      ))
    );
  }, [select, extensions, extensionSlotName]);

  return (
    <div
      ref={slotRef}
      data-extension-slot-name={extensionSlotName}
      data-extension-slot-module-name={extensionSlotModuleName}
      style={{ ...style, position: "relative" }}
      {...divProps}
    >
      {content}
    </div>
  );
};
