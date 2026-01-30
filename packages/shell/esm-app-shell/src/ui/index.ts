export const appName = '@openmrs/esm-app-shell';

export function getCoreExtensions() {
  return [
    {
      name: 'breadcrumbs-widget',
      slot: 'breadcrumbs-slot',
      component: 'breadcrumbs',
      online: true,
      offline: true,
    },
  ];
}
