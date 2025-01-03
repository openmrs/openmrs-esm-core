import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { type LoggedInUser, type Session, useConnectivity, useSession } from '@openmrs/esm-framework';
import ChangeLanguageModal from './change-language.modal';

const mockUser = {
  uuid: 'uuid',
  userProperties: {
    defaultLocale: 'fr',
  },
};

const mockPostUserPropertiesOnline = jest.fn((...args) => Promise.resolve());
const mockPostUserPropertiesOffline = jest.fn((...args) => Promise.resolve());
const mockUseConnectivity = jest.mocked(useConnectivity);
const mockUseSession = jest.mocked(useSession);

jest.mock('./change-language.resource', () => ({
  postUserPropertiesOnline: (...args) => mockPostUserPropertiesOnline(...args),
  postUserPropertiesOffline: (...args) => mockPostUserPropertiesOffline(...args),
}));

describe(`Change Language Modal`, () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      authenticated: true,
      user: mockUser as unknown as LoggedInUser,
      allowedLocales: ['en', 'fr', 'it', 'pt'],
      locale: 'fr',
    } as Session);
  });

  it('should correctly displays all allowed locales', () => {
    render(<ChangeLanguageModal close={jest.fn()} />);

    expect(screen.getByRole('radio', { name: /English/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Français/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Italiano/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Português/i })).toBeInTheDocument();
  });

  it('should close the modal when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    const mockClose = jest.fn();

    render(<ChangeLanguageModal close={mockClose} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockClose).toHaveBeenCalled();
  });

  it('should change user locale when the submit button is clicked', async () => {
    const user = userEvent.setup();

    render(<ChangeLanguageModal close={jest.fn()} />);

    expect(screen.getByRole('radio', { name: /Français/ })).toBeChecked();

    await user.click(screen.getByRole('radio', { name: /English/i }));
    await user.click(screen.getByRole('button', { name: /change/i }));

    expect(mockPostUserPropertiesOnline).toHaveBeenCalledWith(
      mockUser.uuid,
      { defaultLocale: 'en' },
      expect.anything(),
    );
  });

  it('should show a loading indicator in the submit button while language change is in progress', async () => {
    const user = userEvent.setup();
    mockPostUserPropertiesOnline.mockImplementation(() => new Promise(() => {}));

    render(<ChangeLanguageModal close={jest.fn()} />);

    await user.click(screen.getByRole('radio', { name: /English/i }));
    await user.click(screen.getByRole('button', { name: /change/i }));

    expect(screen.getByText(/changing language.../i)).toBeInTheDocument();
  });

  it('should use offline endpoint when user is offline', async () => {
    const user = userEvent.setup();
    mockUseConnectivity.mockReturnValue(false);

    render(<ChangeLanguageModal close={jest.fn()} />);

    await user.click(screen.getByRole('radio', { name: /English/i }));
    await user.click(screen.getByRole('button', { name: /change/i }));

    expect(mockPostUserPropertiesOffline).toHaveBeenCalledWith(
      mockUser.uuid,
      { defaultLocale: 'en' },
      expect.anything(),
    );
    expect(mockPostUserPropertiesOnline).not.toHaveBeenCalled();
  });

  it('should disable submit button when selected locale is same as current locale', () => {
    render(<ChangeLanguageModal close={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /change/i });
    expect(submitButton).toBeDisabled();
  });
});
