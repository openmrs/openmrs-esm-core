import React, { useState, useContext, ReactNode } from "react";
import { ModuleNameContext } from "@openmrs/esm-config";
import {
  renderExtension,
  getExtensionNamesForExtensionSlot,
  getIsUIEditorEnabled,
} from "./extensions";

export interface ExtensionSlotReactProps {
  extensionSlotName: string;
  children?: ReactNode;
}

interface ExtensionContextData {
  extensionSlotName: string;
  extensionName: string;
}

const ExtensionContext = React.createContext<ExtensionContextData>({
  extensionSlotName: "",
  extensionName: "",
});

export const ExtensionSlotReact: React.FC<ExtensionSlotReactProps> = ({
  extensionSlotName,
  children,
}: ExtensionSlotReactProps) => {
  const [extensionNames, setExtensionNames] = useState<Array<string>>([]);
  const moduleName = useContext(ModuleNameContext);

  if (!moduleName) {
    throw Error(
      "ModuleNameContext has not been provided. This should come from openmrs-react-root-decorator"
    );
  }

  React.useEffect(() => {
    getExtensionNamesForExtensionSlot(
      extensionSlotName,
      moduleName
    ).then((names) => setExtensionNames(names));
  }, [extensionSlotName, moduleName]);

  return (
    <div style={{ backgroundColor: getIsUIEditorEnabled() ? "cyan" : "" }}>
      {extensionNames.map((extensionName) => (
        <ExtensionContext.Provider
          key={extensionName}
          value={{
            extensionSlotName,
            extensionName,
          }}
        >
          {children ?? <ExtensionReact />}
        </ExtensionContext.Provider>
      ))}
    </div>
  );
};

export const ExtensionReact: React.FC = (props) => {
  const ref = React.useRef<HTMLSlotElement>(null);
  const { extensionSlotName, extensionName } = useContext(ExtensionContext);
  // TODO: handle error if Extension not wrapped in ExtensionSlot

  React.useEffect(() => {
    if (ref.current) {
      return renderExtension(ref.current, extensionSlotName, extensionName);
    }
  }, [extensionSlotName, extensionName]);

  return getIsUIEditorEnabled() ? (
    <div style={{ outline: "0.125rem solid yellow" }}>
      <slot ref={ref} />
    </div>
  ) : (
    <slot ref={ref} />
  );
};
