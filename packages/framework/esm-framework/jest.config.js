module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(s?css)$": "identity-obj-proxy",
    "lodash-es/(.*)": "lodash/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/integration-tests/setup-tests.ts"],
};
