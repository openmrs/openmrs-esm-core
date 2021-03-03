import React from "react";
import MultiSelect from "carbon-components-react/es/components/MultiSelect";
import { useStore } from "@openmrs/esm-framework";
import { implementerToolsStore } from "../../store";

export function ExtensionSlotRemove({
  slotName,
  slotModuleName,
  value,
  setValue,
}) {
  const { extensionIdBySlotByModule } = useStore(implementerToolsStore);

  return (
    <MultiSelect.Filterable
      id={`add-select`}
      items={extensionIdBySlotByModule[slotModuleName][
        slotName
      ].map((name) => ({ id: name, label: name }))}
      placeholder="Select extensions"
      onChange={(value) => setValue(value.selectedItems.map((v) => v.id))}
      initialSelectedItems={value}
    />
  );
}
