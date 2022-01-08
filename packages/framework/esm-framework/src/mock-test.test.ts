/**
 * A test that validates that `@openmrs/esm-framework/mock` has
 * the same API as `@openmrs/esm-framework`.
 *
 * Disabled because the mock is nowhere close to having the same
 * API. You can change `xit` to `it` to run the test and see a
 * comparison of the exports of the two modules.
 */

import * as real from "./index";
import * as mock from "../mock";

describe("@openmrs/esm-framework/mock", () => {
  xit("should have the same exports as @openmrs/esm-framework", () => {
    expect(new Set(Object.keys(real))).toEqual(new Set(Object.keys(mock)));
  });
});
