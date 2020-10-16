module.exports = {
  setupFiles: ["<rootDir>/src/setup-tests.js"],
  moduleNameMapper: {
    "@openmrs/esm-context": "<rootDir>/__mocks__/openmrs-esm-context.mock.tsx",
  },
};
