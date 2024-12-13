module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.(m?j|t)sx?$': ['@swc/jest'],
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
