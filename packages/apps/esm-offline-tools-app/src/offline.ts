import {
  fetchCurrentPatient,
  registerOfflinePatientHandler,
} from "@openmrs/esm-framework";
import { cacheForOfflineHeaders } from "./constants";

export function setupOffline() {
  registerOfflinePatientHandler("esm-offline-tools-app", {
    displayName: "Offline tools",
    async onOfflinePatientAdded({ patientUuid }) {
      await fetchCurrentPatient(patientUuid, {
        headers: cacheForOfflineHeaders,
      });
    },
  });
}
