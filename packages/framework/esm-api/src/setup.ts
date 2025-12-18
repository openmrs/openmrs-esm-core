import { defineConfigSchema } from '@openmrs/esm-config';
import { refetchCurrentUser } from './current-user';
import { configSchema } from './config-schema';

/**
 * @internal
 */
export function setupApiModule() {
  defineConfigSchema('@openmrs/esm-api', configSchema);

  refetchCurrentUser();
}
