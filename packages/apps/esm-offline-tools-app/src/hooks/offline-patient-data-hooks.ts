import {
  fetchCurrentPatient,
  getSynchronizationItems,
  useStore,
  getDynamicOfflineDataEntries,
} from "@openmrs/esm-framework";
import useSWR from "swr";

export function useOfflineRegisteredPatients() {
  return useSWR("offlineTools/offlineRegisteredPatients", async () => {
    const syncItems = await getSynchronizationItems<{
      fhirPatient?: fhir.Patient;
    }>("patient-registration");
    return syncItems
      .filter((item) => item.fhirPatient)
      .map((item) => item.fhirPatient);
  });
}

export function useOfflinePatientsWithEntries() {
  return useSWR("offlineTools/offlinePatients", async () => {
    const offlinePatientEntries = await getDynamicOfflineDataEntries("patient");

    const result = await Promise.all(
      offlinePatientEntries.map(async (entry) => ({
        patient: (await fetchCurrentPatient(entry.identifier))?.data,
        entry,
      }))
    );

    return result.filter((x) => x.patient);
  });
}

export function useLastSyncStateOfPatient(patientUuid: string) {
  return useSWR(
    `offlineTools/offlinePatient/${patientUuid}/lastSyncState`,
    async () => {
      const offlinePatientEntries = await getDynamicOfflineDataEntries(
        "patient"
      );
      const patientEntry = offlinePatientEntries.find(
        (entry) => entry.identifier === patientUuid
      );
      return patientEntry?.syncState;
    }
  );
}
