import React, { ReactNode } from "react";
import {
  getIsUIEditorEnabled,
  getExtensionRegistration,
} from "@openmrs/esm-extensions";
import { ExtensionContext } from "./ExtensionContext";
import { Extension } from "./Extension";
import { useExtensionSlot } from "./useExtensionSlot";

export interface ExtensionSlotBaseProps {
  extensionSlotName: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  state?: Record<string, any>;
  className?: string;
}

// remainder of props are for the top-level <div>
export type ExtensionSlotProps<T = {}> = ExtensionSlotBaseProps & T;

export const ExtensionSlot: React.FC<ExtensionSlotProps> = ({
  extensionSlotName: actualExtensionSlotName,
  children,
  state,
  style,
  className,
  ...divProps
}: ExtensionSlotProps) => {
  const {
    attachedExtensionSlotName,
    extensionIdsToRender,
    extensionSlotModuleName,
  } = useExtensionSlot(actualExtensionSlotName);

  const divStyle = getIsUIEditorEnabled()
    ? { ...style, backgroundColor: "cyan" }
    : style;

  return (
    <div style={divStyle} {...divProps}>
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
