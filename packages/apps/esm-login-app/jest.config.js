module.exports = {
  transform: {
    "^.+\\.tsx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "@openmrs/esm-framework": "@openmrs/esm-framework/mock",
    "\\.(s?css)$": "identity-obj-proxy",
    "^lodash-es/(.*)$": "lodash/$1",
    dexie: require.resolve("dexie"),
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
