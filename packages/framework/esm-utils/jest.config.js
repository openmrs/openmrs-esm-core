module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    'lodash-es': 'lodash',
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
