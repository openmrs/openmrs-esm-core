import React, { useState, useEffect } from "react";
import { ExtensionStore, extensionStore } from "@openmrs/esm-extensions";

export function ExtensionSlotOrder({
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

  return <div>Todo: compose array with extension lookup</div>;
}
