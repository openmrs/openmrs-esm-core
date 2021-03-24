import React, { useRef } from "react";
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
  extensionSlotName: actualExtensionSlotName,
  select = defaultSelect,
  children,
  state,
  style,
  ...divProps
}: ExtensionSlotProps) => {
  const slotRef = useRef(null);
  const {
    attachedExtensionSlotName,
    extensionIdsToRender,
    extensionSlotModuleName,
  } = useExtensionSlot(actualExtensionSlotName, slotRef);
  const extensions = select(
    extensionIdsToRender.map(getExtensionRegistration).filter(isValidExtension)
  );

  return (
    <div ref={slotRef} style={{ ...style, position: "relative" }} {...divProps}>
      {attachedExtensionSlotName &&
        extensions.map((extensionRegistration) => (
          <ComponentContext.Provider
            key={extensionRegistration.name}
            value={{
              moduleName: extensionRegistration.moduleName,
              extension: {
                actualExtensionSlotName,
                attachedExtensionSlotName,
                extensionSlotModuleName,
                extensionId: extensionRegistration.name,
              },
            }}
          >
            {children ?? <Extension state={state} />}
          </ComponentContext.Provider>
        ))}
    </div>
  );
};
