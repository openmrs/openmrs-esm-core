module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  setupFiles: ["<rootDir>/src/setup-tests.js"],
  moduleNameMapper: {
    "lodash-es": "lodash",
    "@openmrs/esm-error-handling":
      "<rootDir>/__mocks__/openmrs-esm-error-handling.mock.ts",
    "@openmrs/esm-state": "<rootDir>/__mocks__/openmrs-esm-state.mock.ts",
    "@openmrs/esm-styleguide":
      "<rootDir>/__mocks__/openmrs-esm-styleguide.mock.tsx",
  },
};
