/** @module @category Extension */
import { useExtensionSlotStore } from './useExtensionSlotStore';

/**
 * The reactive form of `getCandidateExtensions`: everything assigned to a slot, with no display
 * condition evaluated. Intended for tools that present a slot's configuration rather than render it.
 *
 * Use {@link useAssignedExtensions} to decide what to display.
 *
 * @param slotName The name of the slot to get the candidate extensions for.
 * @internal
 */
export function useCandidateExtensions(slotName: string) {
  return useExtensionSlotStore(slotName).candidateExtensions;
}
