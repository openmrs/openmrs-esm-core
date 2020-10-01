import { getExtensionSlotConfig } from "@openmrs/esm-config";
import { attach, getExtensionNamesForExtensionSlot, reset } from "./extensions";

const mockGetExtensionSlotConfig = getExtensionSlotConfig as jest.Mock;

describe("getExtensionNamesForExtensionSlot", () => {
  afterEach(() => {
    reset();
  });

  it("returns attached extensions for extension slots", async () => {
    attach("slotski", "foo");
    attach("slotski", "bar");
    attach("slotso", "foo");
    const res1 = await getExtensionNamesForExtensionSlot("slotski", "moddy");
    expect(res1).toStrictEqual(["foo", "bar"]);
    const res2 = await getExtensionNamesForExtensionSlot("slotso", "moddy");
    expect(res2).toStrictEqual(["foo"]);
  });

  it("respects add, remove, and order elements of configuration", async () => {
    attach("slotski", "foo");
    attach("slotski", "bar");
    attach("slotski", "baz");
    attach("slotski", "qux");
    mockGetExtensionSlotConfig.mockImplementation((slotName, modName) =>
      modName == "moddy" && slotName == "slotski"
        ? {
            add: ["quinn"],
            remove: ["bar"],
            order: ["baz", "quinn", "qux"],
          }
        : {}
    );
    const res = await getExtensionNamesForExtensionSlot("slotski", "moddy");
    expect(res).toStrictEqual(["baz", "quinn", "qux", "foo"]);
  });
});
