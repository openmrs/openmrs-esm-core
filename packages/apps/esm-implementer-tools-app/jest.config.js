module.exports = {
  transform: {
    "^.+\\.tsx?$": ["@swc/jest"],
  },
  globals: {
    System: {},
  },
  moduleNameMapper: {
    "lodash-es": "lodash",
    "\\.(s?css)$": "identity-obj-proxy",
    "@openmrs/esm-framework": "@openmrs/esm-framework/mock.tsx",
    dexie: require.resolve("dexie"),
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
