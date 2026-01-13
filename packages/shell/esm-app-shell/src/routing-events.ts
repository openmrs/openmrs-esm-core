import { fireOpenmrsEvent, type OpenmrsEventTypes, subscribeOpenmrsEvent } from '@openmrs/esm-framework/src/internal';

interface BeforeRoutingEventPayload {
  appsByNewStatus: {
    MOUNTED: Array<string>;
    NOT_MOUNTED: Array<string>;
    NOT_LOADED: Array<string>;
    SKIP_BECAUSE_BROKEN: Array<string>;
  };
  totalAppChanges: number;
  oldUrl: string;
  newUrl: string;
  cancelNavigation(val?: boolean | Promise<boolean>): void;
}

function isBeforeRoutingEvent(event: Event): event is Event & { detail: BeforeRoutingEventPayload } {
  return (
    'detail' in event &&
    typeof event['detail'] === 'object' &&
    event.detail !== null &&
    'appsByNewStatus' in event.detail &&
    typeof event.detail.appsByNewStatus === 'object' &&
    event.detail.appsByNewStatus !== null &&
    'cancelNavigation' in event.detail &&
    typeof event.detail.cancelNavigation === 'function'
  );
}

let isEnabled = false;

subscribeOpenmrsEvent('started', () => (isEnabled = true));

// This event listener translates the single-spa:before-routing-event into a custom event
// for the page about to be rendered
window.addEventListener('single-spa:before-routing-event', (event: Event) => {
  if (isEnabled && isBeforeRoutingEvent(event)) {
    if (event.detail.totalAppChanges > 0) {
      const mountedApp = event.detail.appsByNewStatus.MOUNTED.find(
        (it) =>
          !it.startsWith('@openmrs/esm-primary-navigation-app') &&
          !it.startsWith('@openmrs/esm-devtools-app') &&
          !it.startsWith('@openmrs/esm-help-menu-app'),
      );

      const payload: OpenmrsEventTypes['before-page-changed'] = {
        cancelNavigation: event.detail.cancelNavigation,
        newPage: undefined,
        oldUrl: event.detail.oldUrl,
        newUrl: event.detail.newUrl,
      };

      if (mountedApp) {
        payload.newPage = mountedApp;
      }

      fireOpenmrsEvent('before-page-changed', payload);
    }
  }
});
