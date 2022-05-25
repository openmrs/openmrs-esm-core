module.exports = {
  transform: {
    "^.+\\.tsx?$": ["@swc/jest"],
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
    "lodash-es": "lodash",
    "@openmrs/esm-framework":
      "<rootDir>/__mocks__/openmrs-esm-framework.mock.tsx",
    "\\.(s?css)$": "identity-obj-proxy",
    "react-i18next": "<rootDir>/__mocks__/react-i18next.mock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
