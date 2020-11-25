module.exports = {
  setupFiles: ["<rootDir>/src/setup-tests.js"],
  moduleNameMapper: {
    "@openmrs/esm-config": "<rootDir>/__mocks__/openmrs-esm-config.mock.tsx",
  },
};
