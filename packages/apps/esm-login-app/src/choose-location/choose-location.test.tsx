import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import renderWithRouter from "../test-helpers/render-with-router";
import { navigate, openmrsFetch, useConfig } from "@openmrs/esm-framework";
import { mockLoginLocations } from "../../__mocks__/locations.mock";
import { mockConfig } from "../../__mocks__/config.mock";
import ChooseLocation from "./choose-location.component";

const mockedNavigate = navigate as jest.Mock;
const mockedOpenmrsFetch = openmrsFetch as jest.Mock;
const mockedUseConfig = useConfig as jest.Mock;

const mockSoleLoginLocation = {
  data: {
    id: "301b3ad6-868a-48a6-bc3f-aaa8aa3f891z",
    total: 1,
    link: [
      {
        relation: "self",
        url: "http://openmrs:8080/openmrs/ws/fhir2/R4/Location?_count=50&_summary=data&_tag=login%20location",
      },
    ],
    entry: [
      {
        resource: {
          id: "44c3efb0-2583-4c80-a79e-1f756a03c0a1",
          status: "active",
          name: "Outpatient Clinic",
          description: "Outpatient Clinic",
        },
      },
    ],
  },
};

jest.mock("../CurrentUserContext", () => ({
  useCurrentUser() {
    return {
      display: "Testy McTesterface",
    };
  },
}));

describe("ChooseLocation: ", () => {
  beforeEach(() => {
    mockedUseConfig.mockReturnValue(mockConfig);
    mockedOpenmrsFetch.mockReturnValue(mockLoginLocations);
  });

  it("renders a location picker showing a list of the available login locations", async () => {
    const locationMock = {
      state: {
        referrer: "/home/patient-search",
      },
    };

    renderWithRouter(ChooseLocation, {
      location: locationMock,
      isLoginEnabled: true,
    });

    await waitForLoadingToFinish();

    const searchbox = screen.getByRole("search", {
      name: /search for a location/i,
    });
    expect(searchbox).toBeInTheDocument();
    expect(screen.getByText(/welcome testy mctesterface/i)).toBeInTheDocument();
    expect(
      screen.getByText(/select your location from the list below/i)
    ).toBeInTheDocument();

    const loginLocations = mockLoginLocations.data.entry.map(
      (entry) => entry.resource.name
    );
    loginLocations.map((location) =>
      expect(screen.getByRole("radio", { name: location })).toBeInTheDocument()
    );

    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
  });

  it("auto-selects the location and navigates away from the page when only one login location is available", async () => {
    mockedOpenmrsFetch.mockReturnValue(mockSoleLoginLocation);

    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith({
        to: "${openmrsSpaBase}/home",
      })
    );
  });

  it("skips rendering the location picker if `chooseLocation.enabled` is set to `false`", async () => {
    mockedUseConfig.mockReturnValue({
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
    mockedOpenmrsFetch.mockReturnValue({
      data: {
        id: "301b3ad6-868a-48a6-bc3f-aaa8aa3f891z",
        total: 0,
        link: [
          {
            relation: "self",
            url: "http://openmrs:8080/openmrs/ws/fhir2/R4/Location?_count=50&_summary=data&_tag=login%20location",
          },
        ],
        entry: [],
      },
    });

    renderWithRouter(ChooseLocation, { isLoginEnabled: true });

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith({
        to: "${openmrsSpaBase}/home",
      })
    );
  });

  it("redirects back to the referring URL when available", async () => {
    mockedUseConfig.mockReturnValue(mockConfig);
    mockedOpenmrsFetch.mockReturnValue(mockSoleLoginLocation);

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
      expect(mockedNavigate).toHaveBeenCalledWith({
        to: "${openmrsSpaBase}" + locationMock.state.referrer,
      })
    );
  });

  it("redirects to custom path if configured", async () => {
    const redirectUrl = "${openmrsSpaBase}/foo";

    mockedOpenmrsFetch.mockReturnValue(mockSoleLoginLocation);
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

    mockedOpenmrsFetch.mockReturnValue(mockSoleLoginLocation);
    mockedUseConfig.mockReturnValue(mockConfig);

    renderWithRouter(ChooseLocation, {
      location: locationMock,
      isLoginEnabled: true,
    });

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith({
        to: "/openmrs/spa/home",
      })
    );
  });
});

function waitForLoadingToFinish() {
  return waitForElementToBeRemoved(
    () => [...screen.queryAllByRole(/progressbar/i)],
    {
      timeout: 4000,
    }
  );
}
