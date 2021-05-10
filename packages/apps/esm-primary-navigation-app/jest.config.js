module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
    "lodash-es": "lodash",
    "^@carbon/icons-react/es/(.*)$": "@carbon/icons-react/lib/$1",
    "^carbon-components-react/es/(.*)$": "carbon-components-react/lib/$1",
    "@openmrs/esm-framework":
      "<rootDir>/__mocks__/openmrs-esm-framework.mock.tsx",
    "\\.(s?css)$": "identity-obj-proxy",
    "react-i18next": "<rootDir>/__mocks__/react-i18next.mock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
