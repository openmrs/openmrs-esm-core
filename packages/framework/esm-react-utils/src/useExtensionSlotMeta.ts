/** @module @category Extension */
import type { ExtensionMeta } from '@openmrs/esm-extensions';
import { useMemo } from 'react';
import { useAssignedExtensions } from './useAssignedExtensions';

/**
 * Extract meta data from all extension for a given extension slot.
 * @param extensionSlotName
 */
export function useExtensionSlotMeta<T = ExtensionMeta>(extensionSlotName: string) {
  const extensions = useAssignedExtensions(extensionSlotName);

  return useMemo(() => Object.fromEntries(extensions.map((ext) => [ext.name, ext.meta as T])), [extensions]);
}
