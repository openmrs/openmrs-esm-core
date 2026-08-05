import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

export function initiateTotpEnrollment() {
  return openmrsFetch(`${restBaseUrl}/auth/totp/enrollment`, {
    method: 'POST',
  });
}

export function verifyTotpEnrollment(code: string) {
  return openmrsFetch(`${restBaseUrl}/auth/totp/enrollment/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      code,
    },
  });
}
