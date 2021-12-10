import React from "react";
import { MultiSelect } from "carbon-components-react";
import { useAssignedExtensionIds } from "@openmrs/esm-framework";

export function ExtensionSlotRemove({
  slotName,
  slotModuleName,
  value,
  setValue,
}) {
  const assignedIds = useAssignedExtensionIds(slotName);

  return (
    <MultiSelect.Filterable
      id={`add-select`}
      items={assignedIds.map((id) => ({ id, label: id }))}
      placeholder="Select extensions"
      onChange={(value) => setValue(value.selectedItems.map((v) => v.id))}
      initialSelectedItems={value}
    />
  );
}
