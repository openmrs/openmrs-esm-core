import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { changeUserPassword } from './change-password.resource';
import ChangePasswordModal from './change-password.modal';

const mockClose = jest.fn();
const mockChangeUserPassword = jest.mocked(changeUserPassword);

jest.mock('./change-password.resource', () => ({
  changeUserPassword: jest.fn().mockResolvedValue({}),
}));

describe('ChangePasswordModal', () => {
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

    expect(screen.getByText(/old password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password confirmation is required/i)).toBeInTheDocument();

    await user.type(oldPasswordInput, 'P@ssw0rd123!');
    await user.type(newPasswordInput, 'N3wP@ssw0rd456!');
    await user.type(confirmPasswordInput, 'N3wP@ssw0rd456');

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();

    await user.clear(confirmPasswordInput);
    await user.type(confirmPasswordInput, 'N3wP@ssw0rd456!');

    await user.click(submitButton);

    expect(mockChangeUserPassword).toHaveBeenCalledTimes(1);
    expect(mockChangeUserPassword).toHaveBeenCalledWith('P@ssw0rd123!', 'N3wP@ssw0rd456!');
  });
});
