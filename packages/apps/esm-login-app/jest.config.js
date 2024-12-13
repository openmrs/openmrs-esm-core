module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
    '\\.(s?css)$': 'identity-obj-proxy',
    '^lodash-es/(.*)$': 'lodash/$1',
    'lodash-es': 'lodash',
    dexie: require.resolve('dexie'),
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
