/** @module @category Offline */
import { subscribeConnectivityChanged } from '@openmrs/esm-globals';
import { isOnline as isOnlineFn } from '@openmrs/esm-utils';
import { useEffect, useState } from 'react';

/**
 * A React hook that returns the current online/offline status and automatically
 * updates when connectivity changes. Useful for showing offline indicators or
 * conditionally rendering UI based on network availability.
 *
 * @returns `true` if the browser is online, `false` if offline.
 *
 * @example
 * ```tsx
 * import { useConnectivity } from '@openmrs/esm-framework';
 * function NetworkStatus() {
 *   const isOnline = useConnectivity();
 *   return <span>{isOnline ? 'Online' : 'Offline'}</span>;
 * }
 * ```
 */
export function useConnectivity() {
  let [isOnline, setIsOnline] = useState(isOnlineFn());

  useEffect(() => subscribeConnectivityChanged(({ online }) => setIsOnline(online)), []);

  return isOnline;
}
