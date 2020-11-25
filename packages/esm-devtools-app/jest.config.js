module.exports = {
  transform: {
    "\\.tsx?$": "babel-jest",
  },
  setupFiles: ["<rootDir>/src/setup-tests.tsx"],
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "@openmrs/esm-api": "<rootDir>/__mocks__/openmrs-esm-api.mock.tsx",
    "@openmrs/esm-react-utils":
      "<rootDir>/__mocks__/openmrs-esm-react-utils.mock.tsx",
  },
  globals: {
    System: {
      Node: null,
    },
  },
};
