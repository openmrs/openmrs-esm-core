module.exports = {
  transform: {
    "\\.tsx?$": ["@swc/jest"],
  },
  setupFiles: ["<rootDir>/src/setup-tests.tsx"],
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "@openmrs/esm-framework": "@openmrs/esm-framework/mock.tsx",
    "react-i18next": "<rootDir>/__mocks__/react-i18next.mock.js",
  },
  globals: {
    System: {
      Node: null,
    },
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
