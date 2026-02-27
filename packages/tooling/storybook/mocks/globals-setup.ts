// Sets up the global variables that the OpenMRS framework expects to find
// on window. Without these, components that call interpolateUrl() or
// reference openmrsBase will throw at runtime.
(window as any).openmrsBase = '/openmrs';
(window as any).spaBase = '/openmrs/spa';
(window as any).getOpenmrsSpaBase = () => '/openmrs/spa/';
(window as any).i18next = { language: 'en' };
