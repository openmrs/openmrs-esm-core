import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

export function changeUserPassword(oldPassword: string, newPassword: string) {
  return openmrsFetch(`${restBaseUrl}/password`, {
    method: 'POST',
    body: {
      oldPassword,
      newPassword,
    },
  });
}
