module.exports = {
  transform: {
    "^.+\\.(m?j|t)sx?$": ["@swc/jest"],
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
