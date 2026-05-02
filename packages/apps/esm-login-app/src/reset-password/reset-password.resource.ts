import { openmrsFetch } from '@openmrs/esm-framework';

export interface PasswordResetResponse {
  status: 'success' | 'not_found' | 'no_email';
}

export async function requestPasswordReset(usernameOrEmail: string): Promise<PasswordResetResponse> {
  try {
    const response = await openmrsFetch('/ws/rest/v1/passwordreset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameOrEmail }),
    });

    if (response.status === 404) {
      return { status: 'not_found' };
    }

    if (response.status === 422) {
      return { status: 'no_email' };
    }

    return { status: 'success' };
  } catch {
    // Swallow — treat as success to avoid username enumeration
    return { status: 'success' };
  }
}