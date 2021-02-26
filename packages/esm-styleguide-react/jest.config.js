module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(s?css)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png)$": "<rootDir>/__mocks__/file.mock.ts"
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"]
};
