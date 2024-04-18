import { useEffect, useRef } from 'react';
import { registerContext, unregisterContext, updateContext } from '@openmrs/esm-context';

export default function useDefineAppContextNamespace<T = unknown>(namespace: string, value?: T) {
  const previousValue = useRef(value);

  // effect hook for registration and unregistration
  useEffect(() => {
    registerContext(namespace, value);
    return () => {
      unregisterContext(namespace);
    };
  }, [namespace]);

  if (value && previousValue.current !== value) {
    updateContext<T>(namespace, () => {
      return value;
    });
    previousValue.current = value;
  }
}
