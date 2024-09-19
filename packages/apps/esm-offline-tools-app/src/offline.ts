import {
  type FetchConfig,
  fhirBaseUrl,
  makeUrl,
  messageOmrsServiceWorker,
  openmrsFetch,
  setupDynamicOfflineDataHandler,
} from '@openmrs/esm-framework';
import { cacheForOfflineHeaders } from './constants';

export function setupOffline() {
  setupDynamicOfflineDataHandler({
    id: 'esm-offline-tools-app:patient',
    displayName: 'Offline tools',
    type: 'patient',
    async isSynced(identifier) {
      const expectedUrls = [`/ws/fhir2/R4/Patient/${identifier}`];
      const absoluteExpectedUrls = expectedUrls.map((url) => window.origin + makeUrl(url));
      const cache = await caches.open('omrs-spa-cache-v1');
      const keys = (await cache.keys()).map((key) => key.url);
      return absoluteExpectedUrls.every((url) => keys.includes(url));
    },
    async sync(identifier) {
      await messageOmrsServiceWorker({
        type: 'registerDynamicRoute',
        pattern: `/ws/fhir2/R4/Patient/${identifier}`,
      });

      await fetchPatientData(identifier, {
        headers: cacheForOfflineHeaders,
      });
    },
  });
}

export async function fetchPatientData(patientUuid: string, fetchInit?: FetchConfig): Promise<fhir.Patient | null> {
  try {
    const onlinePatient = await openmrsFetch<fhir.Patient>(`${fhirBaseUrl}/Patient/${patientUuid}`, fetchInit);
    if (onlinePatient.ok) {
      return onlinePatient.data;
    }
  } catch (err) {
    // If online fetch fails, try offline
    console.error('Failed to fetch patient online:', err);
  }
}
