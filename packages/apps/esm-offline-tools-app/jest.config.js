module.exports = {
  transform: {
    "^.+\\.tsx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "^@carbon/icons-react/es/(.*)$": "@carbon/icons-react/lib/$1",
    "^carbon-components-react/es/(.*)$": "carbon-components-react/lib/$1",
    "\\.(s?css)$": "identity-obj-proxy",
  },
  setupFiles: ["<rootDir>/src/setup-tests.js"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
