import React, { useRef, useMemo } from "react";
import { ExtensionRegistration } from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";
import { Extension } from "./Extension";
import { useExtensionSlot } from "./useExtensionSlot";

function defaultSelect(extensions: Array<ExtensionRegistration>) {
  return extensions;
}

export interface ExtensionSlotBaseProps {
  extensionSlotName: string;
  select?(
    extensions: Array<ExtensionRegistration>
  ): Array<ExtensionRegistration>;
  state?: Record<string, any>;
}

export type ExtensionSlotProps = ExtensionSlotBaseProps &
  React.HTMLAttributes<HTMLDivElement>;

export const ExtensionSlot: React.FC<ExtensionSlotProps> = ({
  extensionSlotName,
  select = defaultSelect,
  children,
  state,
  style,
  ...divProps
}: ExtensionSlotProps) => {
  const slotRef = useRef(null);
  const { extensions, extensionSlotModuleName } = useExtensionSlot(
    extensionSlotName
  );
  const content = useMemo(
    () =>
      extensionSlotName &&
      select(extensions).map((extension) => (
        <ComponentContext.Provider
          key={extension.name}
          value={{
            moduleName: extension.moduleName,
            extension: {
              extensionId: extension.name,
              extensionSlotName,
              extensionSlotModuleName,
            },
          }}
        >
          {children ?? <Extension state={state} />}
        </ComponentContext.Provider>
      )),
    [select, extensions, extensionSlotName]
  );

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
