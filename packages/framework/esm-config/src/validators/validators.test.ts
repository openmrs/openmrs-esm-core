import {
  inRange,
  isUrl,
  isUrlWithTemplateParameters,
  oneOf,
} from "./validators";

describe("all validators", () => {
  it("fail on undefined", () => {
    expect(inRange(0, 10)(undefined)).toMatch(/.*/);
    expect(isUrl(undefined)).toMatch(/.*/);
    expect(isUrlWithTemplateParameters(["foo"])(undefined)).toMatch(/.*/);
    expect(oneOf(["foo", "bar"])(undefined)).toMatch(/.*/);
  });
});

describe("isUrl", () => {
  it("accepts a string with valid URL parameters", () => {
    expect(isUrl("${openmrsSpaBase}/${openmrsBase}/thing")).toBeUndefined();
  });

  it("accepts a string with no parameters", () => {
    expect(isUrl("/thing")).toBeUndefined();
  });

  it("rejects a string with unknkown URL parameters", () => {
    expect(isUrl("${foo}/bad")).toMatch(
      /allowed template parameters are \${openmrsBase}, \${openmrsSpaBase}/i
    );
  });
});

describe("oneOf", () => {
  it("accepts one of the valid options", () => {
    expect(oneOf(["foo", "bar"])("foo")).toBeUndefined();
  });

  it("rejects anything else", () => {
    expect(oneOf(["foo", "bar"])("baz")).toMatch(/one of.*foo.*bar/i);
  });
});
