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
    "@openmrs/esm-config":
      "<rootDir>/__mocks__/openmrs-esm-module-config.mock.tsx",
    "@openmrs/esm-api": "<rootDir>/__mocks__/openmrs-esm-api.mock.tsx",
    "@openmrs/esm-context": "<rootDir>/__mocks__/openmrs-esm-context.mock.tsx",
    "@openmrs/esm-extensions":
      "<rootDir>/__mocks__/openmrs-esm-extension-manager.mock.tsx",
  },
};
