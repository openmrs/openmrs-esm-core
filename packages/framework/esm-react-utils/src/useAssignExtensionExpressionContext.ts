/** @module @category Extension */
import { useEffect, useRef } from 'react';
import { getExtensionExpressionContextStore } from '@openmrs/esm-extensions';
import { shallowEqual } from '@openmrs/esm-utils';

/**
 * This hook is used to provide additional context data that will be available to extension display expressions.
 * Note: Patient demographics are automatically provided when on patient pages, so this hook is typically used for
 * additional context like visit data, custom business logic, computed values, or other application-specific data.
 * The context will be automatically removed when the component using this hook is unmounted.
 *
 * @example
 * ```ts
 * // Provide visit data
 * const { data: visit } = useSWR(`/ws/rest/v1/visit?patient=${patientUuid}&includeInactive=false`, openmrsFetch);
 * useAssignExtensionExpressionContext({ visit });
 * ```
 *
 * @example
 * ```ts
 * // Provide custom computed values
 * const patientAge = patient?.age || 0;
 * const isAdult = patientAge >= 18;
 * useAssignExtensionExpressionContext({ isAdult, patientAge });
 * ```
 *
 * @example
 * ```ts
 * // Provide additional business context
 * const { data: allergies } = useSWR(`/ws/rest/v1/patient/${patientUuid}/allergy`, openmrsFetch);
 * const hasAllergies = allergies?.length > 0;
 * useAssignExtensionExpressionContext({ hasAllergies, allergies });
 * ```
 *
 * @param context Additional context data to provide to extension display expressions
 */
export function useAssignExtensionExpressionContext(context: Record<string, any>) {
  const previousContext = useRef<Record<string, any>>(context ?? {});
  const extensionExpressionContextStore = getExtensionExpressionContextStore();

  // effect hook for registration and unregistration
  useEffect(() => {
    if (context) {
      extensionExpressionContextStore.setState({ ...extensionExpressionContextStore.getState(), ...context });
    }
    return () => {
      // Remove the context keys when component unmounts
      if (context) {
        const currentState = extensionExpressionContextStore.getState();
        const newState = { ...currentState };
        Object.keys(context).forEach((key) => {
          delete newState[key];
        });
        extensionExpressionContextStore.setState(newState);
      }
    };
  }, []);

  // effect hook for updating context when it changes
  useEffect(() => {
    const currentContext = context ?? {};
    if (!shallowEqual(previousContext.current, currentContext)) {
      const currentState = extensionExpressionContextStore.getState();
      extensionExpressionContextStore.setState({ ...currentState, ...currentContext });
      previousContext.current = currentContext;
    }
  }, [context]);
}
