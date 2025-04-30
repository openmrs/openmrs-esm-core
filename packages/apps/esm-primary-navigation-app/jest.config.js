module.exports = {
  clearMocks: true,
  transform: {
    '\\.(m?j|t)sx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
    'lodash-es': 'lodash',
    '@openmrs/esm-framework': '@openmrs/esm-framework/mock',
    '\\.(s?css)$': 'identity-obj-proxy',
    'react-i18next': '<rootDir>/__mocks__/react-i18next.mock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
