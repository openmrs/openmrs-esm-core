module.exports = {
  transform: {
    "^.+\\.(j|t)sx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "lodash-es/(.*)": "lodash/$1",
  },
};
