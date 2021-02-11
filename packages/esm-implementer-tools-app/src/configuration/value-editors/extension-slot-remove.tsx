import React, { useState, useEffect } from "react";
import MultiSelect from "carbon-components-react/es/components/MultiSelect";
import { ExtensionStore, extensionStore } from "@openmrs/esm-extensions";

export function ExtensionSlotRemove({
  slotName,
  slotModuleName,
  value,
  setValue,
}) {
  const [attachedExtensions, setAttachedExtensions] = useState<Array<string>>(
    []
  );

  useEffect(() => {
    function update(state: ExtensionStore) {
      setAttachedExtensions(
        state.slots[slotName].instances[slotModuleName].assignedIds
      );
    }
    update(extensionStore.getState());
    return extensionStore.subscribe(update);
  }, []);

  return (
    <MultiSelect.Filterable
      id={`add-select`}
      items={attachedExtensions.map((name) => ({ id: name, label: name }))}
      placeholder="Select extensions"
      onChange={(value) => setValue(value.selectedItems.map((v) => v.id))}
      initialSelectedItems={value}
    />
  );
}
