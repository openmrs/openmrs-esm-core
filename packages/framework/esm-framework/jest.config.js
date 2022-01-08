module.exports = {
  transform: {
    "^.+\\.(j|t)sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(s?css)$": "identity-obj-proxy",
    "\\.(svg)$": "<rootDir>/__mocks__/fileMock.js",
    "lodash-es/(.*)": "lodash/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/integration-tests/setup-tests.ts"],
};
