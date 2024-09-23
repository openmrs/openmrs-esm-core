/** @module @category Offline */
import { subscribeConnectivityChanged } from '@openmrs/esm-globals';
import { isOnline as isOnlineFn } from '@openmrs/esm-utils';
import { useEffect, useState } from 'react';

export function useConnectivity() {
  let [isOnline, setIsOnline] = useState(isOnlineFn());

  useEffect(() => subscribeConnectivityChanged(({ online }) => setIsOnline(online)), []);

  return isOnline;
}
