import {
  fetchCurrentPatient,
  setupDynamicOfflineDataHandler,
} from "@openmrs/esm-framework";
import { cacheForOfflineHeaders } from "./constants";

export function setupOffline() {
  setupDynamicOfflineDataHandler({
    id: "esm-offline-tools-app:patient",
    displayName: "Offline tools",
    type: "patient",
    async isSynced(identifier) {
      return true;
    },
    async sync(identifier) {
      await fetchCurrentPatient(identifier, {
        headers: cacheForOfflineHeaders,
      });
    },
  });
}
