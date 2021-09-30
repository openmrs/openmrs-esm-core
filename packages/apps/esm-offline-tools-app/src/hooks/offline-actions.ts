import {
  fetchCurrentPatient,
  getOfflineDb,
  SyncItem,
} from "@openmrs/esm-framework";
import uniq from "lodash-es/uniq";
import useSWR from "swr";

export function usePendingSyncItems() {
  return useSWR("offlineActions/pending", async () => {
    // TODO: This should be replaced with a function call from esm-offline as accessing the DB directly is dirty.
    // It also doesn't consider the currently logged-in user atm.
    const db = getOfflineDb();
    const items = await db.syncQueue.toArray();
    items.sort((a, b) => b.createdOn.getTime() - a.createdOn.getTime());
    return items;
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
