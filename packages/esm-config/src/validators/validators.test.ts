import {
  isString,
  isBoolean,
  isUuid,
  isObject,
  isUrl,
  isUrlWithTemplateParameters
} from "./validators";

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

describe("isUuid", () => {
  it("accepts a CIEL External ID", () => {
    expect(isUuid("123118AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")).toBeUndefined();
  });

  it("accepts a valid UUID with dashes", () => {
    expect(isUuid("28c37ff6-0079-4fa7-b803-5d547ac454e0")).toBeUndefined();
  });

  it("rejects a bad UUID", () => {
    expect(isUuid("28c37ff6-0079-4fa7-b803-5d547ac454e")).toMatch(
      "must be a valid UUID"
    );
  });

  it("rejects a bad CIEL External ID", () => {
    expect(isUuid("123118AAAAAAAAAAAAAAAAAAAAAAAAAAAAA")).toMatch(
      "must be a valid UUID"
    );
  });
});

describe("isObject", () => {
  it("accepts plain objects", () => {
    expect(isObject({})).toBeUndefined();
    expect(isObject({ foo: 0 })).toBeUndefined();
  });

  it("rejects arrays", () => {
    expect(isObject([])).toMatch(/must be an object/i);
  });

  it("rejects null", () => {
    expect(isObject(null)).toMatch(/must be an object/i);
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
