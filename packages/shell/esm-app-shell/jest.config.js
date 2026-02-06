/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  transform: {
    '^.+\\.[jt]sx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    '@openmrs/esm-framework/src/internal': '<rootDir>/../../framework/esm-emr-api/src/events/index.ts',
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
};
