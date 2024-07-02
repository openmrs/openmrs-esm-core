import { getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';

import ReleaseNotesComponent from './help-menu/components/release-notes.component';
import DocsComponent from './help-menu/components/docs.component';
import ContactUsComponent from './help-menu/components/contact-us.component';
export const importTranslation = () => Promise.resolve();

const options = {
  featureName: 'help-menu',
  moduleName: '@openmrs/esm-help-menu-app',
};

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const releaseNotes = getSyncLifecycle(ReleaseNotesComponent, options);
export const docs = getSyncLifecycle(DocsComponent, options);
export const contact = getSyncLifecycle(ContactUsComponent, options);
