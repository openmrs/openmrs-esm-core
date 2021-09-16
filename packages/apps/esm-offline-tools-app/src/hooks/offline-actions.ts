import {
  fetchCurrentPatient,
  getOfflineDb,
  SyncItem,
} from "@openmrs/esm-framework";
import uniq from "lodash-es/uniq";
import useSWR from "swr";

export function usePendingSyncItems() {
  return useSWR("offlineActions/pending", async () => {
    const db = getOfflineDb();
    return await db.syncQueue.toArray();
  });
}

export function useSyncItemPatients(syncItems?: Array<SyncItem>) {
  const patientUuids = syncItems
    ? uniq(
        syncItems.map((item) => item?.descriptor?.patientUuid).filter(Boolean)
      )
    : null;

  return useSWR(
    () => ["patients", ...patientUuids],
    async () => {
      const results: Array<{ data: fhir.Patient }> = await Promise.all(
        patientUuids.map((id) => fetchCurrentPatient(id))
      );
      return results.map((res) => res.data);
    }
  );
}
