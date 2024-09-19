import uniq from 'lodash-es/uniq';
import useSWR from 'swr';
import { fetchPatientData, getFullSynchronizationItems, type SyncItem } from '@openmrs/esm-framework/src/internal';

export function usePendingSyncItems() {
  return useSWR('offlineActions/pending', () => getFullSynchronizationItems());
}

export function useSyncItemPatients(syncItems?: Array<SyncItem>) {
  const patientUuids = syncItems ? uniq(syncItems.map((item) => item?.descriptor?.patientUuid).filter(Boolean)) : null;

  return useSWR(
    () => ['patients', ...patientUuids],
    () => Promise.all(patientUuids.map((id) => fetchPatientData(id, true))),
  );
}
