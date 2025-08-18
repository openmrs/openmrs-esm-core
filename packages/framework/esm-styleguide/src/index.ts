import { defineConfigSchema } from '@openmrs/esm-config';
import { setupLogo } from './logo';
import { setupIcons } from './icons/icon-registration';
import { setupBranding } from './brand';
import { esmStyleGuideSchema } from './config-schema';
import { setupPictograms } from './pictograms/pictogram-registration';

defineConfigSchema('@openmrs/esm-styleguide', esmStyleGuideSchema);
setupBranding();
setupLogo();
setupIcons();
setupPictograms();
