import { getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import Help from './help-menu/help.component';
import Release from './help-menu/components/release-notes.component';
import Docs from './help-menu/components/docs.component';
import contactus from './help-menu/components/contact-us.component';
export const importTranslation = () => Promise.resolve();

const options = {
  featureName: 'help-menu',
  moduleName: '@openmrs/esm-help-menu-app',
};

export const helpMenu = getAsyncLifecycle(() => import('./help-menu/help.component'), options);
export const help = getSyncLifecycle(Help, options);

export const releaseNotes = getSyncLifecycle(Release, options);
export const docs = getSyncLifecycle(Docs, options);
export const contact = getSyncLifecycle(contactus, options);
