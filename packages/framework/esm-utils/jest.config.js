module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
