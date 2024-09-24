import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { showModal } from '@openmrs/esm-framework';
import ChangeLanguageLink from './change-language-link.extension';

const mockShowModal = jest.mocked(showModal);

describe('Change Language Link', () => {
  it('should display the `Change language` link', async () => {
    const user = userEvent.setup();

    render(<ChangeLanguageLink />);

    const changeLanguageLink = screen.getByRole('button', {
      name: /Change/i,
    });

    await user.click(changeLanguageLink);

    expect(mockShowModal).toHaveBeenCalledTimes(1);
    expect(mockShowModal).toHaveBeenCalledWith('change-language-modal', {
      closeModal: expect.any(Function),
      size: 'sm',
    });
  });
});
