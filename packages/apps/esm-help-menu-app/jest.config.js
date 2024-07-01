module.exports = {
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  setupFiles: ['<rootDir>/src/setup-tests.ts'],
  moduleNameMapper: {
    'lodash-es': 'lodash',
    '^lodash-es/(.*)$': 'lodash/$1',
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
