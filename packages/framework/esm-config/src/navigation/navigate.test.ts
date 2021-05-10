import { navigateToUrl } from "single-spa";
import { navigate } from "./navigate";

jest.mock("single-spa");
const mockNavigateToUrl = navigateToUrl as jest.Mock;

describe("navigate", () => {
  const originalWindowLocation = window.location;
  let mockLocationAssign;

  beforeAll(() => {
    delete (window as any).location;
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
    expect(navigateToUrl).toHaveBeenCalledWith("/openmrs/spa/foo/page");
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("uses single-spa navigateToUrl to navigate to interpolated SPA path", () => {
    navigate({ to: "${openmrsSpaBase}/bar/page" });
    expect(navigateToUrl).toHaveBeenCalledWith("/openmrs/spa/bar/page");
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("tolerates an extra inital slash", () => {
    navigate({ to: "/${openmrsSpaBase}/baz/page" });
    expect(navigateToUrl).toHaveBeenCalledWith("/openmrs/spa/baz/page");
    expect(window.location.assign).not.toHaveBeenCalled();
  });
});
