module.exports = {
  transform: {
    '\\.(m?j|t)sx?$': ['@swc/jest'],
  },
  setupFiles: ['<rootDir>/src/setup-tests.ts'],
  moduleNameMapper: {
    'lodash-es': 'lodash',
    '\\.(s?css)$': 'identity-obj-proxy',
    '@openmrs/esm-framework': '@openmrs/esm-framework/mock.tsx',
    dexie: require.resolve('dexie'),
  },
  globals: {
    System: {
      Node: null,
    },
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
