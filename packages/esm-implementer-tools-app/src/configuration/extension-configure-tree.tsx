import { ExtensionSlotConfigureValueObject } from "@openmrs/esm-config";
import React from "react";
import EditableValue from "./editable-value.component";

export interface ExtensionConfigureTreeProps {
  moduleName: string;
  slotName: string;
  config?: ExtensionSlotConfigureValueObject;
}

export function ExtensionConfigureTree({
  moduleName,
  slotName,
  config,
}: ExtensionConfigureTreeProps) {
  return (
    <EditableValue
      path={[moduleName, slotName, "configure"]}
      element={{ _value: config ?? {}, _source: "", _default: {} }}
    />
  );
}
