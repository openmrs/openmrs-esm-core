import "fake-indexeddb/auto";
import { OfflineDb } from "./offline-db";
import {
  getDynamicOfflineDataEntries,
  getDynamicOfflineDataEntriesFor,
  putDynamicOfflineData,
  putDynamicOfflineDataFor,
  removeDynamicOfflineData,
  removeDynamicOfflineDataFor,
} from "./dynamic-offline-data";

const mockUserId = "00000000-0000-0000-0000-000000000000";

jest.mock("@openmrs/esm-api", () => ({
  getLoggedInUser: jest.fn(async () => ({ uuid: mockUserId })),
}));

afterEach(async () => {
  // We want each test case to start fresh with a clean sync queue.
  await new OfflineDb().dynamicOfflineData.clear();
});

describe("putDynamicOfflineData", () => {
  it("creates new entry if none exists yet", async () => {
    await putDynamicOfflineData("test", "123");

    const entries = await getDynamicOfflineDataEntries("test");
    expect(entries).toHaveLength(1);
    expect(entries[0].type).toBe("test");
    expect(entries[0].identifier).toBe("123");
    expect(entries[0].users).toStrictEqual([mockUserId]);
  });

  it("does not create new entry if type+identifier combination already exists", async () => {
    await putDynamicOfflineData("test", "123");
    await putDynamicOfflineData("test", "123");

    const entries = await getDynamicOfflineDataEntries("test");
    expect(entries).toHaveLength(1);
  });

  it("combines users if entry is already registered for other user", async () => {
    await putDynamicOfflineDataFor("user-id-1", "test", "123");
    await putDynamicOfflineDataFor("user-id-2", "test", "123");

    const entries = await getDynamicOfflineDataEntriesFor("user-id-1", "test");
    expect(entries).toHaveLength(1);
    expect(entries[0].users).toStrictEqual(["user-id-1", "user-id-2"]);
  });
});

describe("removeDynamicOfflineData", () => {
  it("removes entry of single user", async () => {
    await putDynamicOfflineData("test", "123");
    await removeDynamicOfflineData("test", "123");
    const entries = await getDynamicOfflineDataEntries("test");
    expect(entries).toHaveLength(0);
  });

  it("removes calling user of entry with multiple users", async () => {
    await putDynamicOfflineDataFor("user-id-1", "test", "123");
    await putDynamicOfflineDataFor("user-id-2", "test", "123");
    await removeDynamicOfflineDataFor("user-id-1", "test", "123");

    const entries = await getDynamicOfflineDataEntriesFor("user-id-2", "test");
    expect(entries).toHaveLength(1);
    expect(entries[0].users).toStrictEqual(["user-id-2"]);
  });
});
