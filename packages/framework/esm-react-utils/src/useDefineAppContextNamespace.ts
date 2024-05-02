import { useEffect, useRef, useState } from 'react';
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
 * useDefineAppContextNamespace<PatientContext>('patient', patient ?? null);
 * ```

 * Note that the AppContext does not allow the storing of undefined values in a namespace. Use `null`
 * instead.
 *
 * @typeParam T The type of the value of the namespace
 * @param namespace The name of the namespace in the application context. Note that the namespace
 *  must be unique among currently registered namespaces in the application context.
 * @param value
 */
export default function useDefineAppContextNamespace<T extends {}>(namespace: string, value?: T) {
  const previousValue = useRef<T>(value ?? ({} as unknown as T));

  // effect hook for registration and unregistration
  useEffect(() => {
    registerContext(namespace, value ?? ({} as unknown as T));
    return () => {
      unregisterContext(namespace);
    };
  }, [namespace]);

  useEffect(() => {
    let futureValue: T = value ?? ({} as unknown as T);
    if (!shallowEqual(previousValue.current, futureValue)) {
      updateContext<T>(namespace, () => {
        return futureValue;
      });
      previousValue.current = futureValue;
    }
  }, [value]);
}
