/** @module @category Utility */
import { useEffect, useRef } from 'react';

/**
 * @beta
 *
 * This hook creates an AbortController that lasts either until the previous AbortController
 * is aborted or until the component unmounts. This can be used to ensure that all fetch requests
 * are cancelled when a component is unmounted.
 *
 * @example
 * ```tsx
 * import { useAbortController } from "@openmrs/esm-framework";
 *
 * function MyComponent() {
 *  const abortController = useAbortController();
 *  const { data } = useSWR(key, (key) => openmrsFetch(key, { signal: abortController.signal }));
 *
 *  return (
 *    // render something with data
 *  );
 * }
 * ```
 */
export function useAbortController() {
  const abortController = useRef<AbortController>();

  if (!abortController.current || abortController.current.signal.aborted) {
    abortController.current = new AbortController();
  }

  useEffect(() => {
    const ac = abortController.current;
    return () => ac?.abort();
  }, []);

  return abortController.current;
}

export default useAbortController;
