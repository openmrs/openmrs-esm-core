import React from "react";
import MultiSelect from "carbon-components-react/es/components/MultiSelect";
import {
  ExtensionStore,
  getAssignedIds,
  useExtensionStore,
} from "@openmrs/esm-framework";

function getExtensionIds(
  store: ExtensionStore,
  moduleName: string,
  slotName: string
) {
  const slot = store.slots[slotName];
  const instance = slot.instances[moduleName];
  return getAssignedIds(instance, slot.attachedIds);
}

export function ExtensionSlotRemove({
  slotName,
  slotModuleName,
  value,
  setValue,
}) {
  const store = useExtensionStore();
  const assignedIds = getExtensionIds(store, slotModuleName, slotName);

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
