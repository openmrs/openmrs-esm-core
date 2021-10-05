import Dexie, { Table } from "dexie";
import { getLoggedInUser } from "@openmrs/esm-api";
import { createGlobalStore } from "@openmrs/esm-state";

export interface SyncItem {
  id?: number;
  userId: string;
  type: string;
  content: any;
  createdOn: Date;
  descriptor: QueueItemDescriptor;
  lastError?: {
    name?: string;
    message?: string;
  };
}

export interface QueueItemDescriptor {
  id?: string;
  dependencies?: Array<{
    id: string;
    type: string;
  }>;
  patientUuid?: string;
  displayName?: string;
}

export type ProcessSyncItem<T> = (
  item: T,
  options: SyncProcessOptions<T>
) => Promise<any>;

interface SyncResultBag {
  [type: string]: Record<string, any>;
}

interface SyncHandler {
  type: string;
  dependsOn: Array<string>;
  process: ProcessSyncItem<unknown>;
}

class OfflineDb extends Dexie {
  syncQueue: Table<SyncItem, number>;

  constructor() {
    super("EsmOffline");

    this.version(3).stores({
      syncQueue: "++id,userId,type,[userId+type]",
    });

    this.syncQueue = this.table("syncQueue");
  }
}

const db = new OfflineDb();
const handlers: Record<string, SyncHandler> = {};

/**
 * @internal Temporarily added for esm-offline-tools-app. Please don't use elsewhere.
 */
export function getOfflineDb() {
  return db;
}

export interface OfflineSynchronizationStore {
  synchronization?: {
    totalCount: number;
    pendingCount: number;
    abortController: AbortController;
  };
}

const syncStore = createGlobalStore<OfflineSynchronizationStore>(
  "offline-synchronization",
  {}
);

export function getOfflineSynchronizationStore() {
  return syncStore;
}

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
  const table = db.syncQueue;
  const items: Array<[number, unknown, QueueItemDescriptor]> = [];
  const contents: Array<unknown> = [];
  const userId = await getUserId();

  await table.where({ type, userId }).each((item, cursor) => {
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

      await table.delete(key);
    } catch (e) {
      await table.update(key, {
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

export async function queueSynchronizationItemFor<T>(
  userId: string,
  type: string,
  content: T,
  descriptor?: QueueItemDescriptor
) {
  const table = db.syncQueue;
  const targetId = descriptor && descriptor.id;

  if (targetId !== undefined) {
    // in case of replacement (i.e., used same ID) we just remove the existing item
    await table
      .where({ type, userId })
      .filter((item) => item?.descriptor.id === targetId)
      .delete();
  }

  const id = await table.add({
    type,
    content,
    userId,
    descriptor: descriptor || {},
    createdOn: new Date(),
  });

  return id;
}

export async function queueSynchronizationItem<T>(
  type: string,
  content: T,
  descriptor?: QueueItemDescriptor
) {
  const userId = await getUserId();
  return await queueSynchronizationItemFor(userId, type, content, descriptor);
}

export async function getSynchronizationItemsFor<T>(
  userId: string,
  type: string
) {
  const table = db.syncQueue;
  const items: Array<T> = [];

  await table.where({ type, userId }).each((item) => {
    items.push(item.content);
  });

  return items;
}

export async function getSynchronizationItems<T>(type: string) {
  const userId = await getUserId();
  return await getSynchronizationItemsFor<T>(userId, type);
}

export async function deleteSynchronizationItem(id: number) {
  await db.syncQueue.delete(id);
}

export interface SyncProcessOptions<T> {
  abort: AbortController;
  userId: string;
  index: number;
  items: Array<T>;
  dependencies: Array<any>;
}

export function setupOfflineSync<T>(
  type: string,
  dependsOn: Array<string>,
  process: ProcessSyncItem<T>
) {
  handlers[type] = {
    type,
    dependsOn,
    process,
  };
}
