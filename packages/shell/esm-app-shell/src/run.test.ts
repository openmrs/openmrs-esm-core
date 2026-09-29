// Boot is left pending forever so the only error page these tests can see is the one raised by a
// failed session fetch, not the one `handleInitFailure` renders for a failed startup.
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface SessionState {
  loaded: boolean;
  session: unknown;
  error?: Error;
}

const harness = vi.hoisted(() => ({
  listeners: new Set<(state: SessionState) => void>(),
  push(state: SessionState) {
    this.listeners.forEach((listener) => listener(state));
  },
}));

vi.mock('@openmrs/esm-framework/src/internal', () => {
  const noop = () => {};
  return {
    finishRegisteringAllApps: noop,
    fireOpenmrsEvent: noop,
    getConfig: noop,
    getCoreTranslation: noop,
    getCurrentRouteMap: noop,
    getSessionStore: () => ({
      getState: () => ({ loaded: false, session: null }),
      subscribe: (listener: (state: SessionState) => void) => {
        harness.listeners.add(listener);
        return () => harness.listeners.delete(listener);
      },
    }),
    integrateBreakpoints: noop,
    interpolateUrl: (url: string) => url,
    provide: noop,
    registerApp: noop,
    registerDefaultCalendar: noop,
    renderActionableNotifications: noop,
    renderInlineNotifications: noop,
    renderLoadingSpinner: () => noop,
    renderSnackbars: noop,
    renderToasts: noop,
    renderWorkspaceWindowsAndMenu: noop,
    setupApiModule: noop,
    setupHistory: noop,
    setupImportMapOverrides: noop,
    setupModals: noop,
    setupRouteMapOverrides: () => new Promise(() => {}),
    showActionableNotification: noop,
    showNotification: noop,
    showSnackbar: noop,
    showToast: noop,
    subscribeActionableNotificationShown: noop,
    subscribeNotificationShown: noop,
    subscribeSnackbarShown: noop,
    subscribeToastShown: noop,
    tryRegisterExtension: noop,
  };
});

vi.mock('single-spa', () => ({ start: () => {} }));
vi.mock('@openmrs/esm-styleguide/src/index', () => ({ setupStyleguide: () => {} }));
vi.mock('./locale', () => ({ setupI18n: () => {} }));
vi.mock('./routing-events', () => ({}));
vi.mock('./events', () => ({}));
vi.mock('./ui', () => ({ appName: '@openmrs/esm-app-shell', getCoreExtensions: () => [] }));
vi.mock('./core-config', () => ({ setupCoreConfig: () => {} }));

import { run } from './run';

const errorPage = () => document.querySelector('.omrs-app-error');

describe('the session error page', () => {
  beforeEach(() => {
    harness.listeners.clear();
    document.body.innerHTML = `
      <template id="app-error">
        <div class="omrs-app-error"><code data-var="message"></code></div>
      </template>`;
    vi.stubGlobal('fetch', () => new Promise(() => {}));
    run([]);
  });

  it('is shown when the session fails to load', () => {
    harness.push({ loaded: false, session: null, error: new Error('Bad Gateway') });

    expect(errorPage()?.textContent).toBe('Bad Gateway');
  });

  it('is shown only once when the session fails to load repeatedly', () => {
    harness.push({ loaded: false, session: null, error: new Error('Bad Gateway') });
    harness.push({ loaded: false, session: null, error: new Error('Bad Gateway') });

    expect(document.querySelectorAll('.omrs-app-error')).toHaveLength(1);
  });

  it('is taken down when a later session fetch succeeds', () => {
    harness.push({ loaded: false, session: null, error: new Error('Bad Gateway') });
    harness.push({ loaded: true, session: { authenticated: true } });

    expect(errorPage()).toBeNull();
    expect(harness.listeners.size).toBe(0);
  });

  it('is not shown when the session loads first', () => {
    harness.push({ loaded: true, session: { authenticated: true } });

    expect(errorPage()).toBeNull();
    expect(harness.listeners.size).toBe(0);
  });
});
