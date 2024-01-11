module.exports = {
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    'lodash-es': 'lodash',
    '@openmrs/esm-config': '<rootDir>/__mocks__/openmrs-esm-config.mock.ts',
    '@openmrs/esm-error-handling': '<rootDir>/__mocks__/openmrs-esm-error-handling.mock.ts',
    '@openmrs/esm-navigation': '<rootDir>/__mocks__/openmrs-esm-navigation.mock.ts',
    'single-spa': '<rootDir>/__mocks__/single-spa.mock.ts',
    dexie: require.resolve('dexie'),
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
