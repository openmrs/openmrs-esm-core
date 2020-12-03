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
  state?: Record<string, any>;
  className?: string;
}

const slotStyle = {
  backgroundColor: "rgba(43, 43, 185, 0.1)",
  position: "relative",
  border: "1px solid rgba(43, 43, 185, 0.4)",
  margin: "-1px", // accomodates the border
};

const slotNameStyle = {
  backgroundColor: "rgb(255 255 255 / 71%)",
  border: "1px solid rgba(43, 43, 185, 0.4)",
  color: "#393939",
  position: "absolute",
  bottom: "-1px",
  right: "-1px",
  padding: "0.5em 0.5em 0.5em 0.5em",
};

// remainder of props are for the top-level <div>
export type ExtensionSlotProps<T = {}> = ExtensionSlotBaseProps & T;

export const ExtensionSlot: React.FC<ExtensionSlotProps> = ({
  extensionSlotName: actualExtensionSlotName,
  children,
  state,
  className,
  ...divProps
}: ExtensionSlotProps) => {
  const {
    attachedExtensionSlotName,
    extensionIdsToRender,
    extensionSlotModuleName,
  } = useExtensionSlot(actualExtensionSlotName);

  return (
    <div
      className={className}
      style={getIsUIEditorEnabled() ? (slotStyle as React.CSSProperties) : {}}
      {...divProps}
    >
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
      {getIsUIEditorEnabled() && (
        <div style={slotNameStyle as React.CSSProperties}>
          slot "{attachedExtensionSlotName}"
        </div>
      )}
    </div>
  );
};
