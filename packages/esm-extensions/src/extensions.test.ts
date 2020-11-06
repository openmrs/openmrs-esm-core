import { getExtensionSlotConfig } from "@openmrs/esm-config";
import {
  attach,
  getAttachedExtensionInfoForSlotAndConfig,
  reset,
} from "./extensions";

const mockGetExtensionSlotConfig = getExtensionSlotConfig as jest.Mock;

describe("getAttachedExtensionInfoForSlotAndConfig", () => {
  afterEach(() => {
    reset();
  });

  it("returns attached extensions for extension slots", async () => {
    attach("slotski", "foo");
    attach("slotski", "bar");
    attach("slotso", "foo");

    const res1 = await getAttachedExtensionInfoForSlotAndConfig(
      "slotski",
      "moddy"
    );
    expect(res1).toStrictEqual([
      {
        actualExtensionSlotName: "slotski",
        attachedExtensionSlotName: "slotski",
        extensionId: "foo",
      },
      {
        actualExtensionSlotName: "slotski",
        attachedExtensionSlotName: "slotski",
        extensionId: "bar",
      },
    ]);

    const res2 = await getAttachedExtensionInfoForSlotAndConfig(
      "slotso",
      "moddy"
    );
    expect(res2).toStrictEqual([
      {
        extensionId: "foo",
        attachedExtensionSlotName: "slotso",
        actualExtensionSlotName: "slotso",
      },
    ]);
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
    const res = await getAttachedExtensionInfoForSlotAndConfig(
      "slotski",
      "moddy"
    );
    expect(res.map((x) => x.extensionId)).toStrictEqual([
      "baz",
      "quinn",
      "qux",
      "foo",
    ]);
  });
});
