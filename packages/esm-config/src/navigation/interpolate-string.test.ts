import { interpolateString, interpolateUrl } from "./interpolate-string";

describe("interpolateUrl", () => {
  it("interpolates URL template elements", () => {
    const result = interpolateUrl("test ${openmrsBase} ${openmrsSpaBase} ok");
    expect(result).toBe("test /openmrs /openmrs/spa ok");
  });

  it("works when no interpolation needed", () => {
    const result = interpolateUrl("test ok");
    expect(result).toBe("test ok");
  });
});

describe("interpolateString", () => {
  it("interpolates template elements", () => {
    const result = interpolateString("test ${one} ${two} 3", {
      one: 1,
      two: 2
    });
    expect(result).toBe("test 1 2 3");
  });

  it("tolerates extra parameters", () => {
    const result = interpolateString("test ok", { one: 1, two: 2 });
    expect(result).toBe("test ok");
  });
});
