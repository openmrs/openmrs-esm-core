import { openmrsFetch } from '@openmrs/esm-framework';

export async function performPasswordChange(oldPassword: string, newPassword: string) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/password`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: {
      "oldPassword": oldPassword,
      "newPassword": newPassword,
    },
    signal: abortController.signal,
  }).then((res) => {
    return res;
  });
}
