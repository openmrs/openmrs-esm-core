module.exports = {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  globals: {
    System: {},
  },
  moduleNameMapper: {
    "lodash-es": "lodash",
    "\\.(css)$": "identity-obj-proxy",
    "^@carbon/icons-react/es/(.*)$": "@carbon/icons-react/lib/$1",
    "^carbon-components-react/es/(.*)$": "carbon-components-react/lib/$1",
    "@openmrs/esm-framework":
      "@openmrs/esm-framework/mocks/openmrs-esm-framework.mock.tsx",
  },
};
