module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  setupFiles: [],
  moduleNameMapper: {
    "@openmrs/esm-globals": "<rootDir>/__mocks__/openmrs-esm-globals.mock.tsx",
  },
};
