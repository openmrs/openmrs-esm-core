import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { showModal } from '@openmrs/esm-framework';
import ChangePasswordLink from './change-password-link.extension';

const mockShowModal = vi.mocked(showModal);

describe('ChangePasswordLink', () => {
  it('should launch the change password modal', async () => {
    const user = userEvent.setup();

    render(<ChangePasswordLink />);

    const changePasswordLink = screen.getByRole('button', {
      name: /Change/i,
    });

    await user.click(changePasswordLink);

    expect(mockShowModal).toHaveBeenCalledTimes(1);
    expect(mockShowModal).toHaveBeenCalledWith('change-password-modal', {
      size: 'sm',
      closeModal: expect.any(Function),
    });
  });
});
