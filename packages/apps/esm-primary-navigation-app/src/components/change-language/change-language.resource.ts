import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework/src/internal';

export type PostUserProperties = (
  userUuid: string,
  userProperties: Record<string, string>,
  abortController?: AbortController,
) => Promise<void>;

export async function updateUserProperties(
  userUuid: string,
  userProperties: Record<string, string>,
  abortController?: AbortController,
): Promise<void> {
  await openmrsFetch(`${restBaseUrl}/user/${userUuid}`, {
    method: 'POST',
    body: { userProperties },
    headers: { 'Content-Type': 'application/json' },
    signal: abortController?.signal,
  });

  // Force the reload of the page to ensure all data coming from the backend is fetched in the newly set locale.
  window.location.reload();
}

export async function updateSessionLocale(locale: string, abortController?: AbortController): Promise<void> {
  await openmrsFetch(`${restBaseUrl}/session`, {
    method: 'POST',
    body: { locale },
    headers: { 'Content-Type': 'application/json' },
    signal: abortController?.signal,
  });

  // Force the reload of the page to ensure all data coming from the backend is fetched in the newly set locale.
  window.location.reload();
}
