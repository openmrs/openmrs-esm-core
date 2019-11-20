import { isString, isBoolean } from "./validators";

describe("isString", () => {
  it("accepts strings", () => {
    expect(isString("")).toBeUndefined();
  });

  it("rejects non-strings", () => {
    expect(isString([""])).toMatch("must be a string");
  });
});

describe("isBoolean", () => {
  it("accepts bools", () => {
    expect(isBoolean(false)).toBeUndefined();
  });

  it("rejects non-bools", () => {
    expect(isBoolean(1)).toMatch("must be a bool");
  });
});
