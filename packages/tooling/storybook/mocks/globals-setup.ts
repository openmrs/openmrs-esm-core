import { registerDefaultCalendar } from '@openmrs/esm-utils';

// Sets up the global variables that the OpenMRS framework expects to find
// on window. Without these, components that call interpolateUrl() or
// reference openmrsBase will throw at runtime.
(window as any).openmrsBase = '/openmrs';
(window as any).spaBase = '/openmrs/spa';
(window as any).getOpenmrsSpaBase = () => '/openmrs/spa/';
(window as any).i18next = { language: 'en' };

// Register non-Gregorian calendars for locales that use them by default.
// In the real app, the app shell reads preferredCalendar from config and
// calls registerDefaultCalendar() at startup. We replicate that here
// using the same defaults from the styleguide config schema.
registerDefaultCalendar('am', 'ethiopic');
