import { Content } from '@carbon/react';
import { Type, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

export function changeUserPassword(oldPassword: string, newPassword: string) {
  return openmrsFetch(`${restBaseUrl}/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      oldPassword,
      newPassword,
    },
  });
}
