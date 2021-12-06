module.exports = {
  setupFiles: ["<rootDir>/src/setup-tests.js"],
  moduleNameMapper: {
    "lodash-es/(.*)": "lodash/$1",
    "@openmrs/esm-config": "<rootDir>/__mocks__/openmrs-esm-config.mock.tsx",
  },
};
