import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import { cleanup, wait } from "@testing-library/react";
import { navigate } from "@openmrs/esm-framework";
import { useLocation } from "./choose-location.resource";
import ChooseLocation from "./choose-location.component";
import renderWithRouter from "../test-helpers/render-with-router";

const navigateMock = navigate as jest.Mock;

const { config } = require("@openmrs/esm-framework");

jest.mock("../CurrentUserContext", () => ({
  useCurrentUser() {
    return {
      display: "Demo",
    };
  },
}));

jest.mock("./choose-location.resource.ts", () => ({
  useLocation: jest.fn(() => ({
    data: [
      {
        resource: {
          id: "abc",
          name: "foo",
        },
      },
    ],
    isLoading: false,
    previousLink: undefined,
    nextLink: undefined,
  })),
}));

describe(`<ChooseLocation />`, () => {
  afterEach(() => {
    navigateMock.mockClear();
  });

  it(`should redirect back to referring page on successful login when there is only one location`, async () => {
    const locationMock = {
      state: {
        referrer: "/home/patient-search",
      },
    };
    cleanup();
    renderWithRouter(ChooseLocation, {
      location: locationMock,
      isLoginEnabled: true,
    });
    await act(wait);
    expect(navigate).toHaveBeenCalledWith({
      to: "${openmrsSpaBase}" + locationMock.state.referrer,
    });
  });

  it(`should set location and skip location select page if there is exactly one location`, async () => {
    cleanup();
    renderWithRouter(ChooseLocation, { isLoginEnabled: true });
    await act(wait);
    expect(navigate).toHaveBeenCalledWith({ to: "${openmrsSpaBase}/home" });
  });

  it(`should set location and skip location select page if there is no location`, async () => {
    cleanup();
    (useLocation as any).mockImplementationOnce(() => ({
      data: [],
      isLoading: false,
      previousLink: undefined,
      nextLink: undefined,
    }));
    renderWithRouter(ChooseLocation, { isLoginEnabled: true });
    await act(wait);
    expect(navigate).toHaveBeenCalledWith({ to: "${openmrsSpaBase}/home" });
  });

  it(`should show the location picker when multiple locations exist`, async () => {
    cleanup();
    (useLocation as any).mockImplementationOnce(() => ({
      data: [
        {
          resource: {
            id: "abc",
            name: "foo",
          },
        },
        {
          resource: {
            id: "def",
            name: "ghi",
          },
        },
      ],
      isLoading: false,
      previousLink: undefined,
      nextLink: undefined,
    }));
    renderWithRouter(ChooseLocation, { isLoginEnabled: true });
    await act(wait);
    expect(navigate).not.toHaveBeenCalled();
  });

  it(`should not show the location picker when disabled`, async () => {
    cleanup();
    config.chooseLocation.enabled = false;
    (useLocation as any).mockImplementationOnce(() => ({
      data: [
        {
          resource: {
            id: "abc",
            name: "foo",
          },
        },
        {
          resource: {
            id: "def",
            name: "ghi",
          },
        },
      ],
      isLoading: false,
      previousLink: undefined,
      nextLink: undefined,
    }));
    const wrapper = renderWithRouter(ChooseLocation, { isLoginEnabled: true });
    await act(wait);
    expect(navigate).toHaveBeenCalledWith({ to: "${openmrsSpaBase}/home" });
  });

  it(`should redirect to custom path if configured`, async () => {
    cleanup();
    config.links.loginSuccess = "${openmrsSpaBase}/foo";
    const wrapper = renderWithRouter(ChooseLocation, { isLoginEnabled: true });
    await act(wait);
    expect(navigate).toHaveBeenCalledWith({ to: "${openmrsSpaBase}/foo" });
  });

  it(`should redirect back to returnUrl when provided`, async () => {
    const locationMock = {
      search: "?returnToUrl=/openmrs/spa/home",
    };
    cleanup();
    renderWithRouter(ChooseLocation, {
      location: locationMock,
      isLoginEnabled: true,
    });
    await act(wait);
    expect(navigate).toHaveBeenCalledWith({
      to: "/openmrs/spa/home",
    });
  });
});
