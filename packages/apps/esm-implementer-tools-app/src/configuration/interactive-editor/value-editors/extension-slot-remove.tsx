import React from 'react';
import { FilterableMultiSelect } from '@carbon/react';
import { useAssignedExtensions } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

export function ExtensionSlotRemove({ slotName, slotModuleName, value, setValue }) {
  const { t } = useTranslation();
  const assignedExtensions = useAssignedExtensions(slotName);
  const assignedExtensionIds = assignedExtensions.map((extension) => extension.id);

  if (!assignedExtensions || assignedExtensions.length === 0) {
    return <p>{t('noExtensionsToRemoveText', 'No extensions available to remove.')}</p>;
  }

  return (
    <FilterableMultiSelect
      id={`add-select`}
      items={assignedExtensionIds.map((id) => ({ id, label: id }))}
      placeholder="Select extensions"
      onChange={(value) => setValue(value.selectedItems.map((v) => v.id))}
      initialSelectedItems={value}
      itemToString={(item) => (item ? item?.label : '')}
    />
  );
}
