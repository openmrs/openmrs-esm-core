/** @module @category Offline */
import Dexie from "dexie";
import { getLoggedInUser } from "@openmrs/esm-api";
import { createGlobalStore } from "@openmrs/esm-state";
import { OfflineDb } from "./offline-db";

/**
 * Defines an item queued up in the offline synchronization queue.
 * A `SyncItem` contains both meta information about the item in the sync queue, as well as the
 * actual data to be synchronized (i.e. the item's `content`).
 */
export interface SyncItem<T = any> {
  id?: number;
  userId: string;
  type: string;
  content: T;
  createdOn: Date;
  descriptor: QueueItemDescriptor;
  lastError?: {
    name?: string;
    message?: string;
  };
}

/**
 * Contains information about the sync item which has been provided externally by the caller
 * who added the item to the queue.
 * This information is all optional, but, when provided while enqueuing the item, can be used in other
 * locations to better represent the sync item, e.g. in the UI.
 */
export interface QueueItemDescriptor {
  id?: string;
  dependencies?: Array<{
    id: string;
    type: string;
  }>;
  patientUuid?: string;
  displayName?: string;
}

/**
 * A function which, when invoked, performs the actual client-server synchronization of the given
 * `item` (which is the actual data to be synchronized).
 * The function receives additional `options` which provide additional data that can be used
 * for synchronizing.
 */
export type ProcessSyncItem<T> = (
  item: T,
  options: SyncProcessOptions<T>
) => Promise<any>;

/**
 * Additional data which can be used for synchronizing data in a {@link ProcessSyncItem} function.
 */
export interface SyncProcessOptions<T> {
  abort: AbortController;
  userId: string;
  index: number;
  items: Array<T>;
  dependencies: Array<any>;
}

/**
 * Defines additional options which can optionally be provided when setting up a synchronization callback
 * for a specific synchronization item type.
 * These are not required, but, when set, allow further
 */
interface SetupOfflineSyncOptions<T> {
  /**
   * Invoked when the user requests to edit a sync item.
   * The typical behavior for such a callback is to launch a UI which allows editing the content
   * encapsulated by the sync item.
   * @param syncItem The sync item to be edited.
   */
  onBeginEditSyncItem?(syncItem: SyncItem<T>): void;
}

/**
 * Represents a synchronization handler which has been globally registered by the
 * {@link setupOfflineSync} function.
 * These handlers are used for synchronizing queued data.
 */
interface SyncHandler {
  readonly type: string;
  readonly dependsOn: ReadonlyArray<string>;
  readonly process: ProcessSyncItem<unknown>;
  readonly options: Readonly<SetupOfflineSyncOptions<any>>;
}

/**
 * Represents the data inside the global offline synchronization store.
 * Provides information about a currently ongoing synchronization.
 */
export interface OfflineSynchronizationStore {
  synchronization?: {
    totalCount: number;
    pendingCount: number;
    abortController: AbortController;
  };
}

interface SyncResultBag {
  [type: string]: Record<string, any>;
}

const db = new OfflineDb();
const handlers: Record<string, SyncHandler> = {};

const syncStore = createGlobalStore<OfflineSynchronizationStore>(
  "offline-synchronization",
  {}
);

export function getOfflineSynchronizationStore() {
  return syncStore;
}

/**
 * Runs a full synchronization of **all** queued synchronization items.
 */
export async function runSynchronization() {
  if (syncStore.getState().synchronization) {
    return;
  }

  const totalCount = await db.syncQueue.count();
  const promises: Record<string, Promise<void>> = {};
  const handlerQueue = Object.entries(handlers);
  const maxIter = handlerQueue.length;
  const results: SyncResultBag = {};
  const abortController = new AbortController();
  const notifySyncProgress = () => {
    const synchronization = syncStore.getState().synchronization!;

    syncStore.setState({
      synchronization: {
        ...synchronization,
        pendingCount: synchronization!.pendingCount - 1,
      },
    });
  };

  try {
    syncStore.setState({
      synchronization: {
        totalCount,
        pendingCount: totalCount,
        abortController,
      },
    });

    // we try until the queue is depleted, but no more than queue.length tries.
    for (let iter = 0; iter < maxIter && handlerQueue.length > 0; iter++) {
      for (let i = handlerQueue.length; i--; ) {
        const [name, handler] = handlerQueue[i];
        const deps = handler.dependsOn.map((dep) => promises[dep]);

        if (deps.every(Boolean)) {
          results[name] = {};
          await Promise.all(deps);

          promises[name] = processHandler(
            handler,
            results,
            abortController,
            notifySyncProgress
          );
          handlerQueue.splice(i, 1);
        }
      }
    }

    await Promise.allSettled(Object.values(promises));
  } finally {
    syncStore.setState({ synchronization: undefined });
  }
}

async function processHandler(
  { type, dependsOn, process }: SyncHandler,
  results: SyncResultBag,
  abortController: AbortController,
  notifySyncProgress: () => void
) {
  const items: Array<[number, unknown, QueueItemDescriptor]> = [];
  const contents: Array<unknown> = [];
  const userId = await getUserId();

  await db.syncQueue.where({ type, userId }).each((item, cursor) => {
    items.push([cursor.primaryKey, item.content, item.descriptor]);
    contents.push(item.content);
  });

  for (let i = 0; i < items.length; i++) {
    const [key, item, { id, dependencies = [] }] = items[i];

    try {
      const result = await process(item, {
        abort: abortController,
        index: i,
        items: contents,
        userId,
        dependencies: dependencies.map(({ id, type }) =>
          dependsOn.includes(type) ? results[type][id] : undefined
        ),
      });

      if (id !== undefined) {
        results[type][id] = result;
      }

      await db.syncQueue.delete(key);
    } catch (e) {
      await db.syncQueue.update(key, {
        lastError: {
          name: e?.name,
          message: e?.message ?? e?.toString(),
        },
      });
    } finally {
      notifySyncProgress();
    }
  }
}

async function getUserId() {
  const user = await getLoggedInUser();
  return user?.uuid || "*";
}

/**
 * Enqueues a new item in the sync queue for a specific user.
 * @param userId The user with whom the sync item should be associated with.
 * @param type The identifying type of the synchronization item.
 * @param content The actual data to be synchronized.
 * @param descriptor An optional descriptor providing additional metadata about the sync item.
 */
export async function queueSynchronizationItemFor<T>(
  userId: string,
  type: string,
  content: T,
  descriptor?: QueueItemDescriptor
) {
  const targetId = descriptor && descriptor.id;

  if (targetId !== undefined) {
    // in case of replacement (i.e., used same ID) we just remove the existing item
    await db.syncQueue
      .where({ type, userId })
      .filter((item) => item?.descriptor.id === targetId)
      .delete()
      .catch(Dexie.errnames.DatabaseClosed);
  }

  const id = await db.syncQueue
    .add({
      type,
      content,
      userId,
      descriptor: descriptor || {},
      createdOn: new Date(),
    })
    .catch(Dexie.errnames.DatabaseClosed, () => -1);

  return id;
}

/**
 * Enqueues a new item in the sync queue and associates the item with the currently signed in user.
 * @param type The identifying type of the synchronization item.
 * @param content The actual data to be synchronized.
 * @param descriptor An optional descriptor providing additional metadata about the sync item.
 */
export async function queueSynchronizationItem<T>(
  type: string,
  content: T,
  descriptor?: QueueItemDescriptor
) {
  const userId = await getUserId();
  return await queueSynchronizationItemFor(userId, type, content, descriptor);
}

/**
 * Returns the content of all currently queued up sync items of a given user.
 * @param userId The ID of the user whose synchronization items should be returned.
 * @param type The identifying type of the synchronization items to be returned..
 */
export async function getSynchronizationItemsFor<T>(
  userId: string,
  type?: string
) {
  const fullItems = await getFullSynchronizationItemsFor<T>(userId, type);
  return fullItems.map((item) => item.content);
}

/**
 * Returns all currently queued up sync items of a given user.
 * @param userId The ID of the user whose synchronization items should be returned.
 * @param type The identifying type of the synchronization items to be returned..
 */
export async function getFullSynchronizationItemsFor<T>(
  userId: string,
  type?: string
): Promise<Array<SyncItem<T>>> {
  const filter = type ? { type, userId } : { userId };
  return await db.syncQueue
    .where(filter)
    .toArray()
    .catch(Dexie.errnames.DatabaseClosed, () => []);
}

/**
 * Returns the content of all currently queued up sync items of the currently signed in user.
 * @param type The identifying type of the synchronization items to be returned.
 */
export async function getSynchronizationItems<T>(type?: string) {
  const userId = await getUserId();
  return await getSynchronizationItemsFor<T>(userId, type);
}

/**
 * Returns all currently queued up sync items of the currently signed in user.
 * @param type The identifying type of the synchronization items to be returned.
 */
export async function getFullSynchronizationItems<T>(type?: string) {
  const userId = await getUserId();
  return await getFullSynchronizationItemsFor<T>(userId, type);
}

/**
 * Returns a queued sync item with the given ID or `undefined` if no such item exists.
 * @param id The ID of the requested sync item.
 */
export async function getSynchronizationItem<T = any>(
  id: number
): Promise<SyncItem<T> | undefined> {
  return await db.syncQueue
    .get(id)
    .catch(Dexie.errnames.DatabaseClosed, () => undefined);
}

/**
 * Returns whether editing synchronization items of the given type is supported by the currently
 * registered synchronization handlers.
 * @param type The identifying type of the synchronization item which should be edited.
 */
export function canBeginEditSynchronizationItemsOfType(type: string) {
  // Editing an item can be requested as long as callback for this flow exists on the associated handler.
  return !!handlers[type]?.options.onBeginEditSyncItem;
}

/**
 * Triggers an edit flow for the given synchronization item.
 * If this is not possible, throws an error.
 * @param id The ID of the synchronization item to be edited.
 */
export async function beginEditSynchronizationItem(id: number) {
  const item = await getSynchronizationItem(id);
  if (!item) {
    throw new Error(`No sync item with the ID ${id} exists.`);
  }

  const editCallback = handlers[item.type]?.options.onBeginEditSyncItem;
  if (!editCallback) {
    throw new Error(
      `A sync item with the ID ${id} exists, but the associated handler (if one exists) doesn't support editing the item. You can avoid this error by either verifying that sync items of this type can be edited via the "canEditSynchronizationItemsOfType(type: string)" function or alternatively ensure that the synchronizaton handler for sync items of type "${item.type}" supports editing items.`
    );
  }

  editCallback(item);
}

/**
 * Deletes a queued up sync item with the given ID.
 * @param id The ID of the synchronization item to be deleted.
 */
export async function deleteSynchronizationItem(id: number) {
  await db.syncQueue.delete(id).catch(Dexie.errnames.DatabaseClosed);
}

/**
 * Registers a new synchronization handler which is able to synchronize data of a specific type.
 * @param type The identifying type of the synchronization items which can be handled by this handler.
 * @param dependsOn An array of other sync item types which must be synchronized before this handler
 *   can synchronize its own data. Items of these types are effectively dependencies of the data
 *   synchronized by this handler.
 * @param process A function which, when invoked, performs the actual client-server synchronization of the given
 *   `item` (which is the actual data to be synchronized).
 * @param options Additional options which can optionally be provided when setting up a synchronization callback
 *   for a specific synchronization item type.
 */
export function setupOfflineSync<T>(
  type: string,
  dependsOn: Array<string>,
  process: ProcessSyncItem<T>,
  options: SetupOfflineSyncOptions<T> = {}
) {
  handlers[type] = {
    type,
    dependsOn,
    process,
    options,
  };
}
