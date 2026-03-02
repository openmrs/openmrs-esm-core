/** @module @category UI */
import React from 'react';
import { TableBatchActions as CarbonTableBatchActions, type TableBatchActionsProps } from '@carbon/react';
import { carbonTranslateWithId } from '@openmrs/esm-translations';

/*
 * A wrapper around Carbon's TableBatchActions component that provides
 * OpenMRS core translations by default. The `translateWithId` prop is
 * pre-wired so that batch action strings are automatically translated.
 */
export const TableBatchActions: React.FC<TableBatchActionsProps> = (props) => {
  return <CarbonTableBatchActions translateWithId={carbonTranslateWithId} {...props} />;
};
