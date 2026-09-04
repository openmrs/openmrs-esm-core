import { useEffect, useId } from 'react';
import { getVisitStore, type Visit, type VisitStoreState } from '@openmrs/esm-emr-api';
import { type Actions, useStoreWithActions } from './useStore';

/**
 * The mutate callbacks to invoke when visit data changes, keyed by the `useId()` of the
 * component that registered each one.
 */
const mutateVisitCallbacks = new Map<string, () => void>();

/**
 * Invokes every registered mutate callback, revalidating visit data across the application.
 *
 * Iterates over a copy so that a callback which registers or unregisters another does not
 * disturb the traversal.
 */
function mutateVisit() {
  for (const mutateCallback of Array.from(mutateVisitCallbacks.values())) {
    mutateCallback();
  }
}

const visitContextStoreActions = {
  setVisitContext(_: VisitStoreState, newSelectedVisit: Visit | null) {
    if (newSelectedVisit == null) {
      return { manuallySetVisitUuid: null };
    }
    return {
      manuallySetVisitUuid: newSelectedVisit.uuid,
      patientUuid: newSelectedVisit.patient?.uuid,
    };
  },
} satisfies Actions<VisitStoreState>;

/**
 * A hook to return the visit context store and corresponding actions.
 *
 * @param mutateVisitCallback An optional mutate callback to register. If provided, the
 * returned `mutateVisit` function will invoke this callback (along with any other
 * callbacks registered by other components). Pass a callback with a stable identity;
 * one that changes on every render re-registers on every render.
 * @returns
 */
export function useVisitContextStore(mutateVisitCallback?: () => void) {
  const id = useId();

  useEffect(() => {
    if (!mutateVisitCallback) {
      return;
    }

    mutateVisitCallbacks.set(id, mutateVisitCallback);
    return () => {
      mutateVisitCallbacks.delete(id);
    };
  }, [id, mutateVisitCallback]);

  const visitContextStore = useStoreWithActions(getVisitStore(), visitContextStoreActions);

  return { ...visitContextStore, mutateVisit };
}
