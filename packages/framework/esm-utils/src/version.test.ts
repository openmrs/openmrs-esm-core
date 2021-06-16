import { isVersionSatisfied } from "./version";

describe("Version utilities", () => {
  it("Is satisfied if exactly equals", () => {
    const result = isVersionSatisfied("1.2.3", "1.2.3");
    expect(result).toBe(true);
  });

  it("Is satisfied if caret and minor change", () => {
    const result = isVersionSatisfied("^1.2.3", "1.3.0");
    expect(result).toBe(true);
  });

  it("Is not satisfied if exact and minor change", () => {
    const result = isVersionSatisfied("1.2.3", "1.3.0");
    expect(result).toBe(false);
  });

  it("Is not satisfied if caret and major change", () => {
    const result = isVersionSatisfied("^1.2.3", "2.0.0");
    expect(result).toBe(false);
  });

  it("Is satisfied if caret and minor change with prerelease", () => {
    const result = isVersionSatisfied("^1.2.3", "1.3.0-alpha.1");
    expect(result).toBe(true);
  });

  it("Is not satisfied if version equals same prerelease", () => {
    const result = isVersionSatisfied("^3.1.10", "3.1.10-pre.284");
    expect(result).toBe(false);
  });
});
