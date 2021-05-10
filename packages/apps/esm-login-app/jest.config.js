module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@carbon/icons-react/es/(.*)$": "@carbon/icons-react/lib/$1",
    "^carbon-components-react/es/(.*)$": "carbon-components-react/lib/$1",
    "@openmrs/esm-framework":
      "<rootDir>/__mocks__/openmrs-esm-framework.mock.tsx",
    "\\.(s?css)$": "identity-obj-proxy",
    "lodash-es/debounce": "<rootDir>/__mocks__/lodash.debounce.mock.ts",
    "lodash-es/isEmpty": "<rootDir>/__mocks__/lodash.isEmpty.mock.ts",
  },
  setupFiles: ["<rootDir>/src/setup-tests.js"],
};
