import React from 'react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { showSnackbar, refetchCurrentUser, OpenmrsFetchError } from '@openmrs/esm-framework';
import { initiateTotpEnrollment, verifyTotpEnrollment } from './two-factor-auth.resource';
import TotpEnrollment from './totp-enrollment.modal';

const mockT = (key: string, defaultText: string) => defaultText;
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

vi.mock('./two-factor-auth.resource', () => ({
  initiateTotpEnrollment: vi.fn(),
  verifyTotpEnrollment: vi.fn(),
}));

describe('TotpEnrollment', () => {
  const mockInitiateTotpEnrollment = vi.mocked(initiateTotpEnrollment);
  const mockVerifyTotpEnrollment = vi.mocked(verifyTotpEnrollment);
  const mockShowSnackbar = vi.mocked(showSnackbar);
  const mockRefetchCurrentUser = vi.mocked(refetchCurrentUser);
  const mockClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockRefetchCurrentUser.mockResolvedValue(undefined as unknown as Awaited<ReturnType<typeof refetchCurrentUser>>);
    mockInitiateTotpEnrollment.mockResolvedValue({
      data: { qrCodeUri: 'data:image/png;base64,mock' },
    } as unknown as Awaited<ReturnType<typeof initiateTotpEnrollment>>);
  });

  it('should verify the totp code successfully and show a success snackbar', async () => {
    render(<TotpEnrollment close={mockClose} />);

    const user = userEvent.setup();
    const input = await screen.findByRole('textbox', { name: /Enter 6-digit code from your app/i });

    mockVerifyTotpEnrollment.mockResolvedValueOnce({ data: { isValidCode: true } } as unknown as Awaited<
      ReturnType<typeof verifyTotpEnrollment>
    >);

    await user.type(input, '123456');

    const enableButton = await screen.findByRole('button', { name: /Confirm and Enable authenticator app/i });
    await user.click(enableButton);

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith(expect.objectContaining({ kind: 'success' }));
    });
    expect(mockClose).toHaveBeenCalled();
  });

  it('should display the error message if the verification fails', async () => {
    render(<TotpEnrollment close={mockClose} />);

    const user = userEvent.setup();
    const input = await screen.findByRole('textbox', { name: /Enter 6-digit code from your app/i });

    mockVerifyTotpEnrollment.mockRejectedValueOnce(
      new OpenmrsFetchError(
        '/ws/rest/v1/auth/totp/enrollment/verify',
        new Response(),
        { error: { translatedMessage: 'Invalid code provided' } },
        new Error(),
      ),
    );

    await user.type(input, '000000');

    const enableButton = await screen.findByRole('button', { name: /Confirm and Enable authenticator app/i });
    await user.click(enableButton);

    const errorMessage = await screen.findByText(/Invalid code provided/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
