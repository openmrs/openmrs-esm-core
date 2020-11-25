import React, { useContext, ReactNode, useEffect, useState } from "react";
import { ModuleNameContext, ExtensionContext } from "@openmrs/esm-context";
import {
  renderExtension,
  getIsUIEditorEnabled,
  getExtensionRegistration,
  registerExtensionSlot,
  unregisterExtensionSlot,
  ExtensionSlotDefinition,
  extensionStore,
  ExtensionStore,
} from "./extensions";

interface ExtensionSlotBaseProps {
  extensionSlotName: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  state?: Record<string, any>;
  className?: string;
}

// remainder of props are for the top-level <div>
export type ExtensionSlotReactProps<T = {}> = ExtensionSlotBaseProps & T;

export const ExtensionSlotReact: React.FC<ExtensionSlotReactProps> = ({
  extensionSlotName,
  children,
  state,
  style,
  className,
  ...divProps
}: ExtensionSlotReactProps) => {
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
              {children ?? <ExtensionReact state={state} />}
            </ExtensionContext.Provider>
          )
        );
      })}
    </div>
  );
};

export interface ExtensionReactProps {
  state?: Record<string, any>;
}

export const ExtensionReact: React.FC<ExtensionReactProps> = ({ state }) => {
  const ref = React.useRef<HTMLSlotElement>(null);
  const {
    actualExtensionSlotName,
    attachedExtensionSlotName,
    extensionId,
  } = useContext(ExtensionContext);
  // TODO: handle error if Extension not wrapped in ExtensionSlot

  React.useEffect(() => {
    if (ref.current) {
      return renderExtension(
        ref.current,
        actualExtensionSlotName,
        attachedExtensionSlotName,
        extensionId,
        undefined,
        state
      );
    }
  }, [actualExtensionSlotName, attachedExtensionSlotName, extensionId]);

  return getIsUIEditorEnabled() ? (
    <div style={{ outline: "0.125rem solid yellow" }}>
      <slot ref={ref} />
    </div>
  ) : (
    <slot ref={ref} />
  );
};
