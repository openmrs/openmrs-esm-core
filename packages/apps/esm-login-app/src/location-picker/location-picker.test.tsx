import {
  cleanup,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import {
  openmrsFetch,
  useConfig,
  useSession,
  setSessionLocation,
  setUserProperties,
  showToast,
} from "@openmrs/esm-framework";
import {
  mockLoginLocations,
  validatingLocationFailureResponse,
  validatingLocationSuccessResponse,
} from "../../__mocks__/locations.mock";
import { mockConfig } from "../../__mocks__/config.mock";
import renderWithRouter from "../test-helpers/render-with-router";
import LocationPicker from "./location-picker.component";
import { act } from "react-dom/test-utils";

const validLocationUuid = "1ce1b7d4-c865-4178-82b0-5932e51503d6";
const invalidLocationUuid = "2gf1b7d4-c865-4178-82b0-5932e51503d6";

const mockedOpenmrsFetch = openmrsFetch as jest.Mock;
const mockedUseConfig = useConfig as jest.Mock;
const mockUseSession = useSession as jest.Mock;

mockedUseConfig.mockReturnValue(mockConfig);
mockUseSession.mockReturnValue({
  user: {
    display: "Testy McTesterface",
    uuid: "90bd24b3-e700-46b0-a5ef-c85afdfededd",
    userProperties: {},
  },
});
mockedOpenmrsFetch.mockImplementation((url) => {
  if (url === `/ws/rest/v1/location/${validLocationUuid}`) {
    return validatingLocationSuccessResponse;
  }
  if (url === `/ws/rest/v1/location/${invalidLocationUuid}`) {
    return validatingLocationFailureResponse;
  }

  return mockLoginLocations;
});

jest.mock("@openmrs/esm-framework", () => ({
  ...jest.requireActual("@openmrs/esm-framework"),
  setSessionLocation: jest.fn().mockResolvedValue({}),
  setUserProperties: jest.fn().mockResolvedValue({}),
  navigate: jest.fn(),
  showToast: jest.fn(),
}));

describe("LocationPicker", () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe("Testing basic workflows", () => {
    it("renders a list of login locations", async () => {
      await act(() => {
        renderWithRouter(LocationPicker, {
          currentLocationUuid: "some-location-uuid",
          hideWelcomeMessage: false,
        });
      });

      expect(
        screen.getByText(/welcome testy mctesterface/i)
      ).toBeInTheDocument();
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

  describe("Testing setting user preference workflow", () => {
    it("should save user preference if the user checks the checkbox and submit", async () => {
      await act(() => {
        renderWithRouter(LocationPicker, {});
      });
      const checkbox = await screen.findByLabelText(
        "Remember my location for future logins"
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
          defaultLocation: "1ce1b7d4-c865-4178-82b0-5932e51503d6",
        }
      );
      await waitFor(() =>
        expect(showToast).toBeCalledWith({
          kind: "success",
          title: "Selected location will be used for your next logins",
          description: "You can change your preference from the user dashboard",
        })
      );
    });

    it("should not save user preference if the user doesn't checks the checkbox and submit", async () => {
      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

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

    it("should redirect to home if user preference in the userProperties is present and the location preference is valid", async () => {
      mockUseSession.mockReturnValue({
        user: {
          display: "Testy McTesterface",
          uuid: "90bd24b3-e700-46b0-a5ef-c85afdfededd",
          userProperties: {
            defaultLocation: validLocationUuid,
          },
        },
      });

      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

      const checkbox = await screen.findByLabelText(
        "Remember my location for future logins"
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

      // Since the user prop and the default login location is the same,
      // it shouldn't send a hit to the backend.
      expect(setUserProperties).not.toBeCalledWith(
        "90bd24b3-e700-46b0-a5ef-c85afdfededd",
        {
          defaultLocation: "1ce1b7d4-c865-4178-82b0-5932e51503d6",
        }
      );
    });

    it("should not redirect to home if user preference in the userProperties is present and the location preference is invalid", async () => {
      mockUseSession.mockReturnValue({
        user: {
          display: "Testy McTesterface",
          uuid: "90bd24b3-e700-46b0-a5ef-c85afdfededd",
          userProperties: {
            defaultLocation: invalidLocationUuid,
          },
        },
      });

      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

      const checkbox = await screen.findByLabelText(
        "Remember my location for future logins"
      );

      expect(checkbox).toBeChecked();

      const communityOutreachLocation = await screen.findByRole("radio", {
        name: "Community Outreach",
      });
      expect(communityOutreachLocation).toBeInTheDocument();

      expect(setSessionLocation).not.toBeCalledWith(
        "1ce1b7d4-c865-4178-82b0-5932e51503d6",
        expect.anything()
      );
    });
  });

  describe("Testing updating user preference workflow", () => {
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
            defaultLocation: validLocationUuid,
          },
        },
      });
      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

      const checkbox = await screen.findByLabelText(
        "Remember my location for future logins"
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
            defaultLocation: "1ce1b7d4-c865-4178-82b0-5932e51503d6",
          },
        },
      });
      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

      const checkbox = await screen.findByLabelText(
        "Remember my location for future logins"
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

      await waitFor(() =>
        expect(showToast).toBeCalledWith({
          title: "Login location preference removed",
          kind: "success",
          description: "The login location preference has been removed.",
        })
      );
    });

    it("should update the user preference with new selection", async () => {
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
            defaultLocation: validLocationUuid,
          },
        },
      });
      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

      const checkbox = await screen.findByLabelText(
        "Remember my location for future logins"
      );
      expect(checkbox).toBeChecked();

      const mobileClinicRadio = await screen.findByRole("radio", {
        name: "Mobile Clinic",
      });
      fireEvent.click(mobileClinicRadio);
      const submitButton = screen.getByText("Confirm");
      fireEvent.click(submitButton);
      expect(setSessionLocation).toBeCalledWith(
        "8d9045ad-50f0-45b8-93c8-3ed4bce19dbf",
        expect.anything()
      );
      expect(setUserProperties).toBeCalledWith(
        "90bd24b3-e700-46b0-a5ef-c85afdfededd",
        { defaultLocation: "8d9045ad-50f0-45b8-93c8-3ed4bce19dbf" }
      );
      await waitFor(() =>
        expect(showToast).toBeCalledWith({
          description: "Selected location will be used for your next logins",
          kind: "success",
          title: "Login location preference updated",
        })
      );
    });

    it("should not update the user preference with same selection", async () => {
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
            defaultLocation: validLocationUuid,
          },
        },
      });
      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

      const checkbox = await screen.findByLabelText(
        "Remember my location for future logins"
      );
      expect(checkbox).toBeChecked();

      const communityOutreachLocation = await screen.findByRole("radio", {
        name: "Community Outreach",
      });
      fireEvent.click(communityOutreachLocation);
      const submitButton = screen.getByText("Confirm");
      fireEvent.click(submitButton);
      expect(setSessionLocation).toBeCalledWith(
        validLocationUuid,
        expect.anything()
      );
      expect(setUserProperties).not.toBeCalled();
    });
  });
});
