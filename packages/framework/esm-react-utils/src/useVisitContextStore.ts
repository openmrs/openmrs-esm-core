import { useEffect, useId } from 'react';
import { getVisitStore, type Visit, type VisitStoreState } from '@openmrs/esm-emr-api';
import { type Actions, useStoreWithActions } from './useStore';

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
  mutateVisit(currState: VisitStoreState) {
    for (const mutateCallback of Object.values(currState.mutateVisitCallbacks ?? {})) {
      mutateCallback();
    }
    return {};
  },
} satisfies Actions<VisitStoreState>;

/**
 * A hook to return the visit context store and corresponding actions.
 * @param mutateVisitCallback An optional mutate callback to register. If provided, the
 * store action's `mutateVisit` function will invoke this callback (along with any other
 * callbacks also registered into the store)
 * @returns
 */
export function useVisitContextStore(mutateVisitCallback?: () => void) {
  const id = useId();

  useEffect(() => {
    const visitStore = getVisitStore();

    // register the callback if it exists
    if (mutateVisitCallback) {
      visitStore.setState({
        mutateVisitCallbacks: {
          ...visitStore.getState().mutateVisitCallbacks,
          [id]: mutateVisitCallback,
        },
      });
    }

    // deregister the callback on unmount, if it exists
    return () => {
      if (mutateVisitCallback) {
        const mutateVisitCallbacks = { ...visitStore.getState().mutateVisitCallbacks };
        delete mutateVisitCallbacks[id];
        visitStore.setState({ mutateVisitCallbacks });
      }
    };
  }, [id, mutateVisitCallback]);

  return useStoreWithActions(getVisitStore(), visitContextStoreActions);
}
