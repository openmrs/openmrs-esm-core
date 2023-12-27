import type { OmrsOfflineHttpHeaders } from '@openmrs/esm-framework';
import { omrsOfflineCachingStrategyHttpHeaderName } from '@openmrs/esm-framework';

export const routes = {
  home: `home`,
  offlineTools: `offline-tools`,
  offlineToolsPatients: `offline-tools/patients`,
  offlineToolsPatientOfflineData: `offline-tools/patients/:patientUuid/offline-data`,
  offlineToolsActions: `offline-tools/actions`,
};

export const cacheForOfflineHeaders: OmrsOfflineHttpHeaders = {
  [omrsOfflineCachingStrategyHttpHeaderName]: 'network-first',
};
