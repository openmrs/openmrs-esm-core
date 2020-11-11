import React, { useState, useContext, ReactNode, useEffect } from "react";
import { ModuleNameContext, ExtensionContext } from "@openmrs/esm-context";
import {
  renderExtension,
  getIsUIEditorEnabled,
  getExtensionRegistration,
  registerExtensionSlot,
  unregisterExtensionSlot,
  extensionStore,
  ExtensionStore,
} from "./extensions";
import { connect, Provider } from "unistore/react";

interface ExtensionSlotBaseProps {
  extensionSlotName: string;
  children?: ReactNode;
  style?: React.CSSProperties;
  state?: Record<string, any>;
}

// remainder of props are for the top-level <div>
export type ExtensionSlotReactProps<T = {}> = ExtensionSlotBaseProps & T;

export const ExtensionSlotReact: React.FC<ExtensionSlotReactProps> = (
  props: ExtensionSlotReactProps
) => {
  return (
    <Provider store={extensionStore}>
      <ConnectedExtensionSlot {...props} />
    </Provider>
  );
};

const ConnectedExtensionSlot = connect(["slots", "extensions"])(
  ({
    extensionSlotName,
    children,
    style,
    state,
    slots,
    extensions,
    ...divProps
  }: ExtensionStore & ExtensionSlotReactProps) => {
    const slotModuleName = useContext(ModuleNameContext);
    const matchingExtensionSlot = Object.values(slots).find((x) =>
      x.canRenderInto(extensionSlotName)
    );
    const extensionIdsToRender = matchingExtensionSlot?.assignedIds ?? [];

    if (!slotModuleName) {
      throw Error(
        "ModuleNameContext has not been provided. This should come from openmrs-react-root-decorator"
      );
    }

    useEffect(() => {
      registerExtensionSlot(slotModuleName, extensionSlotName);
      return () => unregisterExtensionSlot(slotModuleName, extensionSlotName);
    }, []);

    const divStyle = getIsUIEditorEnabled()
      ? { ...style, backgroundColor: "cyan" }
      : style;

    return (
      <Provider store={extensionStore.}>
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
      </Provider>
    );
  }
);

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
