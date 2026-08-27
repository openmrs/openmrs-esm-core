/** @module @category Extension */
import { useMemo } from 'react';
import { sessionStore, type SessionStore } from '@openmrs/esm-api';
import { type ExtensionSlotCustomState, filterExtensionsByDisplayConditions } from '@openmrs/esm-extensions';
import { useShallowStableValue } from './useShallowStableValue';
import { useExtensionSlotStore } from './useExtensionSlotStore';
import { useStore } from './useStore';

const selectSession = (state: SessionStore) => state.session;

/**
 * Gets the assigned extensions for a given extension slot name.
 *
 * Pass `state` whenever the extensions are being displayed. The same slot can be rendered in
 * several places at once with different state, so display conditions are evaluated against the
 * state of this rendering; without it, extensions a condition would hide are included.
 *
 * The returned array is a copy, so sorting or filtering it in place can't corrupt the extension
 * store. Its reference is stable for as long as the slot, the state and the session are.
 *
 * @param slotName The name of the slot to get the assigned extensions for.
 * @param state The state of this rendering of the slot.
 */
export function useAssignedExtensions(slotName: string, state?: ExtensionSlotCustomState) {
  const { assignedExtensions } = useExtensionSlotStore(slotName);
  // Display conditions may refer to `session`, so they have to be re-evaluated when it changes.
  const session = useStore(sessionStore, selectSession);
  const stableState = useShallowStableValue(state);

  return useMemo(
    () => filterExtensionsByDisplayConditions(assignedExtensions, stableState, session),
    [assignedExtensions, stableState, session],
  );
}
