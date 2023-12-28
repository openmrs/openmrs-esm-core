import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangeLocale } from './change-locale.component';
import type { PostUserProperties } from './change-locale.resource';

const allowedLocales = ['en', 'fr', 'it', 'pt'];
const user: any = {
  uuid: 'uuid',
  userProperties: {
    defaultLocale: 'fr',
  },
};

describe(`<ChangeLocale />`, () => {
  let postUserPropertiesMock: PostUserProperties = jest.fn(() => Promise.resolve());

  it('should change user locale', async () => {
    const userSetup = userEvent.setup();
    postUserPropertiesMock = jest.fn(() => Promise.resolve());

    render(
      <ChangeLocale
        locale={'fr'}
        allowedLocales={allowedLocales}
        user={user}
        postUserProperties={postUserPropertiesMock}
      />,
    );
    expect(screen.getByLabelText(/Select locale/)).toHaveValue('fr');
    await userSetup.selectOptions(screen.getByLabelText(/Select locale/i), 'en');
    expect(postUserPropertiesMock).toHaveBeenCalledWith(user.uuid, { defaultLocale: 'en' }, expect.anything());
  });
});
