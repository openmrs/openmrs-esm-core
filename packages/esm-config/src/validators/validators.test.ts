import { isUrl, isUrlWithTemplateParameters } from "./validators";

describe("all validators", () => {
  it("fail on undefined", () => {
    expect(isUrl(undefined)).toMatch(/.*/);
    expect(isUrlWithTemplateParameters(["foo"])(undefined)).toMatch(/.*/);
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
