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

interface SyncResultBag {
  [type: string]: Record<string, any>;
}

interface SyncHandler {
  dependsOn: Array<string>;
  canHandle: () => Promise<boolean>;
  handle: (results: SyncResultBag, abort: AbortController) => Promise<void>;
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

export function getOfflineDb() {
  return db;
}

export interface OfflineSynchronizationStore {
  synchronization?: {
    total: number;
    pending: number;
    synchronized: number;
  };
}

const syncStore = createGlobalStore<OfflineSynchronizationStore>(
  "offline-synchronization",
  {}
);

export function getOfflineSynchronizationStore() {
  return syncStore;
}

export async function runSynchronization(
  abort: AbortController = new AbortController()
) {
  if (syncStore.getState().synchronization) {
    return;
  }

  const promises: Record<string, Promise<void>> = {};
  const queue = Object.entries(handlers);
  const maxIter = queue.length;
  const results: SyncResultBag = {};

  try {
    syncStore.setState({
      synchronization: {
        total: -1,
        pending: -1,
        synchronized: -1,
      },
    });

    // we try until the queue is depleted, but no more than queue.length tries.
    for (let iter = 0; iter < maxIter && queue.length > 0; iter++) {
      for (let i = queue.length; i--; ) {
        const [name, handler] = queue[i];
        const deps = handler.dependsOn.map((dep) => promises[dep]);

        if (deps.every(Boolean)) {
          results[name] = {};
          await Promise.all(deps);
          promises[name] = handler.handle(results, abort);
          queue.splice(i, 1);
        }
      }
    }

    await Promise.allSettled(Object.values(promises));
  } finally {
    syncStore.setState({ synchronization: undefined });
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
  process: (item: T, options: SyncProcessOptions<T>) => Promise<any>
) {
  const table = db.syncQueue;

  handlers[type] = {
    dependsOn,
    canHandle: async () => {
      const userId = await getUserId();
      const len = await table.where({ type, userId }).count();
      return len > 0;
    },
    handle: async (results, abort) => {
      const items: Array<[number, T, QueueItemDescriptor]> = [];
      const contents: Array<T> = [];
      const userId = await getUserId();

      await table.where({ type, userId }).each((item, cursor) => {
        items.push([cursor.primaryKey, item.content, item.descriptor]);
        contents.push(item.content);
      });

      for (let i = 0; i < items.length; i++) {
        const [key, item, { id, dependencies = [] }] = items[i];

        try {
          const result = await process(item, {
            abort,
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
        }
      }
    },
  };
}
