import Dexie, { Table } from "dexie";
import { createGlobalStore } from "@openmrs/esm-state";

export interface OfflinePatientDataSyncStore {
  /**
   * For each patient ID of the patients whose data is currently made available offline, provides
   * the current data synchronizaton state.
   */
  offlinePatientDataSyncState: Record<string, OfflinePatientDataSyncState>;
  /**
   * Holds the list of currently registered handlers which deal with patients that should be available offline.
   * The key is a unique identifier which, once defined, should never change as it gives identity to
   * the handler registration.
   */
  handlers: Record<string, OfflinePatientDataSyncHandler>;
}

export interface OfflinePatientDataSyncState {
  /**
   * The time when this state snapshot was initially created.
   */
  readonly timestamp: Date;
  /**
   * A list of the data sync handler registration identifiers which are still in the process
   * of synchronizing the patient's data.
   */
  readonly syncingHandlers: Array<string>;
  /**
   * A list of the data sync handler registration identifiers which successfully synchronized the
   * patient's data.
   */
  readonly syncedHandlers: Array<string>;
  /**
   * A list of the data sync handler registration identifiers which failed to synchronize the
   * patient's data.
   */
  readonly failedHandlers: Array<string>;
  /**
   * A set of error messages associated with the identifers of the failed handlers.
   */
  readonly errors: Record<string, string>;
}

export interface OfflinePatientDataSyncHandler {
  /**
   * A name of the handler registration which can be displayed to the user.
   * This is ideally translated.
   */
  readonly displayName: string;
  /**
   * A function which is invoked when a patient is added to the app's offline patient cache.
   * Signals to the handler that the patient's data must be made available offline.
   * @param args Arguments which provide data about the patient to be made available offline.
   * @returns A promise which should resolve if all data could be cached and reject when there was an issue
   *   caching the data.
   */
  onOfflinePatientAdded(args: OfflinePatientArgs): Promise<void>;
}

export interface OfflinePatientArgs {
  /**
   * The UUID of the patient that should be made available offline.
   */
  patientUuid: string;
}

const storeName = "offline-patients";
const store = createGlobalStore<OfflinePatientDataSyncStore>(
  "offline-patients",
  {
    offlinePatientDataSyncState: {},
    handlers: {},
  }
);

export function getOfflinePatientDataStore() {
  return store;
}

/**
 * Attempts to add the specified patient handler registration to the list of offline patient handlers.
 * @param identifier A key which uniquely identifies the registration.
 * @param handler The patient handler registration to be registered.
 * @returns `true` if the registration was successfully made; `false` if another registration with
 *   the same identifier has already been registered before.
 */
export function registerOfflinePatientHandler(
  identifier: string,
  handler: OfflinePatientDataSyncHandler
) {
  const state = store.getState();
  store.setState({
    handlers: { ...state.handlers, [identifier]: handler },
  });
}

/**
 * Notifies all registered offline patient handlers that a new patient must be made available offline.
 * @param args Arguments which provide data about the patient to be made available offline.
 * @returns A promise which resolves once all registered handlers have finished synchronizing.
 */
export async function syncOfflinePatientData(patientUuid: string) {
  const handlers = Object.entries(store.getState().handlers);
  const syncedHandlers: Array<string> = [];
  const failedHandlers: Array<string> = [];
  const errors = {};

  await setPatientDataSyncState(patientUuid, {
    timestamp: new Date(),
    syncingHandlers: handlers.map(([identifier]) => identifier),
    syncedHandlers,
    failedHandlers,
    errors,
  });

  await Promise.all(
    handlers.map(async ([identifier, handler]) => {
      try {
        await handler.onOfflinePatientAdded({ patientUuid });
        // eslint-disable-next-line no-console
        console.debug(
          `Offline patient handler ${identifier} successfully synchronized patient data.`
        );

        syncedHandlers.push(identifier);
      } catch (e) {
        console.error(
          `Offline patient handler ${identifier} failed. Error: `,
          e
        );

        failedHandlers.push(identifier);
        errors[identifier] = e?.message ?? e?.toString() ?? "";
      }
    })
  );

  await setPatientDataSyncState(patientUuid, {
    timestamp: new Date(),
    syncingHandlers: [],
    syncedHandlers,
    failedHandlers,
    errors,
  });
}

async function setPatientDataSyncState(
  patientUuid: string,
  nextState: OfflinePatientDataSyncState
) {
  const state = store.getState();
  store.setState({
    offlinePatientDataSyncState: {
      ...state.offlinePatientDataSyncState,
      [patientUuid]: nextState,
    },
  });

  const db = new OfflinePatientDataDb();
  const existingEntry = await db.offlinePatientDataSyncStates.get({
    patientUuid,
  });
  const nextEntry: OfflinePatientDataSyncStateEntry = {
    id: existingEntry?.id,
    patientUuid,
    state: {
      timestamp: nextState.timestamp,
      syncedHandlers: nextState.syncedHandlers,
      failedHandlers: [
        ...nextState.failedHandlers,
        ...nextState.syncingHandlers,
      ],
      errors: nextState.errors,
    },
  };

  await db.offlinePatientDataSyncStates.put(nextEntry);
}

export async function loadPersistedPatientDataSyncState() {
  const db = new OfflinePatientDataDb();
  const persistedStates = await db.offlinePatientDataSyncStates.toArray();
  const nextState = store.getState().offlinePatientDataSyncState;

  for (const entry of persistedStates) {
    nextState[entry.patientUuid] = {
      ...entry.state,
      syncingHandlers: [],
    };
  }

  store.setState({ offlinePatientDataSyncState: nextState });
}

class OfflinePatientDataDb extends Dexie {
  offlinePatientDataSyncStates: Table<OfflinePatientDataSyncStateEntry, number>;

  constructor() {
    super("EsmOfflinePatientData");

    this.version(1).stores({
      offlinePatientDataSyncStates: "++id,&patientUuid",
    });

    this.offlinePatientDataSyncStates = this.table(
      "offlinePatientDataSyncStates"
    );
  }
}

type PersistedOfflinePatientDataSyncState = Omit<
  OfflinePatientDataSyncState,
  "syncingHandlers"
>;

interface OfflinePatientDataSyncStateEntry {
  id?: number;
  patientUuid: string;
  state: PersistedOfflinePatientDataSyncState;
}
