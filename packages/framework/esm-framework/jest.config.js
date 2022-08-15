module.exports = {
  transform: {
    "^.+\\.(j|t)sx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "\\.(s?css)$": "identity-obj-proxy",
    "\\.(svg)$": "<rootDir>/__mocks__/fileMock.js",
    "lodash-es/(.*)": "lodash/$1",
    // See https://jestjs.io/docs/upgrading-to-jest28#packagejson-exports
    // which links to https://github.com/microsoft/accessibility-insights-web/pull/5421#issuecomment-1109168149
    "^dexie$": require.resolve("dexie"),
    "^uuid$": require.resolve("uuid"),
  },
  setupFilesAfterEnv: ["<rootDir>/src/integration-tests/setup-tests.ts"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
