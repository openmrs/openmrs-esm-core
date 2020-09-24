module.exports = {
  setupFiles: ["<rootDir>/src/setup-tests.js"],
  moduleNameMapper: {
    "@openmrs/esm-module-config":
      "<rootDir>/__mocks__/openmrs-esm-module-config.mock.tsx",
  },
};
