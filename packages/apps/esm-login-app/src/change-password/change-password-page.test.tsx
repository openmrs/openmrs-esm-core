import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { type FetchResponse, useConfig } from '@openmrs/esm-framework';
import { mockConfig } from '../../__mocks__/config.mock';
import { changeUserPassword } from './change-password.resource';
import ChangePassword from './change-password.component';

const mockChangeUserPassword = vi.mocked(changeUserPassword);
const mockUseConfig = vi.mocked(useConfig);

vi.mock('./change-password.resource', () => ({
  changeUserPassword: vi.fn(),
}));

describe('ChangePassword', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue(mockConfig);
    mockChangeUserPassword.mockResolvedValue({} as FetchResponse<any>);
  });

  it('rejects fields that were filled in and then cleared', async () => {
    const user = userEvent.setup();

    render(<ChangePassword />);

    const oldPasswordInput = screen.getByLabelText(/old password/i);
    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    await user.type(oldPasswordInput, 'P@ssw0rd123!');
    await user.type(newPasswordInput, 'N3wP@ssw0rd456!');
    await user.type(confirmPasswordInput, 'N3wP@ssw0rd456!');
    await user.clear(oldPasswordInput);
    await user.clear(newPasswordInput);
    await user.clear(confirmPasswordInput);
    await user.click(screen.getByRole('button', { name: /change/i }));

    expect(screen.getByText(/old password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password confirmation is required/i)).toBeInTheDocument();
    expect(mockChangeUserPassword).not.toHaveBeenCalled();
  });

  it('rejects passwords that contain only spaces', async () => {
    const user = userEvent.setup();

    render(<ChangePassword />);

    await user.type(screen.getByLabelText(/old password/i), '   ');
    await user.type(screen.getByLabelText(/^new password$/i), '   ');
    await user.type(screen.getByLabelText(/confirm new password/i), '   ');
    await user.click(screen.getByRole('button', { name: /change/i }));

    expect(screen.getByText(/old password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password confirmation is required/i)).toBeInTheDocument();
    expect(mockChangeUserPassword).not.toHaveBeenCalled();
  });

  it('submits passwords exactly as typed, including surrounding spaces', async () => {
    const user = userEvent.setup();

    render(<ChangePassword />);

    await user.type(screen.getByLabelText(/old password/i), ' P@ssw0rd123! ');
    await user.type(screen.getByLabelText(/^new password$/i), ' N3wP@ssw0rd456! ');
    await user.type(screen.getByLabelText(/confirm new password/i), ' N3wP@ssw0rd456! ');
    await user.click(screen.getByRole('button', { name: /change/i }));

    expect(mockChangeUserPassword).toHaveBeenCalledTimes(1);
    expect(mockChangeUserPassword).toHaveBeenCalledWith(' P@ssw0rd123! ', ' N3wP@ssw0rd456! ');
  });
});
