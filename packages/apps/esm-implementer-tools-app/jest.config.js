module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.m?[jt]sx?$': ['@swc/jest'],
  },
  globals: {
    System: {},
  },
  setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    '^lodash-es/(.*)$': 'lodash/$1',
    '\\.(s?css)$': 'identity-obj-proxy',
    '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
    dexie: require.resolve('dexie'),
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
