import { subscribeToContext } from '@openmrs/esm-context';
import { useEffect, useRef } from 'react';

export default function useAppContext<T = unknown, U = unknown>(
  namespace: string,
  selector: (state: Readonly<T> | null) => U = (state) => state as unknown as U,
) {
  const value = useRef<U>();

  useEffect(() => {
    return subscribeToContext<T>(namespace, (state) => {
      if (typeof state !== 'undefined') {
        value.current = selector ? selector(state) : (state as unknown as U);
      }
    });
  });

  return value.current;
}
