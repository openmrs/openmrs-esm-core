import React, { useState, useContext, ReactNode, useEffect } from "react";
import { ModuleNameContext, ExtensionContext } from "@openmrs/esm-context";
import {
  renderExtension,
  getExtensionIdsForExtensionSlot,
  getIsUIEditorEnabled,
  getExtensionRegistration,
  registerExtensionSlot,
  unregisterExtensionSlot,
} from "./extensions";

interface ExtensionSlotBaseProps {
  extensionSlotName: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}

// remainder of props are for the top-level <div>
export type ExtensionSlotReactProps<T = {}> = ExtensionSlotBaseProps & T;

export const ExtensionSlotReact: React.FC<ExtensionSlotReactProps> = ({
  extensionSlotName,
  children,
  style,
  ...divProps
}: ExtensionSlotReactProps) => {
  const [extensionIds, setExtensionIds] = useState<Array<string>>([]);
  const slotModuleName = useContext(ModuleNameContext);

  if (!slotModuleName) {
    throw Error(
      "ModuleNameContext has not been provided. This should come from openmrs-react-root-decorator"
    );
  }

  useEffect(() => {
    getExtensionIdsForExtensionSlot(
      extensionSlotName,
      slotModuleName
    ).then((ids) => setExtensionIds(ids));
  }, [extensionSlotName, slotModuleName]);

  useEffect(() => {
    registerExtensionSlot(slotModuleName, extensionSlotName);
    return () => unregisterExtensionSlot(slotModuleName, extensionSlotName);
  }, []);

  const divStyle = getIsUIEditorEnabled()
    ? { ...style, backgroundColor: "cyan" }
    : style;

  return (
    <div style={divStyle} {...divProps}>
      {extensionIds.map((extensionId) => {
        const extensionRegistration = getExtensionRegistration(extensionId);
        return (
          <ExtensionContext.Provider
            key={extensionId}
            value={{
              extensionSlotName,
              extensionId,
              extensionModuleName: extensionRegistration.moduleName,
            }}
          >
            {children ?? <ExtensionReact />}
          </ExtensionContext.Provider>
        );
      })}
    </div>
  );
};

export const ExtensionReact: React.FC = (props) => {
  const ref = React.useRef<HTMLSlotElement>(null);
  const { extensionSlotName, extensionId } = useContext(ExtensionContext);
  // TODO: handle error if Extension not wrapped in ExtensionSlot

  React.useEffect(() => {
    if (ref.current) {
      return renderExtension(ref.current, extensionSlotName, extensionId);
    }
  }, [extensionSlotName, extensionId]);

  return getIsUIEditorEnabled() ? (
    <div style={{ outline: "0.125rem solid yellow" }}>
      <slot ref={ref} />
    </div>
  ) : (
    <slot ref={ref} />
  );
};
