// Boot stays pending until a test calls `harness.boot()`, and a started boot always succeeds, so the only
// error page these tests can see is the one raised by a failed session fetch, not the one
// `handleInitFailure` renders for a failed startup.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

interface SessionState {
  loaded: boolean;
  session: unknown;
  error?: Error;
  initializing?: boolean;
}

const harness = vi.hoisted(() => {
  let releaseBoot: () => void = () => {};
  return {
    refetchCurrentUser: vi.fn(() => Promise.reject()),
    removeServerStartingPage: vi.fn(),
    renderServerStartingPage: vi.fn(),
    listeners: new Set<(state: SessionState) => void>(),
    state: { loaded: false, session: null } as SessionState,
    bootGate: Promise.resolve(),
    reset() {
      this.listeners.clear();
      this.state = { loaded: false, session: null };
      this.bootGate = new Promise<void>((resolve) => (releaseBoot = resolve));
    },
    boot() {
      releaseBoot();
    },
    push(state: SessionState) {
      this.state = state;
      this.listeners.forEach((listener) => listener(state));
    },
  };
});

vi.mock('@openmrs/esm-framework/src/internal', () => {
  const noop = () => {};
  return {
    finishRegisteringAllApps: noop,
    fireOpenmrsEvent: noop,
    getConfig: async () => ({ preferredCalendar: {} }),
    getCoreTranslation: noop,
    getCurrentRouteMap: async () => ({ routes: {} }),
    getSessionStore: () => ({
      getState: () => harness.state,
      subscribe: (listener: (state: SessionState) => void) => {
        harness.listeners.add(listener);
        return () => harness.listeners.delete(listener);
      },
    }),
    integrateBreakpoints: noop,
    interpolateUrl: (url: string) => url,
    makeUrl: (path: string) => `/openmrs${path}`,
    provide: noop,
    refetchCurrentUser: harness.refetchCurrentUser,
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
    setupRouteMapOverrides: () => harness.bootGate,
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
// Node has no `Intl.DurationFormat`, and fake timers can't flush the dynamic import `run()` loads the polyfill with.
vi.mock('@formatjs/intl-durationformat/lib/polyfill', () => ({}));
vi.mock('@openmrs/esm-styleguide/src/index', () => ({ setupStyleguide: () => {} }));
vi.mock('./locale', () => ({ setupI18n: () => {} }));
vi.mock('./static-page-translations', () => ({ translateStaticPage: () => {} }));
vi.mock('./routing-events', () => ({}));
vi.mock('./events', () => ({}));
vi.mock('./ui', () => ({ appName: '@openmrs/esm-app-shell', getCoreExtensions: () => [] }));
vi.mock('./ui/server-starting.component', () => ({ renderServerStartingPage: harness.renderServerStartingPage }));
vi.mock('./core-config', () => ({ setupCoreConfig: () => {} }));

import { run } from './run';

const errorPage = () => document.querySelector('.omrs-app-error');
const startingUp: SessionState = {
  loaded: false,
  session: null,
  error: new Error('The server is still starting up'),
  initializing: true,
};

describe('the session error page', () => {
  beforeEach(() => {
    harness.reset();
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

  it('copies only the error message and briefly shows that it was copied', () => {
    vi.useFakeTimers();
    const copyText = vi.fn();
    vi.stubGlobal('copyText', copyText);
    document.body.innerHTML = `
      <template id="app-error">
        <div class="omrs-app-error">
          <code data-var="message"></code>
          <span class="cds--popover-container"><button data-copy-btn></button><span>Copied!</span></span>
        </div>
      </template>`;
    harness.push({ loaded: false, session: null, error: new Error('Bad Gateway') });

    document.querySelector<HTMLButtonElement>('[data-copy-btn]')!.click();
    expect(copyText).toHaveBeenCalledWith(document.querySelector('.omrs-app-error code'));
    expect(document.querySelector('.cds--popover-container')).toHaveClass('cds--popover--open');

    vi.advanceTimersByTime(2000);
    expect(document.querySelector('.cds--popover-container')).not.toHaveClass('cds--popover--open');
    vi.useRealTimers();
  });
});

describe('the server starting page', () => {
  // A successful boot defines non-configurable globals, so they are made configurable here to let each
  // test boot again.
  const defineProperty = Object.defineProperty;
  let defineSpy: { mockRestore(): void };

  beforeEach(() => {
    defineSpy = vi
      .spyOn(Object, 'defineProperty')
      .mockImplementation((target, key, descriptor) =>
        defineProperty(target, key, target === window ? { ...descriptor, configurable: true } : descriptor),
      );
    delete (window as any).installedModules;
    delete (window as any).applicationVersion;
    vi.useFakeTimers();
    harness.reset();
    harness.refetchCurrentUser.mockClear();
    harness.renderServerStartingPage.mockReset().mockReturnValue(harness.removeServerStartingPage);
    harness.removeServerStartingPage.mockClear();
    document.body.innerHTML = `
      <template id="app-error">
        <div class="omrs-app-error"><code data-var="message"></code></div>
      </template>`;
    vi.stubGlobal('fetch', () => new Promise(() => {}));
    run([]);
  });

  afterEach(() => {
    vi.useRealTimers();
    defineSpy.mockRestore();
  });

  const finishBoot = async () => {
    harness.boot();
    await vi.advanceTimersByTimeAsync(0);
  };

  it('waits for the app to boot before it is shown', async () => {
    harness.push(startingUp);
    expect(harness.renderServerStartingPage).not.toHaveBeenCalled();
    expect(errorPage()).toBeNull();

    await finishBoot();
    expect(harness.renderServerStartingPage).toHaveBeenCalledTimes(1);
  });

  it('is shown once when the server is still starting after boot', async () => {
    await finishBoot();
    harness.push(startingUp);
    harness.push(startingUp);

    expect(harness.renderServerStartingPage).toHaveBeenCalledTimes(1);
    expect(errorPage()).toBeNull();
  });

  it('polls the session while the server is starting up, even before boot finishes', async () => {
    harness.push(startingUp);
    harness.push(startingUp);
    expect(harness.refetchCurrentUser).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(5000);
    expect(harness.refetchCurrentUser).toHaveBeenCalledTimes(1);

    harness.push(startingUp);
    await vi.advanceTimersByTimeAsync(5000);
    expect(harness.refetchCurrentUser).toHaveBeenCalledTimes(2);
  });

  it('is taken down when the session loads', async () => {
    await finishBoot();
    harness.push(startingUp);
    harness.push({ loaded: true, session: { authenticated: false } });
    await vi.advanceTimersByTimeAsync(5000);

    expect(harness.removeServerStartingPage).toHaveBeenCalledTimes(1);
    expect(harness.refetchCurrentUser).not.toHaveBeenCalled();
    expect(harness.listeners.size).toBe(0);
  });

  it('is never shown if the session loads before boot finishes', async () => {
    harness.push(startingUp);
    harness.push({ loaded: true, session: { authenticated: false } });
    await finishBoot();

    expect(harness.renderServerStartingPage).not.toHaveBeenCalled();
  });

  it('is replaced by the error page when the session fails for another reason', async () => {
    await finishBoot();
    harness.push(startingUp);
    harness.push({ loaded: false, session: null, error: new Error('Bad Gateway') });

    expect(harness.removeServerStartingPage).toHaveBeenCalledTimes(1);
    expect(errorPage()?.textContent).toBe('Bad Gateway');
  });
});
