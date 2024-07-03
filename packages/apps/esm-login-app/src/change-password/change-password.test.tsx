import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ChangePasswordModal from './change-password.modal';
import { changeUserPassword } from './change-password.resource';

jest.mock('./change-password.resource', () => ({
  changeUserPassword: jest.fn().mockResolvedValue({}),
}));

const mockClose = jest.fn();
const mockChangeUserPassword = changeUserPassword as jest.Mock;

describe('ChangePasswordModal', () => {
  beforeEach(() => {
    render(<ChangePasswordModal close={mockClose} />);
  });

  it('validates the form before submitting', async () => {
    const submitButton = screen.getByRole('button', {
      name: /change/i,
    });
    const oldPasswordInput = screen.getByLabelText(/old password/i);
    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    expect(screen.getByRole('heading', { name: /Change password/i })).toBeInTheDocument();
    expect(oldPasswordInput).toBeInTheDocument();
    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();

    await userEvent.click(submitButton);

    expect(screen.getByText(/old password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password confirmation is required/i)).toBeInTheDocument();

    await userEvent.type(oldPasswordInput, 'P@ssw0rd123!');
    await userEvent.type(newPasswordInput, 'N3wP@ssw0rd456!');
    await userEvent.type(confirmPasswordInput, 'N3wP@ssw0rd456');

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();

    await userEvent.clear(confirmPasswordInput);
    await userEvent.type(confirmPasswordInput, 'N3wP@ssw0rd456!');

    await userEvent.click(submitButton);

    expect(mockChangeUserPassword).toHaveBeenCalledTimes(1);
    expect(mockChangeUserPassword).toHaveBeenCalledWith('P@ssw0rd123!', 'N3wP@ssw0rd456!');
  });
});
