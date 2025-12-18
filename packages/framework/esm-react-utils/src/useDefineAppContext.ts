/** @module @category Context */
import { useEffect, useRef } from 'react';
import { registerContext, unregisterContext, updateContext } from '@openmrs/esm-context';
import { shallowEqual } from '@openmrs/esm-utils';

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

  // effect hook for registration and unregistration
  useEffect(() => {
    registerContext(namespace, value ?? ({} as T));
    return () => {
      unregisterContext(namespace);
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
