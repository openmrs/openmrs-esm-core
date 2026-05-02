import { openmrsFetch } from '@openmrs/esm-framework';

export interface PasswordResetResponse {
  status: 'success' | 'error';
}

export async function requestPasswordReset(usernameOrEmail: string): Promise<PasswordResetResponse> {
  try {
    await openmrsFetch('/ws/rest/v1/passwordreset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameOrEmail }),
    });
    return { status: 'success' };
  } catch {
    // Always return success to avoid username/email enumeration
    return { status: 'success' };
  }
}