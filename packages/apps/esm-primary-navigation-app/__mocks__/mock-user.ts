export const mockUser = {
  authenticated: true,
  user: {
    uuid: 'uuid',
    display: 'admin',
    person: { uuid: 'uuid', display: 'Test User' },
    privileges: [],
    roles: [{ uuid: 'uuid', display: 'System Developer' }],
    username: 'testuser',
    userProperties: {
      defaultLocale: 'fr',
    },
  },
};

export const mockLoggedInUser = {
  uuid: 'uuid',
  username: 'Dr Healther Morgan',
  userProperties: {},
  person: {
    display: 'Dr Healther Morgan',
  },
};
