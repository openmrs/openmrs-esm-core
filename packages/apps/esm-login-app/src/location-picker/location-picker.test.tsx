import { act, cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfig, useSession, setSessionLocation, setUserProperties, showSnackbar } from '@openmrs/esm-framework';
import { mockLoginLocations } from '../../__mocks__/locations.mock';
import { mockConfig } from '../../__mocks__/config.mock';
import renderWithRouter from '../test-helpers/render-with-router';
import LocationPicker from './location-picker.component';
import { useLoginLocations } from './useLoginLocations.resource';

const validLocationUuid = '1ce1b7d4-c865-4178-82b0-5932e51503d6';
const invalidLocationUuid = '2gf1b7d4-c865-4178-82b0-5932e51503d6';

const mockedUseConfig = useConfig as jest.Mock;
const mockUseSession = useSession as jest.Mock;
const mockUseLoginLocations = useLoginLocations as jest.Mock;

mockedUseConfig.mockReturnValue(mockConfig);
mockUseSession.mockReturnValue({
  user: {
    display: 'Testy McTesterface',
    uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
    userProperties: {},
  },
});

jest.mock('@openmrs/esm-framework', () => ({
  ...jest.requireActual('@openmrs/esm-framework'),
  setSessionLocation: jest.fn().mockResolvedValue({}),
  setUserProperties: jest.fn().mockResolvedValue({}),
  navigate: jest.fn(),
  showSnackbar: jest.fn(),
  useOpenmrsSWR: jest.fn().mockReturnValue({}),
}));

jest.mock('./useLoginLocations.resource', () => ({
  ...jest.requireActual('./useLoginLocations.resource'),
  useLoginLocations: jest.fn(),
}));

describe('LocationPicker', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
    mockUseLoginLocations.mockReturnValue({
      locations: mockLoginLocations.data.entry,
      isLoadingLocations: false,
      hasMore: false,
      loadingNewData: false,
      setPage: jest.fn(),
      isDefaultLocationValid: false,
      defaultLocation: null,
      lastLoggedInLocation: null,
    });
  });

  describe('Testing basic workflows', () => {
    it('renders a list of login locations', async () => {
      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

      screen.findByText(/welcome testy mctesterface/i);
      expect(screen.getByText(/select your location from the list below/i)).toBeInTheDocument();
      expect(screen.getByText(/use the search bar to find your location/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
      expect(
        screen.getByRole('searchbox', {
          name: /search for a location/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByRole('searchbox', { name: /search for a location/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled();
      const expectedLocations = [/community outreach/, /inpatient ward/, /mobile clinic/, /outpatient clinic/];
      expectedLocations.map((row) =>
        expect(screen.getByRole('radio', { name: new RegExp(row, 'i') })).toBeInTheDocument(),
      );
    });
  });

  describe('Testing setting user preference workflow', () => {
    it('should save user preference if the user checks the checkbox and submit', async () => {
      const user = userEvent.setup();

      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

      screen.findByText(/welcome testy mctesterface/i);
      const checkbox = await screen.findByLabelText('Remember my location for future logins');
      const communityOutreachLocation = await screen.findByRole('radio', {
        name: 'Community Outreach',
      });
      expect(communityOutreachLocation).toBeInTheDocument();

      await user.click(communityOutreachLocation);
      expect(checkbox).toBeInTheDocument();

      await user.click(checkbox);

      const submitButton = screen.getByText('Confirm');
      await user.click(submitButton);

      expect(setSessionLocation).toHaveBeenCalledWith('1ce1b7d4-c865-4178-82b0-5932e51503d6', expect.anything());
      expect(setUserProperties).toHaveBeenCalledWith(
        '90bd24b3-e700-46b0-a5ef-c85afdfededd',
        expect.objectContaining({
          defaultLocation: '1ce1b7d4-c865-4178-82b0-5932e51503d6',
        }),
      );

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

      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

      screen.findByText(/welcome testy mctesterface/i);
      const communityOutreachLocation = await screen.findByRole('radio', {
        name: 'Community Outreach',
      });

      expect(communityOutreachLocation).toBeInTheDocument();
      await user.click(communityOutreachLocation);

      const submitButton = screen.getByText('Confirm');
      await user.click(submitButton);

      expect(setSessionLocation).toHaveBeenCalledWith('1ce1b7d4-c865-4178-82b0-5932e51503d6', expect.anything());
      // TODO
      // expect(setUserProperties).not.toHaveBeenCalledWith();
      expect(showSnackbar).not.toHaveBeenCalled();
    });

    it('should redirect to home if user preference in the userProperties is present and the location preference is valid', async () => {
      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
          userProperties: {
            defaultLocation: validLocationUuid,
          },
        },
      });

      mockUseLoginLocations.mockReturnValue({
        locations: mockLoginLocations.data.entry,
        isDefaultLocationValid: true,
        defaultLocation: validLocationUuid,
      });

      renderWithRouter(LocationPicker, {});

      screen.findByText(/welcome testy mctesterface/i);
      const checkbox = await screen.findByLabelText('Remember my location for future logins');

      expect(checkbox).toBeChecked();

      const communityOutreachLocation = await screen.findByRole('radio', {
        name: 'Community Outreach',
      });
      expect(communityOutreachLocation).toBeInTheDocument();

      expect(setSessionLocation).toHaveBeenCalledWith('1ce1b7d4-c865-4178-82b0-5932e51503d6', expect.anything());

      // Since the user prop and the default login location is the same,
      // it shouldn't send a hit to the backend.
      expect(setUserProperties).not.toHaveBeenCalledWith('90bd24b3-e700-46b0-a5ef-c85afdfededd', {
        defaultLocation: '1ce1b7d4-c865-4178-82b0-5932e51503d6',
      });
    });

    it('should not redirect to home if user preference in the userProperties is present and the location preference is invalid', async () => {
      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
          userProperties: {
            defaultLocation: invalidLocationUuid,
          },
        },
      });

      mockUseLoginLocations.mockReturnValue({
        locations: mockLoginLocations.data.entry,
        isDefaultLocationValid: false,
        defaultLocation: null,
      });

      await act(() => {
        renderWithRouter(LocationPicker, {});
      });

      screen.findByText(/welcome testy mctesterface/i);
      const checkbox = await screen.findByLabelText('Remember my location for future logins');

      expect(checkbox).not.toBeChecked();

      const communityOutreachLocation = await screen.findByRole('radio', {
        name: 'Community Outreach',
      });
      expect(communityOutreachLocation).toBeInTheDocument();

      expect(setSessionLocation).not.toHaveBeenCalled();
    });
  });

  describe('Testing updating user preference workflow', () => {
    it('should not redirect if the login location page has a searchParam `update`', async () => {
      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
          userProperties: {
            defaultLocation: validLocationUuid,
          },
        },
      });

      mockUseLoginLocations.mockReturnValue({
        locations: mockLoginLocations.data.entry,
        isDefaultLocationValid: true,
        defaultLocation: validLocationUuid,
      });

      await act(() => {
        renderWithRouter(LocationPicker, {}, { routes: ['?update=true'] });
      });

      screen.findByText(/welcome testy mctesterface/i);
      const checkbox = await screen.findByLabelText('Remember my location for future logins');
      expect(checkbox).toBeChecked();

      const communityOutreachLocation = await screen.findByRole('radio', {
        name: 'Community Outreach',
      });
      expect(communityOutreachLocation).toBeInTheDocument();
      expect(setSessionLocation).not.toHaveBeenCalled();
    });

    it('should remove the saved preference if the login location page has a searchParam `update=true` and when submitting the user unchecks the checkbox ', async () => {
      const user = userEvent.setup();

      mockUseSession.mockReturnValue({
        user: {
          display: 'Testy McTesterface',
          uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
          userProperties: {
            defaultLocation: '1ce1b7d4-c865-4178-82b0-5932e51503d6',
          },
        },
      });

      mockUseLoginLocations.mockReturnValue({
        locations: mockLoginLocations.data.entry,
        isDefaultLocationValid: true,
        defaultLocation: validLocationUuid,
      });

      await act(() => {
        renderWithRouter(LocationPicker, {}, { routes: ['?update=true'] });
      });

      screen.findByText(/welcome testy mctesterface/i);
      const checkbox = await screen.findByLabelText('Remember my location for future logins');
      expect(checkbox).toBeChecked();

      const communityOutreachLocation = await screen.findByRole('radio', {
        name: 'Community Outreach',
      });
      expect(communityOutreachLocation).toBeInTheDocument();
      expect(setSessionLocation).not.toHaveBeenCalled();

      await user.click(communityOutreachLocation);
      await user.click(checkbox);

      expect(checkbox).not.toBeChecked();

      const submitButton = screen.getByText('Confirm');
      await user.click(submitButton);

      expect(setSessionLocation).toHaveBeenCalledWith('1ce1b7d4-c865-4178-82b0-5932e51503d6', expect.anything());
      expect(setUserProperties).toHaveBeenCalledWith('90bd24b3-e700-46b0-a5ef-c85afdfededd', {
        previousLoggedInLocations: validLocationUuid,
      });

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
          uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
          userProperties: {
            defaultLocation: validLocationUuid,
          },
        },
      });

      mockUseLoginLocations.mockReturnValue({
        locations: mockLoginLocations.data.entry,
        isDefaultLocationValid: true,
        defaultLocation: validLocationUuid,
      });

      await act(() => {
        renderWithRouter(LocationPicker, {}, { routes: ['?update=true'] });
      });

      screen.findByText(/welcome testy mctesterface/i);
      const checkbox = await screen.findByLabelText('Remember my location for future logins');
      expect(checkbox).toBeChecked();

      const mobileClinicRadio = await screen.findByRole('radio', {
        name: 'Mobile Clinic',
      });

      await user.click(mobileClinicRadio);

      const submitButton = screen.getByText('Confirm');
      await user.click(submitButton);

      expect(setSessionLocation).toHaveBeenCalledWith('8d9045ad-50f0-45b8-93c8-3ed4bce19dbf', expect.anything());
      expect(setUserProperties).toHaveBeenCalledWith('90bd24b3-e700-46b0-a5ef-c85afdfededd', {
        defaultLocation: '8d9045ad-50f0-45b8-93c8-3ed4bce19dbf',
        previousLoggedInLocations: '8d9045ad-50f0-45b8-93c8-3ed4bce19dbf',
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
  });
});
