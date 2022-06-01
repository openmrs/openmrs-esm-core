/** @module @category Offline */
import { getLoggedInUser } from "@openmrs/esm-api";
import Dexie from "dexie";
import { OfflineDb } from "./offline-db";

/**
 * A handler for synchronizing dynamically declared offline data.
 * Can be setup using the {@link setupDynamicOfflineDataHandler} function.
 */
export interface DynamicOfflineDataHandler {
  /**
   * A string uniquely identifying the handler.
   */
  id: string;
  /**
   * The type of offline data handled by this handler.
   * See {@link DynamicOfflineData.type} for details.
   */
  type: string;
  /**
   * A human-readable string representing the handler.
   * If provided, the handler can be rendered in the UI using that string.
   */
  displayName?: string;
  /**
   * Evaluates whether the given offline data is correctly synced at this point in time from the perspective
   * of this single handler.
   * If `false`, the handler would have to (re-)sync the data in order for offline mode to properly work.
   * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
   * @param abortSignal An {@link AbortSignal} which can be used to cancel the operation.
   */
  isSynced(identifier: string, abortSignal?: AbortSignal): Promise<boolean>;
  /**
   * Synchronizes the given offline data.
   * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
   * @param abortSignal An {@link AbortSignal} which can be used to cancel the operation.
   */
  sync(identifier: string, abortSignal?: AbortSignal): Promise<void>;
}

/**
 * Represents the registration of a single dynamic offline data entry.
 */
export interface DynamicOfflineData {
  /**
   * The internal ID of the data entry, as assigned by the IndexedDB where it is stored.
   */
  id?: number;
  /**
   * The underlying type used for categorizing the data entry.
   * Examples could be `"patient"` or `"form"`.
   */
  type: string;
  /**
   * The externally provided identifier of the data entry.
   * This is typically the ID of the resource as assigned by a remote API.
   */
  identifier: string;
  /**
   * The UUIDs of the users who need this data entry available offline.
   */
  users: Array<string>;
  /**
   * If this entry has already been synced, returns the result of that last sync attempt.
   * Otherwise this is `undefined`.
   */
  syncState?: DynamicOfflineDataSyncState;
}

/**
 * Represents the result of syncing a given {@link DynamicOfflineData} entry.
 */
export interface DynamicOfflineDataSyncState {
  /**
   * The time when the entry has been synced the last time.
   */
  syncedOn: Date;
  /**
   * The ID of the user who has triggered the data synchronization.
   */
  syncedBy: string;
  /**
   * The IDs of the handlers which successfully synchronized their data.
   */
  succeededHandlers: Array<string>;
  /**
   * The IDs of the handlers which failed to synchronize their data.
   */
  erroredHandlers: Array<string>;
  /**
   * A collection of the errors caught while synchronizing, per handler.
   */
  errors: Array<{
    handlerId: string;
    message: string;
  }>;
}

const dynamicOfflineDataHandlers: Record<string, DynamicOfflineDataHandler> =
  {};

/**
 * Returns all handlers which have been setup using the {@link setupDynamicOfflineDataHandler} function.
 */
export function getDynamicOfflineDataHandlers() {
  return Object.values(dynamicOfflineDataHandlers);
}

/**
 * Sets up a handler for synchronizing dynamic offline data.
 * See {@link DynamicOfflineDataHandler} for details.
 * @param handler The handler to be setup.
 */
export function setupDynamicOfflineDataHandler(
  handler: DynamicOfflineDataHandler
) {
  if (dynamicOfflineDataHandlers[handler.id]) {
    console.warn(
      `[setupDynamicOfflineDataHandler] Another second handler with the ID "${handler.id}" was registered. This handler will override the previous one. This could be unintended as the previous handler might run different flows than the newly registered one. If this is the case, ensure that you are setting up the handlers with different IDs.`
    );
  }

  dynamicOfflineDataHandlers[handler.id] = handler;
}

/**
 * Returns all {@link DynamicOfflineData} entries which registered for the currently logged in user.
 * Optionally returns only entries of a given type.
 * @param type The type of the entries to be returned. If `undefined`, returns all types.
 */
export async function getDynamicOfflineDataEntries(
  type?: string
): Promise<Array<DynamicOfflineData>> {
  const userId = await getCurrentUserId();
  return await getDynamicOfflineDataEntriesFor(userId, type);
}

/**
 * Returns all {@link DynamicOfflineData} entries which registered for the given user.
 * Optionally returns only entries of a given type.
 * @param userId The ID of the user whose entries are to be retrieved.
 * @param type The type of the entries to be returned. If `undefined`, returns all types.
 */
export async function getDynamicOfflineDataEntriesFor(
  userId: string,
  type?: string
): Promise<Array<DynamicOfflineData>> {
  const filter = type ? { type, users: userId } : { users: userId };
  const db = new OfflineDb();
  return await db.dynamicOfflineData
    .where(filter)
    .toArray()
    .catch(Dexie.errnames.DatabaseClosed, () => []);
}

/**
 * Declares that dynamic offline data of the given {@link type} with the given {@link identifier}
 * should be made available offline for the currently logged in user.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
 */
export async function putDynamicOfflineData(
  type: string,
  identifier: string
): Promise<void> {
  const userId = await getCurrentUserId();
  return await putDynamicOfflineDataFor(userId, type, identifier);
}

/**
 * Declares that dynamic offline data of the given {@link type} with the given {@link identifier}
 * should be made available offline for the user with the given ID.
 * @param userId The ID of the user for whom the dynamic offline data should be made available.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
 */
export async function putDynamicOfflineDataFor(
  userId: string,
  type: string,
  identifier: string
): Promise<void> {
  const db = new OfflineDb();
  const existingEntry = await db.dynamicOfflineData
    .get({
      type,
      identifier,
    })
    .catch(Dexie.errnames.DatabaseClosed, () => undefined);

  if (!existingEntry) {
    await db.dynamicOfflineData
      .add({
        users: [userId],
        type,
        identifier,
      })
      .catch(Dexie.errnames.DatabaseClosed);
  } else if (!existingEntry.users.includes(userId)) {
    await db.dynamicOfflineData
      .update(existingEntry.id!, {
        users: [...existingEntry.users, userId],
      })
      .catch(Dexie.errnames.DatabaseClosed);
  }
}

/**
 * Declares that dynamic offline data of the given {@link type} with the given {@link identifier}
 * no longer needs to be available offline for the currently logged in user.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
 */
export async function removeDynamicOfflineData(
  type: string,
  identifier: string
): Promise<void> {
  const userId = await getCurrentUserId();
  return await removeDynamicOfflineDataFor(userId, type, identifier);
}

/**
 * Declares that dynamic offline data of the given {@link type} with the given {@link identifier}
 * no longer needs to be available offline for the user with the given ID.
 * @param userId The ID of the user who doesn't require the specified offline data.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
 */
export async function removeDynamicOfflineDataFor(
  userId: string,
  type: string,
  identifier: string
): Promise<void> {
  const db = new OfflineDb();
  const existingEntry = await db.dynamicOfflineData
    .get({
      type,
      identifier,
      users: userId,
    })
    .catch(Dexie.errnames.DatabaseClosed, () => undefined);

  if (existingEntry) {
    if (existingEntry.users.length > 1) {
      await db.dynamicOfflineData
        .update(existingEntry.id!, {
          users: existingEntry.users.filter((x) => x !== userId),
        })
        .catch(Dexie.errnames.DatabaseClosed);
    } else {
      await db.dynamicOfflineData
        .delete(existingEntry.id!)
        .catch(Dexie.errnames.DatabaseClosed);
    }
  }
}

/**
 * Synchronizes all offline data entries of the given {@link type} for the currently logged in user.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param abortSignal An {@link AbortSignal} which can be used to cancel the operation.
 */
export async function syncAllDynamicOfflineData(
  type: string,
  abortSignal?: AbortSignal
): Promise<void> {
  const dataEntriesToSync = await getDynamicOfflineDataEntries(type);
  await Promise.all(
    dataEntriesToSync.map(async (entry) =>
      syncDynamicOfflineData(entry.type, entry.identifier, abortSignal)
    )
  );
}

/**
 * Synchronizes a single offline data entry of the given {@link type} for the currently logged in user.
 * @param type The type of the offline data. See {@link DynamicOfflineData} for details.
 * @param identifier The identifier of the offline data. See {@link DynamicOfflineData} for details.
 * @param abortSignal An {@link AbortSignal} which can be used to cancel the operation.
 */
export async function syncDynamicOfflineData(
  type: string,
  identifier: string,
  abortSignal?: AbortSignal
): Promise<void> {
  // If this function is called without the offline data being registered, we're implicitly doing
  // that instead of throwing. This mitigates race conditions with user input and generally
  // prevents errors that might occur otherwise (e.g. the sync state not being accessible without
  // an entry being present).
  await putDynamicOfflineData(type, identifier);

  const db = new OfflineDb();
  const userId = await getCurrentUserId();
  const entry = await db.dynamicOfflineData
    .get({ type, identifier })
    .catch(Dexie.errnames.DatabaseClosed, () => undefined);
  const handlers = getDynamicOfflineDataHandlers().filter(
    (handler) => handler.type === type
  );

  if (!entry) {
    return;
  }

  const results = await Promise.all(
    handlers.map(async (handler) => {
      try {
        handler.sync(identifier, abortSignal);
        return { id: handler.id, error: undefined };
      } catch (e: any) {
        const errorMessage: string = e["message"]?.toString() ?? e.toString();
        return { id: handler.id, error: errorMessage };
      }
    })
  );

  const succeededHandlers = results.filter((x) => !x.error).map((x) => x.id);
  const erroredHandlers = results.filter((x) => x.error).map((x) => x.id);
  const errors = results
    .filter((x) => x.error)
    .map((x) => ({ handlerId: x.id, message: x.error! }));
  const newSyncState: DynamicOfflineDataSyncState = {
    syncedOn: new Date(),
    syncedBy: userId,
    succeededHandlers,
    erroredHandlers,
    errors,
  };

  if (entry.id) {
    await db.dynamicOfflineData
      .update(entry.id!, {
        syncState: newSyncState,
      })
      .catch(Dexie.errnames.DatabaseClosed);
  }
}

async function getCurrentUserId() {
  const id = (await getLoggedInUser()).uuid;

  if (!id) {
    throw new Error(
      "Using the dynamic offline data API requires a logged in user."
    );
  }

  return id;
}
