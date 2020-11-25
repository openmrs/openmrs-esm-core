module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  setupFiles: ["<rootDir>/src/setup-tests.js"],
  moduleNameMapper: {
    "@openmrs/esm-styleguide":
      "<rootDir>/__mocks__/openmrs-esm-styleguide.mock.tsx",
  },
};
