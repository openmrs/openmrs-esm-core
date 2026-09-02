/** @module @category Utility */
import { useRef } from 'react';
import { shallowEqual } from '@openmrs/esm-utils';

/**
 * Returns `value` with a reference that only changes when its contents do, so that it can be used
 * as a dependency of `useMemo`, `useEffect` and friends.
 *
 * This exists for props that are almost always written as object literals — `state={{ patientUuid }}`
 * — which get a new identity on every render while meaning the same thing. Comparison is shallow,
 * so a value nested more than one level deep still reads as a change.
 *
 * @param value The value to stabilize
 * @returns `value`, or the last value this hook returned if the two are shallowly equal
 */
export function useShallowStableValue<T>(value: T): T {
  const stable = useRef(value);

  if (!shallowEqual(stable.current, value)) {
    stable.current = value;
  }

  return stable.current;
}
