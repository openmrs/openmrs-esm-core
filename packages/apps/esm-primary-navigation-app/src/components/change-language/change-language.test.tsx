import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChangeLanguageModal from './change-language.modal';
import type { PostUserProperties } from './change-language.resource';

const allowedLocales = ['en', 'fr', 'it', 'pt'];
const user: any = {
  uuid: 'uuid',
  userProperties: {
    defaultLocale: 'fr',
  },
};

describe(`<ChangeLanguage />`, () => {
  let postUserPropertiesMock: PostUserProperties = jest.fn(() => Promise.resolve());

  it('should change user locale', async () => {
    const userSetup = userEvent.setup();
    postUserPropertiesMock = jest.fn(() => Promise.resolve());

    render(<ChangeLanguageModal close={jest.fn()} />);
    expect(screen.getByLabelText(/Select locale/)).toHaveValue('fr');
    await userSetup.selectOptions(screen.getByLabelText(/Select locale/i), 'en');
    expect(postUserPropertiesMock).toHaveBeenCalledWith(user.uuid, { defaultLocale: 'en' }, expect.anything());
  });
});
