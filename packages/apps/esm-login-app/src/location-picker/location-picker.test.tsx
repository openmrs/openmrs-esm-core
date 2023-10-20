import {
  cleanup,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import {
  openmrsFetch,
  useConfig,
  useSession,
  setSessionLocation,
  setUserProperties,
} from "@openmrs/esm-framework";
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
    uuid: "90bd24b3-e700-46b0-a5ef-c85afdfededd",
  },
});
mockedOpenmrsFetch.mockReturnValue(mockLoginLocations);

jest.mock("@openmrs/esm-framework", () => ({
  ...jest.requireActual("@openmrs/esm-framework"),
  setSessionLocation: jest.fn().mockResolvedValue({}),
  setUserProperties: jest.fn(),
}));

describe("LocationPicker", () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });
  it("renders a list of login locations", async () => {
    renderWithRouter(LocationPicker, {
      currentLocationUuid: "some-location-uuid",
      hideWelcomeMessage: false,
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

  it("should save user preference if the user checks the checkbox and submit", async () => {
    renderWithRouter(LocationPicker, {});
    const checkbox = await screen.findByLabelText(
      "Prefer selected location for next logins"
    );

    const communityOutreachLocation = await screen.findByRole("radio", {
      name: "Community Outreach",
    });
    expect(communityOutreachLocation).toBeInTheDocument();
    fireEvent.click(communityOutreachLocation);
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    const submitButton = screen.getByText("Confirm");
    fireEvent.click(submitButton);

    expect(setSessionLocation).toBeCalledWith(
      "1ce1b7d4-c865-4178-82b0-5932e51503d6",
      expect.anything()
    );

    expect(setUserProperties).toBeCalledWith(
      "90bd24b3-e700-46b0-a5ef-c85afdfededd",
      {
        defaultLoginLocation: "1ce1b7d4-c865-4178-82b0-5932e51503d6",
      }
    );
  });

  it("should not save user preference if the user doesn't checks the checkbox and submit", async () => {
    renderWithRouter(LocationPicker, {});

    const communityOutreachLocation = await screen.findByRole("radio", {
      name: "Community Outreach",
    });
    expect(communityOutreachLocation).toBeInTheDocument();
    fireEvent.click(communityOutreachLocation);
    const submitButton = screen.getByText("Confirm");
    fireEvent.click(submitButton);

    expect(setSessionLocation).toBeCalledWith(
      "1ce1b7d4-c865-4178-82b0-5932e51503d6",
      expect.anything()
    );

    expect(setUserProperties).not.toBeCalled();
  });

  it("should redirect to home if user preference in the userProperties is present", async () => {
    mockUseSession.mockReturnValue({
      user: {
        display: "Testy McTesterface",
        uuid: "90bd24b3-e700-46b0-a5ef-c85afdfededd",
        userProperties: {
          defaultLoginLocation: "1ce1b7d4-c865-4178-82b0-5932e51503d6",
        },
      },
    });
    renderWithRouter(LocationPicker, {});

    const checkbox = await screen.findByLabelText(
      "Prefer selected location for next logins"
    );

    expect(checkbox).toBeChecked();

    const communityOutreachLocation = await screen.findByRole("radio", {
      name: "Community Outreach",
    });
    expect(communityOutreachLocation).toBeInTheDocument();

    expect(setSessionLocation).toBeCalledWith(
      "1ce1b7d4-c865-4178-82b0-5932e51503d6",
      expect.anything()
    );

    expect(setUserProperties).toBeCalledWith(
      "90bd24b3-e700-46b0-a5ef-c85afdfededd",
      {
        defaultLoginLocation: "1ce1b7d4-c865-4178-82b0-5932e51503d6",
      }
    );
  });

  it("should not redirect if the login location page has a searchParam `update`", async () => {
    Object.defineProperty(window, "location", {
      value: {
        search: "?update=true",
      },
    });
    mockUseSession.mockReturnValue({
      user: {
        display: "Testy McTesterface",
        uuid: "90bd24b3-e700-46b0-a5ef-c85afdfededd",
        userProperties: {
          defaultLoginLocation: "1ce1b7d4-c865-4178-82b0-5932e51503d6",
        },
      },
    });
    renderWithRouter(LocationPicker, {});

    const checkbox = await screen.findByLabelText(
      "Prefer selected location for next logins"
    );
    expect(checkbox).toBeChecked();

    const communityOutreachLocation = await screen.findByRole("radio", {
      name: "Community Outreach",
    });
    expect(communityOutreachLocation).toBeInTheDocument();
    expect(setSessionLocation).not.toBeCalled();
  });

  it("should remove the saved preference if the login location page has a searchParam `update=true` and when submitting the user unchecks the checkbox ", async () => {
    Object.defineProperty(window, "location", {
      value: {
        search: "?update=true",
      },
    });
    mockUseSession.mockReturnValue({
      user: {
        display: "Testy McTesterface",
        uuid: "90bd24b3-e700-46b0-a5ef-c85afdfededd",
        userProperties: {
          defaultLoginLocation: "1ce1b7d4-c865-4178-82b0-5932e51503d6",
        },
      },
    });
    renderWithRouter(LocationPicker, {});

    const checkbox = await screen.findByLabelText(
      "Prefer selected location for next logins"
    );
    expect(checkbox).toBeChecked();

    const communityOutreachLocation = await screen.findByRole("radio", {
      name: "Community Outreach",
    });
    expect(communityOutreachLocation).toBeInTheDocument();
    expect(setSessionLocation).not.toBeCalled();

    fireEvent.click(communityOutreachLocation);
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    const submitButton = screen.getByText("Confirm");
    fireEvent.click(submitButton);

    expect(setSessionLocation).toBeCalledWith(
      "1ce1b7d4-c865-4178-82b0-5932e51503d6",
      expect.anything()
    );

    expect(setUserProperties).toBeCalledWith(
      "90bd24b3-e700-46b0-a5ef-c85afdfededd",
      {}
    );
  });
});
