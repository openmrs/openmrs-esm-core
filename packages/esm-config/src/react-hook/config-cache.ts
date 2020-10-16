import { Subject } from "rxjs";
import { useState, useCallback } from "react";

export const configCache = {};
export const configCacheNotifier = new Subject<null>();

export function invalidateConfigCache() {
  configCacheNotifier.next();
}

export function clearConfigCache() {
  for (let member in configCache) {
    delete configCache[member];
  }
}

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
}
