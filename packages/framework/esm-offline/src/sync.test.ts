import "fake-indexeddb/auto";
import { getLoggedInUser } from "@openmrs/esm-api";
import {
  getFullSynchronizationItems,
  getFullSynchronizationItemsFor,
  getSynchronizationItems,
  getSynchronizationItemsFor,
  QueueItemDescriptor,
  queueSynchronizationItem,
  queueSynchronizationItemFor,
  deleteSynchronizationItem,
  getSynchronizationItem,
} from "./sync";
import { OfflineDb } from "./offline-db";

interface MockSyncItem {
  value: number;
}

const systemTime = new Date();
const mockUserId = "00000000-0000-0000-0000-000000000000";
const mockSyncItemType = "mock-sync-item";
const defaultMockSyncItem: MockSyncItem = {
  value: 123,
};
const defaultMockSyncItemDescriptor: QueueItemDescriptor = {
  dependencies: [],
  id: "123",
  displayName: "Mock Sync Item",
  patientUuid: "00000000-0000-0000-0000-000000000001",
};

jest.mock("@openmrs/esm-api", () => ({
  getLoggedInUser: jest.fn(async () => ({ uuid: mockUserId })),
}));

afterEach(async () => {
  // We want each test case to start fresh with a clean sync queue.
  await new OfflineDb().syncQueue.clear();
});

describe("Sync Queue", () => {
  beforeAll(() => {
    // We want to control the timers to ensure that we can test the `createdOn` attribute
    // of the sync item (which is created using `new Date()`).
    jest.useFakeTimers();
    jest.setSystemTime(systemTime);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("enqueues sync item with expected attributes", async () => {
    const id = await queueSynchronizationItemFor(
      mockUserId,
      mockSyncItemType,
      defaultMockSyncItem,
      defaultMockSyncItemDescriptor
    );
    const queuedItems = await getFullSynchronizationItemsFor<MockSyncItem>(
      mockUserId,
      mockSyncItemType
    );

    expect(queuedItems).toHaveLength(1);
    expect(queuedItems[0].id).toBe(id);
    expect(queuedItems[0].type).toBe(mockSyncItemType);
    expect(queuedItems[0].userId).toBe(mockUserId);
    expect(queuedItems[0].createdOn).toStrictEqual(systemTime);
    expect(queuedItems[0].content).toStrictEqual(defaultMockSyncItem);
    expect(queuedItems[0].descriptor).toStrictEqual(
      defaultMockSyncItemDescriptor
    );
  });

  it("allows querying for items of all types at once", async () => {
    await queueSynchronizationItem("type-a", defaultMockSyncItem);
    await queueSynchronizationItem("type-b", defaultMockSyncItem);
    const queuedItems = await getFullSynchronizationItems();
    expect(queuedItems).toHaveLength(2);
  });
});

describe("Logged-in user specific functions", () => {
  it("enqueue and return sync items of currently logged-in user", async () => {
    const loggedInUserId = (await getLoggedInUser()).uuid;
    await queueSynchronizationItem(mockSyncItemType, defaultMockSyncItem);
    const queuedItems = await getFullSynchronizationItems(mockSyncItemType);

    expect(queuedItems).toHaveLength(1);
    expect(queuedItems[0].userId).toBe(loggedInUserId);
  });
});

describe("getSynchronizationItems", () => {
  it("returns `content` of corresponding `getFullSynchronizationItems` call", async () => {
    await queueSynchronizationItem(mockSyncItemType, defaultMockSyncItem);
    const items = await getSynchronizationItems(mockSyncItemType);
    const fullItems = await getFullSynchronizationItems(mockSyncItemType);
    expect(items).toHaveLength(1);
    expect(fullItems).toHaveLength(1);
    expect(items[0]).toStrictEqual(fullItems[0].content);
  });
});

describe("getSynchronizationItemsFor", () => {
  it("returns `content` of corresponding `getFullSynchronizationItemsFor` call", async () => {
    await queueSynchronizationItemFor(
      mockUserId,
      mockSyncItemType,
      defaultMockSyncItem
    );
    const items = await getSynchronizationItemsFor(
      mockUserId,
      mockSyncItemType
    );
    const fullItems = await getFullSynchronizationItemsFor(
      mockUserId,
      mockSyncItemType
    );

    expect(items).toHaveLength(1);
    expect(fullItems).toHaveLength(1);
    expect(items[0]).toStrictEqual(fullItems[0].content);
  });
});

describe("getSynchronizationItem", () => {
  it("returns the specific sync item with given ID", async () => {
    const id = await queueSynchronizationItem(
      mockSyncItemType,
      defaultMockSyncItem
    );
    const items = await getFullSynchronizationItems(mockSyncItemType);
    const item = await getSynchronizationItem(id);
    expect(item).toStrictEqual(items[0]);
  });

  it("returns undefined when no item with given ID exists", async () => {
    const item = await getSynchronizationItem(404);
    expect(item).toBeUndefined();
  });
});

describe("deleteSynchronizationItem", () => {
  it("deletes sync item with given ID", async () => {
    const id = await queueSynchronizationItem(
      mockSyncItemType,
      defaultMockSyncItem
    );
    await deleteSynchronizationItem(id);
    const items = await getSynchronizationItems(mockSyncItemType);
    expect(items).toHaveLength(0);
  });

  it("does not throw when no item with given ID exists", async () => {
    await deleteSynchronizationItem(404);
  });
});
