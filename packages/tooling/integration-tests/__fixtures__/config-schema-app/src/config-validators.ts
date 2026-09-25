import { validator } from '@openmrs/esm-framework';

/** A cross-field check, exported so that the artifact can refer to it by name. */
export const validateGreeting = validator(
  (config: { label?: string; count?: number }) => !config?.label || (config.count ?? 0) > 0,
  'A label requires a positive count.',
);
