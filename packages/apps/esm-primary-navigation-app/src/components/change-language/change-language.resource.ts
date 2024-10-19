import { openmrsFetch, restBaseUrl, queueSynchronizationItemFor } from '@openmrs/esm-framework/src/internal';
import { userPropertyChange } from '../../constants';

export type PostUserProperties = (
  userUuid: string,
  userProperties: Record<string, string>,
  abortController?: AbortController,
) => Promise<void>;

export async function postUserPropertiesOnline(
  userUuid: string,
  userProperties: Record<string, string>,
  abortController: AbortController,
): Promise<void> {
  await openmrsFetch(`${restBaseUrl}/user/${userUuid}`, {
    method: 'POST',
    body: { userProperties },
    headers: { 'Content-Type': 'application/json' },
    signal: abortController.signal,
  });

  // Force the reload of the page to ensure all data coming from the backend is fetched in the newly set locale.
  window.location.reload();
}

export async function postUserPropertiesOffline(
  userUuid: string,
  userProperties: Record<string, string>,
): Promise<void> {
  await queueSynchronizationItemFor(userUuid, userPropertyChange, userProperties, {
    displayName: 'User Language Change',
  });
}
