import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mutate } from 'swr';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import {
  type LoggedInUser,
  type Session,
  setSessionLocale,
  setUserProperties,
  useSession,
} from '@openmrs/esm-framework';
import ChangeLanguageModal from './change-language.modal';

const mockUser = {
  uuid: 'uuid',
  userProperties: {
    defaultLocale: 'fr',
  },
};

vi.mock('@openmrs/esm-framework', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@openmrs/esm-framework')>();
  return {
    ...actual,
    setSessionLocale: vi.fn(() => Promise.resolve()),
    setUserProperties: vi.fn(() => Promise.resolve()),
    useSession: vi.fn(),
  };
});

vi.mock('swr', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('swr')>();
  return {
    ...actual,
    mutate: vi.fn(() => Promise.resolve()),
  };
});

const mockUseSession = vi.mocked(useSession);
const mockSetSessionLocale = vi.mocked(setSessionLocale);
const mockSetUserProperties = vi.mocked(setUserProperties);
const mockMutate = vi.mocked(mutate);

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
    render(<ChangeLanguageModal close={vi.fn()} />);

    expect(screen.getByRole('radio', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /français/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /italiano/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /português/i })).toBeInTheDocument();
  });

  it('should close the modal when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    const mockClose = vi.fn();

    render(<ChangeLanguageModal close={mockClose} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockClose).toHaveBeenCalled();
  });

  it('should update session locale and user properties when the submit button is clicked', async () => {
    const user = userEvent.setup();
    const mockClose = vi.fn();

    render(<ChangeLanguageModal close={mockClose} />);

    expect(screen.getByRole('radio', { name: /français/i })).toBeChecked();

    await user.click(screen.getByRole('radio', { name: /english/i }));
    await user.click(screen.getByRole('button', { name: /change/i }));

    await waitFor(() => expect(mockClose).toHaveBeenCalled());

    expect(mockSetSessionLocale).toHaveBeenCalledWith('en', expect.anything());
    expect(mockSetUserProperties).toHaveBeenCalledWith(mockUser.uuid, { defaultLocale: 'en' }, expect.anything());
    expect(mockMutate).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should show a loading indicator in the submit button while language change is in progress', async () => {
    const user = userEvent.setup();
    mockSetSessionLocale.mockImplementation(() => new Promise(() => {}));

    render(<ChangeLanguageModal close={vi.fn()} />);

    await user.click(screen.getByRole('radio', { name: /english/i }));
    await user.click(screen.getByRole('button', { name: /change/i }));

    expect(screen.getByText(/changing language.../i)).toBeInTheDocument();
  });

  it('should display the "Save as my default language" checkbox checked by default', () => {
    render(<ChangeLanguageModal close={vi.fn()} />);

    const checkbox = screen.getByRole('checkbox', { name: /Save as my default language/i });
    expect(checkbox).toBeChecked();
  });

  it('should only update session locale when checkbox is unchecked', async () => {
    const user = userEvent.setup();
    const mockClose = vi.fn();

    render(<ChangeLanguageModal close={mockClose} />);

    // Uncheck the checkbox to only update session locale
    const checkbox = screen.getByRole('checkbox', { name: /Save as my default language/i });
    await user.click(checkbox);

    // Change locale
    await user.click(screen.getByRole('radio', { name: /english/i }));
    await user.click(screen.getByRole('button', { name: /change/i }));

    await waitFor(() => expect(mockClose).toHaveBeenCalled());

    expect(mockSetSessionLocale).toHaveBeenCalledWith('en', expect.anything());
    expect(mockSetUserProperties).not.toHaveBeenCalled();
  });

  it('should disable submit button when selected locale is same as current locale', () => {
    render(<ChangeLanguageModal close={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /change/i });
    expect(submitButton).toBeDisabled();
  });
});
