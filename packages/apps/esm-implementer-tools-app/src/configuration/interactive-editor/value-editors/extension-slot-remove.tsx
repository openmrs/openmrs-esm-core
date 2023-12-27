import React from 'react';
import { FilterableMultiSelect } from '@carbon/react';
import { useAssignedExtensions } from '@openmrs/esm-framework';

export function ExtensionSlotRemove({ slotName, slotModuleName, value, setValue }) {
  const assignedIds = useAssignedExtensions(slotName).map((e) => e.id);

  return (
    <FilterableMultiSelect
      id={`add-select`}
      items={assignedIds.map((id) => ({ id, label: id }))}
      placeholder="Select extensions"
      onChange={(value) => setValue(value.selectedItems.map((v) => v.id))}
      initialSelectedItems={value}
      itemToString={(item) => (item ? item?.label : '')}
    />
  );
}
