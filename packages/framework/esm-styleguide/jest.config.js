module.exports = {
  transform: {
    '\\.[jt]sx?$': '@swc/jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/fileTransformer.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!@openmrs)'],
  moduleNameMapper: {
    '\\.(s?css)$': 'identity-obj-proxy',
    '^@carbon/charts': 'identity-obj-proxy',
    '@openmrs/esm-react-utils': '@openmrs/esm-react-utils/mock',
    '@openmrs/esm-translations': '@openmrs/esm-translations/mock',
    'single-spa': 'single-spa',
    '^lodash-es/(.*)$': 'lodash/$1',
    'lodash-es': 'lodash',
    dexie: 'dexie',
  },
  collectCoverageFrom: [
    '**/src/**/*.component.tsx',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/src/**/*.test.*',
    '!**/src/declarations.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
};
