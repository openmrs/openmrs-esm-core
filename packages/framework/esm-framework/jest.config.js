module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(s?css)$": "identity-obj-proxy",
    "lodash-es": "lodash",
    "lodash-es/(.*)": "lodash/\1",
  },
  setupFiles: ["<rootDir>/src/integration-tests/setup-tests.js"],
};
