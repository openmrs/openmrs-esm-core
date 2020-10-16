import { Subject } from "rxjs";

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
