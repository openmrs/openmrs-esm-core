/** @module @category Offline */
import { subscribeConnectivityChanged } from "@openmrs/esm-globals";
import { useEffect, useState } from "react";

export function useConnectivity() {
  let [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(
    () => subscribeConnectivityChanged(({ online }) => setIsOnline(online)),
    []
  );

  return isOnline;
}
