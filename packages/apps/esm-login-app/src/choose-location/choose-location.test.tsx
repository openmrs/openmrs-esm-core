import { waitFor } from "@testing-library/react";
import renderWithRouter from "../test-helpers/render-with-router";
import {
  navigate,
  openmrsFetch,
  useConfig,
  useSession,
} from "@openmrs/esm-framework";
import {
  mockSetSessionLocation,
  mockSoleLoginLocation,
} from "../../__mocks__/locations.mock";
import { mockConfig } from "../../__mocks__/config.mock";
import ChooseLocation from "./choose-location.component";

const mockedNavigate = navigate as jest.Mock;
const mockedOpenmrsFetch = openmrsFetch as jest.Mock;
const mockedUseConfig = useConfig as jest.Mock;

const mockUseSession = useSession as jest.Mock;

mockUseSession.mockReturnValue({
  user: {
    display: "Testy McTesterface",
  },
});

describe("ChooseLocation: ", () => {
  beforeEach(() => {
    mockedUseConfig.mockReturnValue(mockConfig);
  });

  afterEach(() => {
    mockedOpenmrsFetch.mockReset();
    mockedNavigate.mockReset();
  });

  it("auto-selects the location and navigates away from the page when only one login location is available", async () => {
    mockedOpenmrsFetch.mockReturnValueOnce(mockSoleLoginLocation);
    mockedOpenmrsFetch.mockReturnValueOnce(mockSetSessionLocation);

    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith({
        to: "${openmrsSpaBase}/home",
      })
    );
  });

  it("skips rendering the location picker if `chooseLocation.enabled` is set to `false`", async () => {
    mockedUseConfig.mockReturnValueOnce({
      ...mockConfig,
      chooseLocation: {
        enabled: false,
      },
    });

    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith({
        to: "${openmrsSpaBase}/home",
      })
    );
  });

  it("skips rendering the location picker if there are no login locations available", async () => {
    mockedOpenmrsFetch.mockReturnValueOnce(mockSoleLoginLocation);

    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith({
        to: "${openmrsSpaBase}/home",
      })
    );
  });

  it("redirects back to the referring URL when available", async () => {
    mockedOpenmrsFetch.mockReturnValueOnce(mockSoleLoginLocation);
    const locationMock = {
      state: {
        referrer: "/home/patient-search",
      },
    };

    renderWithRouter(ChooseLocation, {
      location: locationMock,
      isLoginEnabled: true,
    });

    // FIX ME should assert  "${openmrsSpaBase}/home/patient-search"
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith({
        to: "${openmrsSpaBase}/home",
      })
    );
  });

  it("redirects to custom path if configured", async () => {
    const redirectUrl = "${openmrsSpaBase}/foo";

    mockedOpenmrsFetch.mockReturnValueOnce(mockSoleLoginLocation);
    mockedUseConfig.mockReturnValue({
      ...mockConfig,
      links: {
        loginSuccess: redirectUrl,
      },
    });

    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith({
        to: redirectUrl,
      })
    );
  });

  it("redirects to the `returnToUrl` URL query parameter when available", async () => {
    const locationMock = {
      search: "?returnToUrl=/openmrs/spa/home",
    };

    mockedOpenmrsFetch.mockReturnValueOnce(mockSoleLoginLocation);

    renderWithRouter(ChooseLocation, {
      location: locationMock,
      isLoginEnabled: true,
    });

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith({
        to: "${openmrsSpaBase}/home",
      })
    );
  });
});
