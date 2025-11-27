import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  openmrsFetch,
  setSessionLocation,
  setUserProperties,
  showSnackbar,
  useConfig,
  useSession,
  type LoggedInUser,
  type Session,
  type FetchResponse,
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
const mockSetSessionLocation = jest.mocked(setSessionLocation);
const mockSetUserProperties = jest.mocked(setUserProperties);
const mockShowSnackbar = jest.mocked(showSnackbar);

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

    const urlResponseMap: Record<string, FetchResponse<unknown>> = {
      [`/ws/fhir2/R4/Location?_id=${fistLocation.uuid}`]: validatingLocationSuccessResponse as FetchResponse<unknown>,
      [`/ws/fhir2/R4/Location?_id=${invalidLocationUuid}`]: validatingLocationFailureResponse as FetchResponse<unknown>,
    };

    mockOpenmrsFetch.mockImplementation(
      async (url) => urlResponseMap[url] ?? (mockLoginLocations as FetchResponse<unknown>),
    );

    mockSetSessionLocation.mockResolvedValue(undefined);
  });

  it('renders the welcome message and location selection form', () => {
    renderWithRouter(LocationPickerView, {
      currentLocationUuid: 'some-location-uuid',
      hideWelcomeMessage: false,
    });

    expect(screen.getByText(/welcome testy mctesterface/i)).toBeInTheDocument();
    expect(
      screen.getByText(/select your location from the list below. use the search bar to find your location/i),
    ).toBeInTheDocument();
  });

  it('disables the confirm button when no location is selected', () => {
    renderWithRouter(LocationPickerView, {});

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toBeDisabled();
  });

  it('enables the confirm button when a location is selected', async () => {
    const user = userEvent.setup();
    renderWithRouter(LocationPickerView, {});

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toBeDisabled();

    const location = await screen.findByRole('radio', { name: fistLocation.name });
    await user.click(location);

    expect(confirmButton).toBeEnabled();
  });

  describe('Saving location preference', () => {
    it('allows user to save their preferred location for future logins', async () => {
      const user = userEvent.setup();

      renderWithRouter(LocationPickerView, {});

      const location = await screen.findByRole('radio', { name: fistLocation.name });
      const checkbox = screen.getByLabelText(/remember my location for future logins/i);
      const submitButton = screen.getByRole('button', { name: /confirm/i });

      await user.click(location);
      expect(submitButton).toBeEnabled();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetSessionLocation).toHaveBeenCalledWith(fistLocation.uuid, expect.anything());
      });

      expect(mockSetUserProperties).toHaveBeenCalledWith(userUuid, {
        defaultLocation: fistLocation.uuid,
      });

      await waitFor(() => {
        expect(mockShowSnackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            kind: 'success',
            title: 'Location saved',
            subtitle: 'Your preferred location has been saved for future logins',
          }),
        );
      });
    });

    it('does not save preference when user submits without checking the checkbox', async () => {
      const user = userEvent.setup();

      renderWithRouter(LocationPickerView, {});

      const location = await screen.findByRole('radio', { name: fistLocation.name });
      const checkbox = screen.getByLabelText(/remember my location for future logins/i);
      const submitButton = screen.getByRole('button', { name: /confirm/i });

      await user.click(location);
      expect(checkbox).not.toBeChecked();

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetSessionLocation).toHaveBeenCalledWith(fistLocation.uuid, expect.anything());
      });

      expect(mockSetUserProperties).not.toHaveBeenCalled();
      expect(mockShowSnackbar).not.toHaveBeenCalled();
    });

    it('automatically redirects when user has a valid saved location preference', async () => {
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

      renderWithRouter(LocationPickerView, {});

      await waitFor(() => {
        expect(mockSetSessionLocation).toHaveBeenCalledWith(validLocationUuid, expect.anything());
      });

      expect(mockSetUserProperties).not.toHaveBeenCalled();
    });

    it('shows location picker when saved location preference is invalid', async () => {
      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: userUuid,
          userProperties: {
            defaultLocation: invalidLocationUuid,
          },
        } as LoggedInUser,
      } as Session);

      renderWithRouter(LocationPickerView, {});

      const checkbox = screen.getByLabelText(/remember my location for future logins/i);
      expect(checkbox).toBeChecked();

      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
      expect(mockSetSessionLocation).not.toHaveBeenCalled();
    });
  });

  describe('Updating location preference', () => {
    it('shows location picker when update=true is in URL params', () => {
      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: userUuid,
          userProperties: {
            defaultLocation: fistLocation.uuid,
          },
        } as LoggedInUser,
      } as Session);

      renderWithRouter(LocationPickerView, {}, { routes: ['?update=true'] });

      const checkbox = screen.getByLabelText(/remember my location for future logins/i);
      expect(checkbox).toBeChecked();

      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
      expect(mockSetSessionLocation).not.toHaveBeenCalled();
    });

    it('allows user to remove saved preference by unchecking the checkbox', async () => {
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

      renderWithRouter(LocationPickerView, {}, { routes: ['?update=true'] });

      const checkbox = screen.getByLabelText(/remember my location for future logins/i);
      expect(checkbox).toBeChecked();

      const location = screen.getByRole('radio', { name: fistLocation.name });
      await user.click(location);

      expect(mockSetSessionLocation).not.toHaveBeenCalled();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();

      const submitButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetSessionLocation).toHaveBeenCalledWith(fistLocation.uuid, expect.anything());
      });

      expect(mockSetUserProperties).toHaveBeenCalledWith(userUuid, {});

      await waitFor(() => {
        expect(mockShowSnackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            kind: 'success',
            title: 'Location preference removed',
            subtitle: 'You will need to select a location on each login',
          }),
        );
      });
    });

    it('allows user to update their preferred location', async () => {
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

      renderWithRouter(LocationPickerView, {}, { routes: ['?update=true'] });

      const checkbox = screen.getByLabelText(/remember my location for future logins/i);
      expect(checkbox).toBeChecked();

      const location = await screen.findByRole('radio', { name: secondLocation.name });
      const submitButton = screen.getByRole('button', { name: /confirm/i });

      await user.click(location);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetSessionLocation).toHaveBeenCalledWith(secondLocation.uuid, expect.anything());
      });

      expect(mockSetUserProperties).toHaveBeenCalledWith(userUuid, {
        defaultLocation: secondLocation.uuid,
      });

      await waitFor(() => {
        expect(mockShowSnackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            kind: 'success',
            title: 'Location updated',
            subtitle: 'Your preferred login location has been updated',
          }),
        );
      });
    });

    it('does not update preference when user selects the same location', async () => {
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

      renderWithRouter(LocationPickerView, {}, { routes: ['?update=true'] });

      const checkbox = screen.getByLabelText(/remember my location for future logins/i);
      expect(checkbox).toBeChecked();

      const location = await screen.findByRole('radio', { name: fistLocation.name });
      const submitButton = screen.getByRole('button', { name: /confirm/i });

      await user.click(location);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetSessionLocation).toHaveBeenCalledWith(fistLocation.uuid, expect.anything());
      });

      expect(mockSetUserProperties).not.toHaveBeenCalled();
    });
  });
});
