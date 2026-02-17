/** @module @category Context */
import { useEffect, useRef } from 'react';
import { getContext, registerContext, unregisterContext, updateContext } from '@openmrs/esm-context';
import { shallowEqual } from '@openmrs/esm-utils';

/**
 * Tracks the current owner of each namespace so that a stale cleanup from a
 * previous instance does not unregister a namespace that a newer instance now owns.
 */
const namespaceOwners = new Map<string, symbol>();

/**
 * This hook is used to register a namespace in the AppContext. The component that registers the
 * namespace is responsible for updating the value associated with the namespace. The namespace
 * will be automatically removed when the component using this hook is unmounted.
 *
 * @example
 * ```ts
 * const { data: patient } = useSWR(`/ws/rest/v1/patient/${patientUuid}`, openmrsFetch);
 * useDefineAppContext<PatientContext>('patient', patient ?? null);
 * ```
 *
 * @example
 * ```ts
 * const { data: patient } = useSWR(`/ws/rest/v1/patient/${patientUuid}`, openmrsFetch);
 * const updatePatient = useDefineAppContext<PatientContext>('patient', patient ?? null);
 * updatePatient((patient) => {
 *  patient.name = 'Hector';
 *  return patient;
 * })
 * ```
 *
 * Note that the AppContext does not allow the storing of undefined values in a namespace. Use `null`
 * instead.
 *
 * @typeParam T The type of the value of the namespace
 * @param namespace The name of the namespace in the application context. Note that the namespace
 *  must be unique among currently registered namespaces in the application context.
 * @param value The value to associate with this namespace. Updating the value property will update
 *   the namespace value.
 * @returns A function which can be used to update the state associated with the namespace
 */
export function useDefineAppContext<T extends NonNullable<object> = NonNullable<object>>(namespace: string, value?: T) {
  const previousValue = useRef<T>(value ?? ({} as T));
  const updateFunction = useRef((update: (state: T) => T) => updateContext<T>(namespace, update));
  const ownerToken = useRef(Symbol());

  // effect hook for registration and unregistration
  useEffect(() => {
    const initialValue = value ?? ({} as T);
    const token = ownerToken.current;

    if (getContext(namespace) !== null) {
      // The previous instance's cleanup effect hasn't run before this new instance
      // mounts (e.g., during navigation when extensions unmount/remount across
      // separate single-spa lifecycles). Update the existing context instead.
      console.error(
        `Namespace ${namespace} is already registered in the app context. ` +
          `This is likely a race condition during navigation, but may indicate two components ` +
          `are trying to own the same namespace. Updating the existing context.`,
      );
      updateContext<T>(namespace, () => initialValue);
    } else {
      registerContext(namespace, initialValue);
    }

    namespaceOwners.set(namespace, token);

    return () => {
      // Only unregister if this instance is still the current owner.
      // A newer instance may have taken ownership during a lifecycle race.
      if (namespaceOwners.get(namespace) === token) {
        unregisterContext(namespace);
        namespaceOwners.delete(namespace);
      }
    };
  }, [namespace]);

  useEffect(() => {
    let futureValue: T = value ?? ({} as T);
    if (!shallowEqual(previousValue.current, futureValue)) {
      updateContext<T>(namespace, () => futureValue);
      previousValue.current = futureValue;
    }
  }, [value]);

  return updateFunction.current;
}
