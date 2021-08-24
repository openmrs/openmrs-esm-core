import { getOfflinePatientDataStore, useStore } from "@openmrs/esm-framework";

export function useOfflinePatientDataStore() {
  const store = getOfflinePatientDataStore();
  return useStore(store);
}
