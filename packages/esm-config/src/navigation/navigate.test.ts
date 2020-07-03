import { interpolateUrl, navigate } from "./navigate";
import { navigateToUrl } from "single-spa";

jest.mock("single-spa");
const mockNavigateToUrl = navigateToUrl as jest.Mock;

describe("navigate", () => {
  const originalWindowLocation = window.location;
  let mockLocationAssign;
  window.openmrsBase = "/openmrs";
  window.spaBase = "/spa";
  window.getOpenmrsSpaBase = () => "/openmrs/spa";

  beforeAll(() => {
    delete window.location;
    //@ts-ignore
    window.location = { assign: jest.fn() };
    mockLocationAssign = window.location.assign as jest.Mock;
  });

  beforeEach(() => {
    mockLocationAssign.mockClear();
    mockNavigateToUrl.mockClear();
  });

  afterAll(() => {
    window.location = originalWindowLocation;
  });

  it("uses location.assign() to navigate to non-SPA path literal", () => {
    navigate({ to: "/some/path" });
    expect(window.location.assign).toHaveBeenCalledWith("/some/path");
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it("uses location.assign() to navigate to non-SPA absolute path literal", () => {
    navigate({ to: "https://single-spa.js.org/" });
    expect(window.location.assign).toHaveBeenCalledWith(
      "https://single-spa.js.org/"
    );
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it("uses location.assign() to navigate to non-SPA interpolated path", () => {
    navigate({ to: "${openmrsBase}/some/path" });
    expect(window.location.assign).toHaveBeenCalledWith("/openmrs/some/path");
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it("uses single-spa navigateToUrl to navigate to SPA path literal", () => {
    navigate({ to: "/openmrs/spa/foo/page" });
    expect(navigateToUrl).toHaveBeenCalledWith("/foo/page");
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("uses single-spa navigateToUrl to navigate to interpolated SPA path", () => {
    navigate({ to: "${openmrsSpaBase}/bar/page" });
    expect(navigateToUrl).toHaveBeenCalledWith("/bar/page");
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("tolerates an extra inital slash", () => {
    navigate({ to: "/${openmrsSpaBase}/baz/page" });
    expect(navigateToUrl).toHaveBeenCalledWith("/baz/page");
    expect(window.location.assign).not.toHaveBeenCalled();
  });
});

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
