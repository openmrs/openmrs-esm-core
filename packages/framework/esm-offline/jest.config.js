module.exports = {
  transform: {
    "^.+\\.tsx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "^lodash-es/(.*)$": "lodash/$1",
    // See https://jestjs.io/docs/upgrading-to-jest28#packagejson-exports
    // which links to https://github.com/microsoft/accessibility-insights-web/pull/5421#issuecomment-1109168149
    dexie: require.resolve("dexie"),
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
