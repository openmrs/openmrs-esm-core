module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  globals: {
    System: {},
  },
  moduleNameMapper: {
    "lodash-es": "lodash",
    "\\.(css)$": "identity-obj-proxy",
    "@openmrs/esm-api": "<rootDir>/__mocks__/openmrs-esm-api.mock.tsx",
    "@openmrs/esm-config": "<rootDir>/__mocks__/openmrs-esm-config.mock.tsx",
    "@openmrs/esm-extensions":
      "<rootDir>/__mocks__/openmrs-esm-extensions.mock.tsx",
    "@openmrs/esm-styleguide":
      "<rootDir>/__mocks__/openmrs-esm-styleguide.mock.tsx",
    "@openmrs/esm-react-utils":
      "<rootDir>/__mocks__/openmrs-esm-react-utils.mock.tsx",
  },
};
