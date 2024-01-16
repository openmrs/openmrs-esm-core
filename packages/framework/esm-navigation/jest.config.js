module.exports = {
  moduleNameMapper: {},
  setupFiles: ['<rootDir>/src/setup-tests.js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
};
