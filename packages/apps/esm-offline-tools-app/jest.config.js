module.exports = {
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    '\\.(s?css)$': 'identity-obj-proxy',
  },
  setupFiles: ['<rootDir>/src/setup-tests.js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
