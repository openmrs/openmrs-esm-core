/** @module @category Context */
import { useEffect, useState } from 'react';
import { getContext, subscribeToContext } from '@openmrs/esm-context';
import { shallowEqual } from '@openmrs/esm-utils';

/**
 * This hook is used to access a namespace within the overall AppContext, so that a component can
 * use any shared contextual values. A selector may be provided to further restrict the properties
 * returned from the namespace.
 *
 * @example
 * ```ts
 * // load a full namespace
 * const patientContext = useAppContext<PatientContext>('patient');
 * ```
 *
 * @example
 * ```ts
 * // loads part of a namespace
 * const patientName = useAppContext<PatientContext, string | undefined>('patient', (state) => state.display);
 * ```
 *
 * @typeParam T The type of the value stored in the namespace
 * @param namespace The namespace to load properties from
 */
export function useAppContext<T extends NonNullable<object> = NonNullable<object>>(
  namespace: string,
): Readonly<T> | undefined;

/**
 * This hook is used to access a namespace within the overall AppContext, so that a component can
 * use any shared contextual values. A selector may be provided to further restrict the properties
 * returned from the namespace.
 *
 * @example
 * ```ts
 * // load a full namespace
 * const patientContext = useAppContext<PatientContext>('patient');
 * ```
 *
 * @example
 * ```ts
 * // loads part of a namespace
 * const patientName = useAppContext<PatientContext, string | undefined>('patient', (state) => state.display);
 * ```
 *
 * @typeParam T The type of the value stored in the namespace
 * @typeParam U The return type of this hook which is mostly relevant when using a selector
 * @param namespace The namespace to load properties from
 * @param selector An optional function which extracts the relevant part of the state
 */
export function useAppContext<T extends NonNullable<object> = NonNullable<object>, U = T>(
  namespace: string,
  selector: (state: Readonly<T> | null) => Readonly<U>,
): Readonly<U> | undefined;

export function useAppContext<T extends NonNullable<object> = NonNullable<object>, U = T>(
  namespace: string,
  selector: (state: Readonly<T> | null) => Readonly<U> = (state) => (state ?? {}) as Readonly<U>,
): Readonly<U> | undefined {
  const [value, setValue] = useState<Readonly<U> | undefined>(() => {
    if (isBlankNamespace(namespace)) {
      return undefined;
    }
    const current = getContext<T>(namespace);
    if (current === null) {
      return undefined;
    }
    return selector ? selector(current) : (current as unknown as Readonly<U>);
  });

  useEffect(() => {
    if (isBlankNamespace(namespace)) {
      throw new Error(`The namespace supplied to useAppContext must be a non-empty string, but was "${namespace}".`);
    }
  }, [namespace]);

  useEffect(() => {
    return subscribeToContext<T>(namespace, (state) => {
      if (state == null) {
        setValue(undefined);
        return;
      }
      const newValue = selector ? selector(state) : (state as unknown as Readonly<U>);
      setValue((prev) => (shallowEqual(prev, newValue) ? prev : newValue));
    });
  }, [namespace, selector]);

  return value;
}

function isBlankNamespace(namespace: unknown): boolean {
  return typeof namespace !== 'string' || namespace.trim().length === 0;
}
