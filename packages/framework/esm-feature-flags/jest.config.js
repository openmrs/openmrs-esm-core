module.exports = {
  transform: {
    "^.+\\.tsx?$": ["@swc/jest"],
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
