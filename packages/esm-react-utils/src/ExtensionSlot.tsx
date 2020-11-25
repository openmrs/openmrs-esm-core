import React, { useContext, ReactNode, useEffect, useState } from "react";
import {
  getIsUIEditorEnabled,
  getExtensionRegistration,
  registerExtensionSlot,
  unregisterExtensionSlot,
  ExtensionSlotDefinition,
  extensionStore,
  ExtensionStore,
} from "@openmrs/esm-extensions";
import { ExtensionContext } from "./ExtensionContext";
import { ModuleNameContext } from "./ModuleNameContext";
import { Extension } from "./Extension";

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
  extensionSlotName,
  children,
  state,
  style,
  className,
  ...divProps
}: ExtensionSlotProps) => {
  const slotModuleName = useContext(ModuleNameContext);
  if (!slotModuleName) {
    throw Error(
      "ModuleNameContext has not been provided. This should come from openmrs-react-root-decorator"
    );
  }

  const [matchingExtensionSlot, setMatchingExtensionSlot] = useState<
    ExtensionSlotDefinition | undefined
  >(undefined);

  const extensionIdsToRender = matchingExtensionSlot?.assignedIds ?? [];

  useEffect(() => {
    const update = (state: ExtensionStore) => {
      const matchingExtensionSlot = Object.values(state.slots).find((slotDef) =>
        slotDef.canRenderInto(extensionSlotName)
      );
      setMatchingExtensionSlot(matchingExtensionSlot);
    };
    update(extensionStore.getState());
    return extensionStore.subscribe((state) => update(state));
  }, []);

  useEffect(() => {
    registerExtensionSlot(slotModuleName, extensionSlotName);
    return () => unregisterExtensionSlot(slotModuleName, extensionSlotName);
  }, []);

  const divStyle = getIsUIEditorEnabled()
    ? { ...style, backgroundColor: "cyan" }
    : style;

  return (
    <div style={divStyle} {...divProps}>
      {extensionIdsToRender.map((extensionId) => {
        const extensionRegistration = getExtensionRegistration(extensionId);
        return (
          matchingExtensionSlot &&
          extensionRegistration && (
            <ExtensionContext.Provider
              key={extensionId}
              value={{
                actualExtensionSlotName: extensionSlotName,
                attachedExtensionSlotName: matchingExtensionSlot.name,
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
