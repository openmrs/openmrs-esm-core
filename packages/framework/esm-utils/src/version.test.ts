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

  it("Is satisfied if version equals higher with build number", () => {
    const result = isVersionSatisfied("^2.24.0", "2.30.0.7e24fb");
    expect(result).toBe(true);
  });

  it("Is satisfied if version equals higher with build number and pre", () => {
    const result = isVersionSatisfied("^2.24.0", "2.30.0.7e24fb-pre.3");
    expect(result).toBe(true);
  });

  it("Is not satisfied if version equals same with build number and pre", () => {
    const result = isVersionSatisfied("^2.24.0", "2.24.0.7e24fb-pre.3");
    expect(result).toBe(false);
  });

  it("Is satisfied if version equals same with only build number", () => {
    const result = isVersionSatisfied("^2.24.0", "2.24.0.7e24fb");
    expect(result).toBe(true);
  });

  it("Is satisfied with major version caret specifier and pre", () => {
    const result = isVersionSatisfied("^3", "3.1.14-pre.3");
  });

  it("Is satisfied with major version caret specifier and pre and a build number", () => {
    const result = isVersionSatisfied("^3", "3.1.14.7e24fb-pre.3");
  });

  it("Is satisfied with major version caret specifier and a build number", () => {
    const result = isVersionSatisfied("^3", "3.1.14.7e24fb");
  });
});
