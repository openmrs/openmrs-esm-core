module.exports = {
  transform: {
    '^.+\\.(j|t)sx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    dexie: 'dexie',
    'lodash-es': 'lodash',
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
