import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { openmrsFetch, useConfig, useSession } from "@openmrs/esm-framework";
import { mockLoginLocations } from "../../__mocks__/locations.mock";
import { mockConfig } from "../../__mocks__/config.mock";
import renderWithRouter from "../test-helpers/render-with-router";
import LocationPicker from "./location-picker.component";

const mockedOpenmrsFetch = openmrsFetch as jest.Mock;
const mockedUseConfig = useConfig as jest.Mock;
const mockUseSession = useSession as jest.Mock;

mockedUseConfig.mockReturnValue(mockConfig);
mockUseSession.mockReturnValue({
  user: {
    display: "Testy McTesterface",
  },
});
mockedOpenmrsFetch.mockReturnValue(mockLoginLocations);

describe("LocationPicker", () => {
  it("renders a list of login locations", async () => {
    renderWithRouter(LocationPicker, {
      currentLocationUuid: "some-location-uuid",
      hideWelcomeMessage: false,
      isLoginEnabled: true,
    });

    await waitForElementToBeRemoved(
      () => [...screen.queryAllByRole(/progressbar/i)],
      {
        timeout: 4000,
      }
    );

    expect(screen.getByText(/welcome testy mctesterface/i)).toBeInTheDocument();
    expect(
      screen.getByText(/select your location from the list below/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/use the search bar to find your location/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", {
        name: /search for a location/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: /search for a location/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm/i })).toBeDisabled();

    const expectedLocations = [
      /community outreach/,
      /inpatient ward/,
      /mobile clinic/,
      /outpatient clinic/,
    ];

    expectedLocations.map((row) =>
      expect(
        screen.getByRole("radio", { name: new RegExp(row, "i") })
      ).toBeInTheDocument()
    );
  });
});
