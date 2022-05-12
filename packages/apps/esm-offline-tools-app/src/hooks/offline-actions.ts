import {
  fetchCurrentPatient,
  getFullSynchronizationItems,
  getSynchronizationItems,
  SyncItem,
} from "@openmrs/esm-framework/src/internal";
import uniq from "lodash-es/uniq";
import useSWR from "swr";

export function usePendingSyncItems() {
  return useSWR("offlineActions/pending", getFullSynchronizationItems);
}

export function useSyncItemPatients(syncItems?: Array<SyncItem>) {
  const patientUuids = syncItems
    ? uniq(
        syncItems.map((item) => item?.descriptor?.patientUuid).filter(Boolean)
      )
    : null;

  return useSWR(
    () => ["patients", ...patientUuids],
    () => Promise.all(patientUuids.map((id) => getFhirPatient(id)))
  );
}

async function getFhirPatient(patientUuid: string) {
  const syncItems = await getSynchronizationItems<{
    fhirPatient?: fhir.Patient;
  }>("patient-registration");
  const offlineRegisteredPatient = syncItems.find(
    (syncItem) => syncItem.fhirPatient?.id === patientUuid
  )?.fhirPatient;

  return (
    offlineRegisteredPatient ??
    (await fetchCurrentPatient(patientUuid).then((res) => res.data))
  );
}
