import React, { useRef, useMemo } from "react";
import {
  ExtensionRegistration,
  getExtensionRegistration,
} from "@openmrs/esm-extensions";
import { ComponentContext } from "./ComponentContext";
import { Extension } from "./Extension";
import { useExtensionSlot } from "./useExtensionSlot";

function defaultSelect(extensions: Array<ExtensionRegistration>) {
  return extensions;
}

function isValidExtension(
  extension: ExtensionRegistration | undefined
): extension is ExtensionRegistration {
  return extension !== undefined;
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
  const { extensionIdsToRender, extensionSlotModuleName } = useExtensionSlot(
    extensionSlotName
  );
  const extensions = useMemo(
    () =>
      extensionSlotName &&
      select(
        extensionIdsToRender
          .map(getExtensionRegistration)
          .filter(isValidExtension)
      ).map((extensionRegistration) => (
        <ComponentContext.Provider
          key={extensionRegistration.name}
          value={{
            moduleName: extensionRegistration.moduleName,
            extension: {
              extensionSlotName,
              extensionSlotModuleName,
              extensionId: extensionRegistration.name,
            },
          }}
        >
          {children ?? <Extension state={state} />}
        </ComponentContext.Provider>
      )),
    [select, extensionIdsToRender, extensionSlotName]
  );

  return (
    <div
      ref={slotRef}
      data-extension-slot-name={extensionSlotName}
      data-extension-slot-module-name={extensionSlotModuleName}
      style={{ ...style, position: "relative" }}
      {...divProps}
    >
      {extensions}
    </div>
  );
};
