/** @module @category Extension */
import { type ConnectedExtension } from '@openmrs/esm-extensions';
import { useAssignedExtensions } from './useAssignedExtensions';

/**
 * Gets the assigned extension for a given extension slot name.
 * @param slotName The name of the slot to get the assigned extensions for.
 * @deprecated Use useAssignedExtensions instead
 */
export const useConnectedExtensions = useAssignedExtensions as (slotName: string) => Array<ConnectedExtension>;
