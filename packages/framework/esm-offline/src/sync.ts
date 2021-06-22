import Dexie, { Table } from "dexie";
import { showNotification } from "@openmrs/esm-styleguide";
import { getLoggedInUser } from "@openmrs/esm-api";

interface SyncItem {
  userId: string;
  type: string;
  content: any;
  descriptor: Partial<QueueItemDescriptor>;
}

export interface QueueItemDescriptor {
  id: string;
  dependencies: Array<{
    id: string;
    type: string;
  }>;
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

    this.version(1).stores({
      syncQueue: "++id, [userId+type]",
    });

    this.syncQueue = this.table("syncQueue");
  }
}

const db = new OfflineDb();
const handlers: Record<string, SyncHandler> = {};

function runSynchronization(abort: AbortController) {
  const promises: Record<string, Promise<void>> = {};
  const queue = Object.entries(handlers);
  const maxIter = queue.length;
  const results: SyncResultBag = {};

  // we try until the queue is depleted, but no more than queue.length tries.
  for (let iter = 0; iter < maxIter && queue.length > 0; iter++) {
    for (let i = queue.length; i--; ) {
      const [name, handler] = queue[i];
      const deps = handler.dependsOn.map((dep) => promises[dep]);

      if (deps.every(Boolean)) {
        results[name] = {};
        promises[name] = Promise.all(deps).then(() =>
          handler.handle(results, abort)
        );
        queue.splice(i, 1);
      }
    }
  }

  return Promise.allSettled(Object.values(promises));
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
  const id = await db.syncQueue.add({
    type,
    content,
    userId,
    descriptor: descriptor || {},
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

export async function triggerSynchronization(abort: AbortController) {
  const activeHandlers = await Promise.all(
    Object.keys(handlers).map((name) => handlers[name].canHandle())
  );
  const canSync = activeHandlers.some((active) => active);

  if (canSync) {
    showNotification({
      title: "Synchronizing Offline Changes",
      description:
        "Synchronizing the changes you have made offline. This may take a while...",
      kind: "info",
    });

    await runSynchronization(abort);

    showNotification({
      title: "Offline Synchronization Finished",
      description:
        "Finished synchronizing the changes you have made while offline.",
      kind: "success",
    });
  }
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
      const items: Array<[number, T, Partial<QueueItemDescriptor>]> = [];
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
        } catch {
          //TODO handle failure case
        }
      }
    },
  };
}
