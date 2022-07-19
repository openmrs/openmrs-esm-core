import { createGlobalStore } from "@openmrs/esm-state";
import { attach, registerExtensionSlot } from "./extensions";

const mockSessionStore = createGlobalStore("mock-session-store", {
  loaded: false,
  session: null,
});

jest.mock("@openmrs/esm-api", () => ({
  getSessionStore: jest.fn(() => mockSessionStore),
}));

describe("extensions system", () => {
  it("shouldn't crash when a slot is registered before the extensions that go in it", () => {
    attach("mario-slot", "mario-hat");
    expect(() =>
      registerExtensionSlot("mario-module", "mario-slot")
    ).not.toThrow();
  });
});
