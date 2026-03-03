/** @module @category UI */
import React from 'react';
import { TableBatchActions as CarbonTableBatchActions, type TableBatchActionsProps } from '@carbon/react';
import { type CoreTranslationKey, getCoreTranslation } from '@openmrs/esm-translations';

// Maps Carbon's internal translateWithId keys to OpenMRS core translation keys
const carbonToCoreTranslationMap: Record<string, CoreTranslationKey> = {
  'carbon.table.batch.cancel': 'cancel',
  'carbon.table.batch.items.selected': 'batchActionsItemsSelected',
  'carbon.table.batch.item.selected': 'batchActionItemSelected',
  'carbon.table.batch.selectAll': 'selectAll',
};

/*
 * A wrapper around Carbon's `TableBatchActions` component that provides
 * OpenMRS core translations by default. The `translateWithId` prop is
 * pre-wired so that batch action strings are automatically translated.
 */
export const TableBatchActions: React.FC<TableBatchActionsProps> = (props) => {
  return (
    <CarbonTableBatchActions
      translateWithId={(id, state) => {
        const key = carbonToCoreTranslationMap[id];
        return key ? getCoreTranslation(key, id, state as Record<string, unknown>) : id;
      }}
      {...props}
    />
  );
};
