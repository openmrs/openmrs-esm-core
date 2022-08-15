module.exports = {
  transform: {
    "^.+\\.(j|t)sx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "lodash-es": "lodash",
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
