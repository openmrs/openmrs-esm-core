import openmrs from '@openmrs/eslint-config';

export default [
  {
    ignores: ['**/dist/**', '**/*.d.ts'],
  },
  ...openmrs,
];
