import { defineConfigSchema } from '@openmrs/esm-config';
import { registerModal } from '@openmrs/esm-extensions';
import { getSyncLifecycle } from '@openmrs/esm-react-utils';
import { setupBranding } from './brand';
import { esmStyleGuideSchema } from './config-schema';
import { setupEmptyCard } from './empty-card/empty-card-registration';
import { setupIcons } from './icons/icon-registration';
import { setupLogo } from './logo';
import { setupPictograms } from './pictograms/pictogram-registration';
import { flushSvgs } from './svg-utils';
import Workspace2ClosePromptModal from './workspaces2/workspace2-close-prompt.modal';

/** Registers the styleguide's config schema, branding, icons, and modals. The app shell calls this once at startup. */
export function setupStyleguide() {
  defineConfigSchema('@openmrs/esm-styleguide', esmStyleGuideSchema);
  setupBranding();
  setupLogo();
  setupIcons();
  setupPictograms();
  setupEmptyCard();
  flushSvgs();

  registerModal({
    name: 'workspace2-close-prompt',
    moduleName: '@openmrs/esm-styleguide',
    load: getSyncLifecycle(Workspace2ClosePromptModal, {
      featureName: 'workspace2-close-prompt',
      moduleName: '@openmrs/esm-styleguide',
    }),
  });
}
