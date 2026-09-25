/** @module @category Extension */
import { useContext } from 'react';
import { ComponentContext } from './ComponentContext';

/**
 * A hook for a component rendered as an extension to access its extension context: the slot and
 * slot module it is rendered in, its extension ID, and its `meta` from the extension's registration.
 *
 * @returns The extension context, or `undefined` when the calling component is not being rendered
 *   as an extension (a page, modal or workspace, say).
 */
export function useExtensionContext() {
  return useContext(ComponentContext).extension;
}
