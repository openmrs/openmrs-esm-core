import React from "react";
import { useStore } from "@openmrs/esm-framework";
import { implementerToolsStore } from "../../store";

export function ExtensionSlotOrder({
  slotName,
  slotModuleName,
  value,
  setValue,
}) {
  const { extensionIdBySlotByModule } = useStore(implementerToolsStore);

  return <div>Todo: compose array with extension lookup</div>;
}
