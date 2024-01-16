import React, { useState, useEffect } from 'react';
import { FilterableMultiSelect } from '@carbon/react';
import type { ExtensionInternalStore } from '@openmrs/esm-framework/src/internal';
import { getExtensionInternalStore } from '@openmrs/esm-framework/src/internal';

const extensionInternalStore = getExtensionInternalStore();

export function ExtensionSlotAdd({ value, setValue }) {
  const [availableExtensions, setAvailableExtensions] = useState<Array<string>>([]);

  useEffect(() => {
    function update(state: ExtensionInternalStore) {
      setAvailableExtensions(Object.keys(state.extensions));
    }
    update(extensionInternalStore.getState());
    return extensionInternalStore.subscribe(update);
  }, []);

  return (
    <FilterableMultiSelect
      id={`add-select`}
      items={availableExtensions.map((name) => ({ id: name, label: name }))}
      placeholder="Select extensions"
      onChange={(value) => setValue(value.selectedItems.map((v) => v.id))}
      initialSelectedItems={value}
    />
  );
}
