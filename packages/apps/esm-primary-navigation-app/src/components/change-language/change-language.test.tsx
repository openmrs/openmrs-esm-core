import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { type LoggedInUser, type Session, useSession } from '@openmrs/esm-framework';
import ChangeLanguageModal from './change-language.modal';

const mockUser = {
  uuid: 'uuid',
  userProperties: {
    defaultLocale: 'fr',
  },
};

const mockUpdateUserProperties = jest.fn((...args) => Promise.resolve());
const mockUpdateSessionLocale = jest.fn((...args) => Promise.resolve());
const mockUseSession = jest.mocked(useSession);

jest.mock('./change-language.resource', () => ({
  updateUserProperties: (...args) => mockUpdateUserProperties(...args),
  updateSessionLocale: (...args) => mockUpdateSessionLocale(...args),
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

    expect(screen.getByRole('radio', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /français/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /italiano/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /português/i })).toBeInTheDocument();
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

    expect(screen.getByRole('radio', { name: /français/i })).toBeChecked();

    await user.click(screen.getByRole('radio', { name: /english/i }));
    await user.click(screen.getByRole('button', { name: /change/i }));

    expect(mockUpdateUserProperties).toHaveBeenCalledWith(mockUser.uuid, { defaultLocale: 'en' }, expect.anything());
  });

  it('should show a loading indicator in the submit button while language change is in progress', async () => {
    const user = userEvent.setup();
    mockUpdateUserProperties.mockImplementation(() => new Promise(() => {}));

    render(<ChangeLanguageModal close={jest.fn()} />);

    await user.click(screen.getByRole('radio', { name: /english/i }));
    await user.click(screen.getByRole('button', { name: /change/i }));

    expect(screen.getByText(/changing language.../i)).toBeInTheDocument();
  });

  it('should display the "Save as my default language" checkbox checked by default', () => {
    render(<ChangeLanguageModal close={jest.fn()} />);

    const checkbox = screen.getByRole('checkbox', { name: /Save as my default language/i });
    expect(checkbox).toBeChecked();
  });

  it('should call updateSessionLocale when checkbox is unchecked and user changes locale', async () => {
    const user = userEvent.setup();

    render(<ChangeLanguageModal close={jest.fn()} />);

    // Uncheck the checkbox to only update session locale
    const checkbox = screen.getByRole('checkbox', { name: /Save as my default language/i });
    await user.click(checkbox);

    // Change locale
    await user.click(screen.getByRole('radio', { name: /english/i }));
    await user.click(screen.getByRole('button', { name: /change/i }));

    expect(mockUpdateSessionLocale).toHaveBeenCalledWith('en', expect.anything());
    expect(mockUpdateUserProperties).not.toHaveBeenCalled();
  });

  it('should disable submit button when selected locale is same as current locale', () => {
    render(<ChangeLanguageModal close={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /change/i });
    expect(submitButton).toBeDisabled();
  });
});
