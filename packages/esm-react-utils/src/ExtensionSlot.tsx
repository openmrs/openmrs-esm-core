import React, { CSSProperties, ReactNode, useRef } from "react";
import { getExtensionRegistration } from "@openmrs/esm-extensions";
import { ExtensionContext } from "./ExtensionContext";
import { Extension } from "./Extension";
import { useExtensionSlot } from "./useExtensionSlot";

export interface ExtensionSlotBaseProps {
  extensionSlotName: string;
  children?: ReactNode;
  state?: Record<string, any>;
  style?: CSSProperties;
}

// remainder of props are for the top-level <div>
export type ExtensionSlotProps<T = {}> = ExtensionSlotBaseProps & T;

export const ExtensionSlot: React.FC<ExtensionSlotProps> = ({
  extensionSlotName: actualExtensionSlotName,
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

  return (
    <div ref={slotRef} style={{ ...style, position: "relative" }} {...divProps}>
      {extensionIdsToRender.map((extensionId) => {
        const extensionRegistration = getExtensionRegistration(extensionId);

        return (
          attachedExtensionSlotName &&
          extensionRegistration && (
            <ExtensionContext.Provider
              key={extensionId}
              value={{
                actualExtensionSlotName,
                attachedExtensionSlotName,
                extensionSlotModuleName,
                extensionId,
                extensionModuleName: extensionRegistration.moduleName,
              }}
            >
              {children ?? <Extension state={state} />}
            </ExtensionContext.Provider>
          )
        );
      })}
    </div>
  );
};
