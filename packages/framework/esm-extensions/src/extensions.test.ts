import { attach, registerExtensionSlot } from "./extensions";

describe("extensions system", () => {
  it("shouldn't crash when a slot is registered before the extensions that go in it", () => {
    attach("mario-slot", "mario-hat");
    expect(() =>
      registerExtensionSlot("mario-module", "mario-slot")
    ).not.toThrow();
  });
});
