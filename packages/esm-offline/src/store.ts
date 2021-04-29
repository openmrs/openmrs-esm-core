import { createGlobalStore } from "@openmrs/esm-state";

export type SynchronizeCallback = () => Promise<void>;

export interface OfflineStore {
  synchronizationCallbacks: Array<SynchronizeCallback>;
}

const store = createGlobalStore<OfflineStore>("offline", {
  synchronizationCallbacks: [] as Array<SynchronizeCallback>,
});

export function getSynchronizationCallbacks() {
  return store.getState().synchronizationCallbacks;
}

export function registerSynchronizationCallback(cb: SynchronizeCallback) {
  const update = {
    synchronizationCallbacks: [...getSynchronizationCallbacks(), cb],
  };
  store.setState(update, true);
}
