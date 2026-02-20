import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { type FetchResponse } from '@openmrs/esm-framework';
import { changeUserPassword } from './change-password.resource';
import ChangePasswordModal from './change-password.modal';

const mockClose = vi.fn();
const mockChangeUserPassword = vi.mocked(changeUserPassword);

vi.mock('./change-password.resource', () => ({
  changeUserPassword: vi.fn().mockResolvedValue({}),
}));

describe('ChangePasswordModal', () => {
  beforeEach(() => {
    mockChangeUserPassword.mockResolvedValue({} as FetchResponse<any>);
  });

  it('validates the form before submitting', async () => {
    const user = userEvent.setup();

    render(<ChangePasswordModal close={mockClose} />);

    const submitButton = screen.getByRole('button', {
      name: /change/i,
    });

    const oldPasswordInput = screen.getByLabelText(/old password/i);
    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    expect(screen.getByRole('heading', { name: /change password/i })).toBeInTheDocument();
    expect(oldPasswordInput).toBeInTheDocument();
    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();

    await user.click(submitButton);

    await screen.findByText(/old password is required/i);
    await screen.findByText(/new password is required/i);
    await screen.findByText(/password confirmation is required/i);

    await user.type(oldPasswordInput, 'P@ssw0rd123!');
    await user.type(newPasswordInput, 'N3wP@ssw0rd456!');
    await user.type(confirmPasswordInput, 'N3wP@ssw0rd456');

    await screen.findByText(/passwords do not match/i);

    await user.clear(confirmPasswordInput);
    await user.type(confirmPasswordInput, 'N3wP@ssw0rd456!');

    await user.click(submitButton);

    expect(mockChangeUserPassword).toHaveBeenCalledTimes(1);
    expect(mockChangeUserPassword).toHaveBeenCalledWith('P@ssw0rd123!', 'N3wP@ssw0rd456!');
  });
});
