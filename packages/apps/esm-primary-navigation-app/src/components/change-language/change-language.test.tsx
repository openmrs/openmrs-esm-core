import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useSession } from '@openmrs/esm-framework';
import ChangeLanguageModal from './change-language.modal';

const mockUser = {
  uuid: 'uuid',
  userProperties: {
    defaultLocale: 'fr',
  },
};

const mockUseSession = useSession as jest.Mock;
mockUseSession.mockReturnValue({
  authenticated: true,
  user: mockUser,
  allowedLocales: ['en', 'fr', 'it', 'pt'],
  locale: 'fr',
});

const mockPostUserPropertiesOnline = jest.fn((...args) => Promise.resolve());
jest.mock('./change-language.resource', () => ({
  postUserPropertiesOnline: (...args) => mockPostUserPropertiesOnline(...args),
  postUserPropertiesOffline: jest.fn(),
}));

describe(`Change Language Modal`, () => {
  it('should change user locale', async () => {
    const user = userEvent.setup();

    render(<ChangeLanguageModal close={jest.fn()} />);
    expect(screen.getByRole('radio', { name: /français/ })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: /english/i }));
    await user.click(screen.getByRole('button', { name: /change/i }));
    expect(mockPostUserPropertiesOnline).toHaveBeenCalledWith(
      mockUser.uuid,
      { defaultLocale: 'en' },
      expect.anything(),
    );
  });
});
