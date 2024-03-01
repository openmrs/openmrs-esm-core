import { setupLogo } from './logo';
import { setupIcons } from './icons';
import { setupBranding } from './brand';
import { defineConfigSchema } from '@openmrs/esm-framework';
import { esmStyleGuideSchema } from './config-schema';

export * from './breakpoints';
export * from './spinner';
export * from './notifications';
export * from './toasts';
export * from './snackbars';
export * from './modals';
export * from './overlays';
export * from './left-nav';
export * from './error-state';
export * from './datepicker';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

defineConfigSchema('@openmrs/esm-styleguide', esmStyleGuideSchema);
setupBranding();
setupLogo();
setupIcons();
