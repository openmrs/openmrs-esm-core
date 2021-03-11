module.exports = {
  transform: {
    "\\.tsx?$": "babel-jest",
  },
  setupFiles: ["<rootDir>/src/setup-tests.tsx"],
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy",
    "@openmrs/esm-framework": "@openmrs/esm-framework/mock.tsx",
  },
  globals: {
    System: {
      Node: null,
    },
  },
};
