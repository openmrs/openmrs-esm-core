import { validator } from '@openmrs/esm-framework';

/**
 * Referenced by name from the hand-written `config-schema.json`. A hand-written schema still gets a
 * `./config-validators` expose, which is the only way such a reference can resolve.
 */
export const validateTitle = validator(
  (title: unknown) => typeof title === 'string' && title.length < 40,
  'must be shorter than 40 characters',
);
