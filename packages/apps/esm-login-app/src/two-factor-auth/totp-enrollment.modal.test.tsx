import React from 'react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { openmrsFetch, showSnackbar, refetchCurrentUser } from '@openmrs/esm-framework';
import TotpEnrollment from './totp-enrollment.modal';

const mockT = (key: string, defaultText: string) => defaultText;
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

vi.mock('@openmrs/esm-framework', async () => {
  const actual = await vi.importActual('@openmrs/esm-framework');
  return {
    ...actual,
    openmrsFetch: vi.fn(),
    showSnackbar: vi.fn(),
    refetchCurrentUser: vi.fn().mockReturnValue(Promise.resolve()),
  };
});

describe('TotpEnrollment', () => {
  const mockOpenmrsFetch = vi.mocked(openmrsFetch);
  const mockShowSnackbar = vi.mocked(showSnackbar);
  const mockRefetchCurrentUser = vi.mocked(refetchCurrentUser);
  const mockClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockRefetchCurrentUser.mockResolvedValue(undefined as unknown as Awaited<ReturnType<typeof refetchCurrentUser>>);
    mockOpenmrsFetch.mockResolvedValue({ data: { qrCodeUri: 'data:image/png;base64,mock' } } as unknown as Awaited<
      ReturnType<typeof openmrsFetch>
    >);
  });

  it('should verify the totp code successfully and show a success snackbar', async () => {
    render(<TotpEnrollment close={mockClose} />);

    const user = userEvent.setup();
    const input = await screen.findByRole('textbox', { name: /Enter Verification Code/i });

    mockOpenmrsFetch.mockResolvedValueOnce({ data: { isValidCode: true } } as unknown as Awaited<
      ReturnType<typeof openmrsFetch>
    >);

    await user.type(input, '123456');

    const enableButton = await screen.findByRole('button', { name: /Enable 2FA/i });
    await user.click(enableButton);

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith(expect.objectContaining({ kind: 'success' }));
    });
    expect(mockClose).toHaveBeenCalled();
  });

  it('should display the error message if the verification fails', async () => {
    render(<TotpEnrollment close={mockClose} />);

    const user = userEvent.setup();
    const input = await screen.findByRole('textbox', { name: /Enter Verification Code/i });

    mockOpenmrsFetch.mockRejectedValueOnce({
      responseBody: { error: { translatedMessage: 'Invalid code provided' } },
    });

    await user.type(input, '000000');

    const enableButton = await screen.findByRole('button', { name: /Enable 2FA/i });
    await user.click(enableButton);

    const errorMessage = await screen.findByText(/Invalid code provided/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
