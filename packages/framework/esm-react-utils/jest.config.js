module.exports = {
  transform: {
    '^.+\\.(j|t)sx?$': ['@swc/jest'],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.js'],
  moduleNameMapper: {
    '^lodash-es/(.*)$': 'lodash/$1',
    '@openmrs/esm-error-handling': '<rootDir>/__mocks__/openmrs-esm-error-handling.mock.ts',
    '@openmrs/esm-state': '@openmrs/esm-state/mock',
    dexie: require.resolve('dexie'),
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
