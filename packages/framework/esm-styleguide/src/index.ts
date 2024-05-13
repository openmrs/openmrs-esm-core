import { setupLogo } from './logo';
import { setupIcons } from './icons';
import { setupBranding } from './brand';
import { defineConfigSchema } from '@openmrs/esm-config';
import { esmStyleGuideSchema } from './config-schema';

export * from './breakpoints';
export * from './spinner';
export * from './notifications';
export * from './toasts';
export * from './snackbars';
export * from './modals';
export * from './workspaces';
export * from './left-nav';
export * from './error-state';
export * from './responsive-wrapper';
export * from './patient-banner';
export * from './patient-photo';
export * from './custom-overflow-menu';

defineConfigSchema('@openmrs/esm-styleguide', esmStyleGuideSchema);
setupBranding();
setupLogo();
setupIcons();
