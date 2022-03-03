import "@testing-library/jest-dom";
import { waitFor } from "@testing-library/react";
import { navigate, useConfig } from "@openmrs/esm-framework";
import { queryLocations } from "./choose-location.resource";
import { mockConfig } from "../../__mocks__/config.mock";
import ChooseLocation from "./choose-location.component";
import renderWithRouter from "../test-helpers/render-with-router";

const navigateMock = navigate as jest.Mock;
const mockedQueryLocations = queryLocations as jest.Mock;
const mockedUseConfig = useConfig as jest.Mock;

jest.mock("../CurrentUserContext", () => ({
  useCurrentUser() {
    return {
      display: "Demo",
    };
  },
}));

jest.mock("./choose-location.resource.ts", () => ({
  queryLocations: jest.fn().mockResolvedValue([
    {
      resource: {
        id: "abc",
        name: "foo",
      },
    },
  ]),
}));

describe(`<ChooseLocation />`, () => {
  beforeEach(() => {
    mockedUseConfig.mockReturnValue(mockConfig);
  });

  afterEach(() => {
    navigateMock.mockClear();
  });

  it(`should redirect back to referring page on successful login when there is only one location`, async () => {
    const locationMock = {
      state: {
        referrer: "/home/patient-search",
      },
    };

    renderWithRouter(ChooseLocation, {
      location: locationMock,
      isLoginEnabled: true,
    });

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({
        to: "${openmrsSpaBase}" + locationMock.state.referrer,
      })
    );
  });

  it(`should set location and skip location select page if there is exactly one location`, async () => {
    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: "${openmrsSpaBase}/home" })
    );
  });

  it(`should set location and skip location select page if there is no location`, async () => {
    mockedQueryLocations.mockResolvedValueOnce([]);

    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: "${openmrsSpaBase}/home" })
    );
  });

  it(`should show the location picker when multiple locations exist`, async () => {
    mockedQueryLocations.mockResolvedValueOnce([
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
    ]);

    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() => expect(navigate).not.toHaveBeenCalled());
  });

  it(`should not show the location picker when disabled`, async () => {
    mockedUseConfig.mockReturnValue({
      ...mockConfig,
      chooseLocation: {
        enabled: false,
      },
    });

    mockedQueryLocations.mockResolvedValueOnce([
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
    ]);

    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: "${openmrsSpaBase}/home" })
    );
  });

  it(`should redirect to custom path if configured`, async () => {
    mockedUseConfig.mockReturnValue({
      ...mockConfig,
      links: {
        loginSuccess: "${openmrsSpaBase}/foo",
      },
    });

    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: "${openmrsSpaBase}/foo" })
    );
  });

  it(`should redirect back to returnUrl when provided`, async () => {
    const locationMock = {
      search: "?returnToUrl=/openmrs/spa/home",
    };

    renderWithRouter(ChooseLocation, {
      location: locationMock,
      isLoginEnabled: true,
    });

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({
        to: "/openmrs/spa/home",
      })
    );
  });
});
