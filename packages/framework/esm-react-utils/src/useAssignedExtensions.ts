/** @module @category Extension */
import { useMemo } from 'react';
import { sessionStore, type SessionStore } from '@openmrs/esm-api';
import { type ExtensionSlotCustomState, getAssignedExtensions } from '@openmrs/esm-extensions';
import { useShallowStableValue } from './useShallowStableValue';
import { useExtensionSlotStore } from './useExtensionSlotStore';
import { useStore } from './useStore';

const selectSession = (state: SessionStore) => state.session;

/**
 * Gets the assigned extensions for a given extension slot name.
 *
 * The reactive form of `getAssignedExtensions`, and it answers the same thing: display conditions
 * are always applied, so the result is what should actually be displayed. Pass `state` whenever you
 * know it: the same slot can be rendered in several places at once with different state, so
 * conditions are resolved against the state of this rendering. Omitting it resolves them against
 * the session alone, hiding any extension whose condition depends on state.
 *
 * The returned array is a copy, so sorting or filtering it in place can't corrupt the extension
 * store. Its reference is stable for as long as the slot's extensions, the state and the session are.
 *
 * @param slotName The name of the slot to get the assigned extensions for.
 * @param state The state of this rendering of the slot.
 */
export function useAssignedExtensions(slotName: string, state?: ExtensionSlotCustomState) {
  // Subscribes so that this re-runs when the slot's extensions change; `getAssignedExtensions` reads
  // the same store, so the value below is what it is about to return.
  const { candidateExtensions } = useExtensionSlotStore(slotName);
  // Display conditions may refer to `session`, so they have to be re-evaluated when it changes.
  const session = useStore(sessionStore, selectSession);
  const stableState = useShallowStableValue(state);

  return useMemo(
    () => getAssignedExtensions(slotName, stableState),
    [slotName, stableState, session, candidateExtensions],
  );
}
