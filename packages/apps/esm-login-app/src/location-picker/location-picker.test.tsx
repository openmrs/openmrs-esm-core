/* eslint-disable */
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  openmrsFetch,
  useConfig,
  useSession,
  setSessionLocation,
  setUserProperties,
  showSnackbar,
  LoggedInUser,
  Session,
  FetchResponse,
} from '@openmrs/esm-framework';
import {
  mockLoginLocations,
  validatingLocationFailureResponse,
  validatingLocationSuccessResponse,
} from '../../__mocks__/locations.mock';
import { mockConfig } from '../../__mocks__/config.mock';
import renderWithRouter from '../test-helpers/render-with-router';
import LocationPickerView from './location-picker-view.component';

const fistLocation = {
  uuid: 'uuid_1',
  name: 'location_1',
};

const secondLocation = {
  uuid: 'uuid_2',
  name: 'location_2',
};

const invalidLocationUuid = '2gf1b7d4-c865-4178-82b0-5932e51503d6';
const userUuid = '90bd24b3-e700-46b0-a5ef-c85afdfededd';

const mockOpenmrsFetch = jest.mocked(openmrsFetch);
const mockUseConfig = jest.mocked(useConfig);
const mockUseSession = jest.mocked(useSession);

describe('LocationPickerView', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue(mockConfig);

    mockUseSession.mockReturnValue({
      user: {
        display: 'Testy McTesterface',
        uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
        userProperties: {},
      } as LoggedInUser,
    } as Session);

    mockOpenmrsFetch.mockImplementation((url) => {
      if (url === `/ws/fhir2/R4/Location?_id=${fistLocation.uuid}`) {
        return Promise.resolve(validatingLocationSuccessResponse as FetchResponse<unknown>);
      }
      if (url === `/ws/fhir2/R4/Location?_id=${invalidLocationUuid}`) {
        return Promise.resolve(validatingLocationFailureResponse as FetchResponse<unknown>);
      }
      return Promise.resolve(mockLoginLocations as FetchResponse<unknown>);
    });
  });

  it('renders the component properly', async () => {
    await act(async () => {
      renderWithRouter(LocationPickerView, {
        currentLocationUuid: 'some-location-uuid',
        hideWelcomeMessage: false,
      });
    });

    expect(screen.queryByText(/welcome testy mctesterface/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/select your location from the list below. use the search bar to find your location/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled();
  });

  describe('Testing setting user preference workflow', () => {
    it('should save user preference if the user checks the checkbox and submit', async () => {
      const user = userEvent.setup();

      await act(async () => {
        renderWithRouter(LocationPickerView, {});
      });

      const checkbox = screen.getByLabelText('Remember my location for future logins');
      const location = screen.getByRole('radio', { name: fistLocation.name });
      const submitButton = screen.getByText('Confirm');

      await user.click(location);
      await user.click(checkbox);
      await user.click(submitButton);

      expect(setSessionLocation).toHaveBeenCalledWith(fistLocation.uuid, expect.anything());
      expect(setUserProperties).toHaveBeenCalledWith(userUuid, {
        defaultLocation: fistLocation.uuid,
      });

      await waitFor(() =>
        expect(showSnackbar).toHaveBeenCalledWith({
          isLowContrast: true,
          kind: 'success',
          subtitle: 'Your preferred location has been saved for future logins',
          title: 'Location saved',
        }),
      );
    });

    it("should not save user preference if the user doesn't checks the checkbox and submit", async () => {
      const user = userEvent.setup();

      await act(async () => {
        renderWithRouter(LocationPickerView, {});
      });

      const location = await screen.findByRole('radio', { name: fistLocation.name });
      const submitButton = screen.getByText('Confirm');

      await user.click(location);
      await user.click(submitButton);

      expect(setSessionLocation).toHaveBeenCalledWith(fistLocation.uuid, expect.anything());
      expect(setUserProperties).not.toHaveBeenCalled();
      expect(showSnackbar).not.toHaveBeenCalled();
    });

    it('should redirect to home if user preference in the userProperties is present and the location preference is valid', async () => {
      const validLocationUuid = fistLocation.uuid;
      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: userUuid,
          userProperties: {
            defaultLocation: validLocationUuid,
          },
        } as LoggedInUser,
      } as Session);

      await act(async () => {
        renderWithRouter(LocationPickerView, {});
      });

      await waitFor(() => {
        expect(setSessionLocation).toHaveBeenCalledWith(validLocationUuid, expect.anything());
      });

      // Since the user prop and the default login location is the same,
      // it shouldn't send a hit to the backend.
      expect(setUserProperties).not.toHaveBeenCalledWith(userUuid, {
        defaultLocation: validLocationUuid,
      });
    });

    it('should not redirect to home if user preference in the userProperties is present and the location preference is invalid', async () => {
      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: userUuid,
          userProperties: {
            defaultLocation: invalidLocationUuid,
          },
        } as LoggedInUser,
      } as Session);

      await act(async () => {
        renderWithRouter(LocationPickerView, {});
      });

      const checkbox = screen.getByLabelText('Remember my location for future logins');
      expect(checkbox).toBeChecked();

      expect(setSessionLocation).not.toHaveBeenCalled();
    });
  });

  describe('Testing updating user preference workflow', () => {
    it('should not redirect if the login location page has a searchParam `update`', async () => {
      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: userUuid,
          userProperties: {
            defaultLocation: fistLocation.uuid,
          },
        } as LoggedInUser,
      } as Session);

      await act(async () => {
        renderWithRouter(LocationPickerView, {}, { routes: ['?update=true'] });
      });

      const checkbox = screen.getByLabelText('Remember my location for future logins');
      expect(checkbox).toBeChecked();

      expect(setSessionLocation).not.toHaveBeenCalled();
    });

    it('should remove the saved preference if the login location page has a searchParam `update=true` and when submitting the user unchecks the checkbox ', async () => {
      const user = userEvent.setup();

      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: userUuid,
          userProperties: {
            defaultLocation: '1ce1b7d4-c865-4178-82b0-5932e51503d6',
          },
        } as LoggedInUser,
      } as Session);

      await act(async () => {
        renderWithRouter(LocationPickerView, {}, { routes: ['?update=true'] });
      });

      const checkbox = screen.getByLabelText('Remember my location for future logins');
      expect(checkbox).toBeChecked();

      const location = screen.getByRole('radio', { name: fistLocation.name });
      await user.click(location);

      expect(setSessionLocation).not.toHaveBeenCalled();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();

      const submitButton = screen.getByText('Confirm');
      await user.click(submitButton);

      expect(setSessionLocation).toHaveBeenCalledWith(fistLocation.uuid, expect.anything());
      expect(setUserProperties).toHaveBeenCalledWith(userUuid, {});

      await waitFor(() =>
        expect(showSnackbar).toHaveBeenCalledWith({
          isLowContrast: true,
          kind: 'success',
          title: 'Location preference removed',
          subtitle: 'You will need to select a location on each login',
        }),
      );
    });

    it('should update the user preference with new selection', async () => {
      const user = userEvent.setup();

      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: userUuid,
          userProperties: {
            defaultLocation: fistLocation.uuid,
          },
        } as LoggedInUser,
      } as Session);

      await act(async () => {
        renderWithRouter(LocationPickerView, {}, { routes: ['?update=true'] });
      });

      const checkbox = screen.getByLabelText('Remember my location for future logins');
      expect(checkbox).toBeChecked();

      const location = await screen.findByRole('radio', { name: secondLocation.name });
      const submitButton = screen.getByText('Confirm');

      await user.click(location);
      await user.click(submitButton);

      expect(setSessionLocation).toHaveBeenCalledWith(secondLocation.uuid, expect.anything());
      expect(setUserProperties).toHaveBeenCalledWith(userUuid, {
        defaultLocation: secondLocation.uuid,
      });

      await waitFor(() =>
        expect(showSnackbar).toHaveBeenCalledWith({
          isLowContrast: true,
          kind: 'success',
          title: 'Location updated',
          subtitle: 'Your preferred login location has been updated',
        }),
      );
    });

    it('should not update the user preference with same selection', async () => {
      const user = userEvent.setup();

      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: userUuid,
          userProperties: {
            defaultLocation: fistLocation.uuid,
          },
        } as LoggedInUser,
      } as Session);

      await act(async () => {
        renderWithRouter(LocationPickerView, {}, { routes: ['?update=true'] });
      });

      const checkbox = screen.getByLabelText('Remember my location for future logins');
      expect(checkbox).toBeChecked();

      const communityOutreachLocation = await screen.findByRole('radio', { name: fistLocation.name });
      const submitButton = screen.getByText('Confirm');

      await user.click(communityOutreachLocation);
      await user.click(submitButton);

      expect(setSessionLocation).toHaveBeenCalledWith(fistLocation.uuid, expect.anything());
      expect(setUserProperties).not.toHaveBeenCalled();
    });
  });
});
