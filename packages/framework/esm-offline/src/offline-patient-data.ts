/** @module @category Offline */
import { createGlobalStore } from "@openmrs/esm-state";
import {
  setupDynamicOfflineDataHandler,
  syncDynamicOfflineData,
} from "./dynamic-offline-data";

/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export interface OfflinePatientDataSyncStore {
  offlinePatientDataSyncState: Record<string, OfflinePatientDataSyncState>;
  handlers: Record<string, OfflinePatientDataSyncHandler>;
}

/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export interface OfflinePatientDataSyncState {
  readonly timestamp: Date;
  readonly syncingHandlers: Array<string>;
  readonly syncedHandlers: Array<string>;
  readonly failedHandlers: Array<string>;
  readonly errors: Record<string, string>;
  abort(): boolean;
}

/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export interface OfflinePatientDataSyncHandler {
  readonly displayName: string;
  onOfflinePatientAdded(args: OfflinePatientArgs): Promise<void>;
}

/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export interface OfflinePatientArgs {
  patientUuid: string;
  signal: AbortSignal;
}

const store = createGlobalStore<OfflinePatientDataSyncStore>(
  "offline-patients",
  {
    offlinePatientDataSyncState: {},
    handlers: {},
  }
);

/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export function getOfflinePatientDataStore() {
  printDeprecationWarning();
  return store;
}

/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export function registerOfflinePatientHandler(
  identifier: string,
  handler: OfflinePatientDataSyncHandler
) {
  printDeprecationWarning();

  setupDynamicOfflineDataHandler({
    type: "patient",
    displayName: handler.displayName,
    id: identifier,
    isSynced: () => Promise.resolve(true),
    sync: (patientUuid, signal) =>
      handler.onOfflinePatientAdded({
        patientUuid,
        signal: signal ?? new AbortController().signal,
      }),
  });
}

/** @deprecated Will be removed once all modules have been migrated to the new dynamic offline data API. */
export async function syncOfflinePatientData(patientUuid: string) {
  printDeprecationWarning();
  await syncDynamicOfflineData("patient", patientUuid);
}

function printDeprecationWarning() {
  console.warn(
    "The offline patient API has been deprecated and will be removed in a future release. " +
      "To prevent future crashes, the functions remain available for the moment, but any invocations should be migrated ASAP."
  );
}
