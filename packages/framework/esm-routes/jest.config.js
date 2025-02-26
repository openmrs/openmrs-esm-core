module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.(m?j|t)sx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    'lodash-es': 'lodash',
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
