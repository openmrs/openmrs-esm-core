import { start } from 'single-spa';
import { type CalendarIdentifier } from '@internationalized/date';
import {
  type Config,
  type ExtensionDefinition,
  finishRegisteringAllApps,
  fireOpenmrsEvent,
  getConfig,
  getCoreTranslation,
  getCurrentRouteMap,
  getSessionStore,
  integrateBreakpoints,
  interpolateUrl,
  type OpenmrsRoutes,
  type SessionStore,
  provide,
  refetchCurrentUser,
  registerApp,
  registerDefaultCalendar,
  renderActionableNotifications,
  renderInlineNotifications,
  renderLoadingSpinner,
  renderSnackbars,
  renderToasts,
  renderWorkspaceWindowsAndMenu,
  setupApiModule,
  setupHistory,
  setupImportMapOverrides,
  setupModals,
  setupRouteMapOverrides,
  showActionableNotification,
  showNotification,
  showSnackbar,
  showToast,
  subscribeActionableNotificationShown,
  subscribeNotificationShown,
  subscribeSnackbarShown,
  subscribeToastShown,
  type StyleguideConfigObject,
  tryRegisterExtension,
} from '@openmrs/esm-framework/src/internal';
import { setupStyleguide } from '@openmrs/esm-styleguide/src/index';
import { setupI18n } from './locale';
import { translateStaticPage } from './static-page-translations';
// imported so we create the MF shares for these
import 'swr/mutation';
import 'swr/subscription';
import './routing-events';
import './events';
import { appName, getCoreExtensions } from './ui';
import { renderServerStartingPage } from './ui/server-starting.component';
import { setupCoreConfig } from './core-config';

// @internal
// used to track when the window.installedModules global is finalised
// so we can pre-load all modules
const REGISTRATION_PROMISES = Symbol('openmrs_registration_promises');

let initialRouteMap: OpenmrsRoutes;

/**
 * Sets up the frontend modules (apps). Uses the defined export
 * from the root modules of the apps. This is done by reading the
 * list of apps from the routes.registry.json file, which serves
 * as the registry of all apps in the application.
 */
async function setupApps() {
  await setupRouteMapOverrides();
  const routes = (initialRouteMap = await getCurrentRouteMap());

  const modules: typeof window.installedModules = [];
  const registrationPromises = Object.entries(routes.routes).map(async ([module, appRoutes]) => {
    modules.push([module, appRoutes]);
    registerApp(module, appRoutes);
  });

  window[REGISTRATION_PROMISES] = Promise.all(registrationPromises);
  Object.defineProperty(window, 'installedModules', {
    value: modules,
    writable: false,
    configurable: false,
  });
}

/**
 * Loads the provided configurations and sets them in the system.
 */
async function loadConfigs(configs: Array<{ name: string; value: Config }>) {
  for (const config of configs) {
    provide(config.value, config.name);
  }
}

/**
 * Runs the shell by importing the translations and starting single SPA.
 */
async function runShell() {
  try {
    await setupI18n();
  } catch (err) {
    console.error(`Failed to initialize translation system`, err);
  }

  const applicationVersion = initialRouteMap.version;
  if (applicationVersion === undefined || applicationVersion === null || applicationVersion.trim().length === 0) {
    Object.defineProperty(window, 'applicationVersion', {
      value: undefined,
      writable: false,
      configurable: false,
    });
  } else if (applicationVersion === 'prerelease') {
    Object.defineProperty(window, 'applicationVersion', {
      value:
        window.spaVersion === 'local' ? getCoreTranslation('localVersion') : getCoreTranslation('prereleaseVersion'),
      writable: false,
      configurable: false,
    });
  } else {
    Object.defineProperty(window, 'applicationVersion', {
      value: applicationVersion,
      writable: false,
      configurable: false,
    });
  }

  const { preferredCalendar } = await getConfig<StyleguideConfigObject>('@openmrs/esm-styleguide');
  for (const entry of Object.entries(preferredCalendar)) {
    registerDefaultCalendar(entry[0], entry[1] as CalendarIdentifier);
  }

  start();
}

function handleInitFailure(e: Error) {
  console.error(e);
  renderFatalErrorPage(e);
}

const initializingPollIntervalMillis = 5000;

/**
 * No app can render without a session, so a session fetch that fails before any session has loaded
 * gets the same error page as a failed startup. Reading the session store retries the fetch, so the
 * page is taken down again if a later fetch succeeds, e.g. once a backend that was starting up is ready.
 *
 * A backend that is still running its initial setup gets a "starting up" page instead, and the session
 * is refetched periodically until setup finishes or the fetch fails some other way. That page is built
 * from the framework, so it waits for `booted`; until then, the boot spinner stays up.
 */
function showErrorPageOnSessionFailure(booted: Promise<void>) {
  let removePage: (() => void) | undefined;
  let shownPage: 'initializing' | 'error' | undefined;
  let pollTimer: ReturnType<typeof setTimeout> | undefined;
  let isBooted = false;
  let isDone = false;

  const show = (page: typeof shownPage, render: () => (() => void) | undefined) => {
    if (shownPage !== page) {
      removePage?.();
      removePage = render();
      shownPage = page;
    }
  };

  const update = (state: SessionStore) => {
    if (isDone) {
      return;
    }

    if (state.loaded) {
      isDone = true;
      unsubscribe();
      clearTimeout(pollTimer);
      removePage?.();
    } else if (state.initializing) {
      if (isBooted) {
        show('initializing', renderServerStartingPage);
      }
      pollTimer ??= setTimeout(() => {
        pollTimer = undefined;
        refetchCurrentUser().catch(() => {});
      }, initializingPollIntervalMillis);
    } else if (state.error) {
      show('error', () => renderFatalErrorPage(state.error));
    }
  };

  const sessionStore = getSessionStore();
  const unsubscribe = sessionStore.subscribe(update);
  booted.then(() => {
    isBooted = true;
    update(sessionStore.getState());
  });
}

/** Renders the fatal error page and returns a function that removes it. */
function renderFatalErrorPage(e?: Error): (() => void) | undefined {
  const template = document.querySelector<HTMLTemplateElement>('#app-error');

  if (template) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const messageContainer = fragment.querySelector('[data-var="message"]');

    if (messageContainer) {
      messageContainer.textContent = e?.message || 'No additional information available.';
    }

    const copyButton = fragment.querySelector<HTMLButtonElement>('[data-copy-btn]');
    if (copyButton && messageContainer) {
      copyButton.onclick = () => copyWithFeedback(messageContainer as HTMLElement, copyButton);
    }

    if (
      localStorage.getItem('openmrs:devtools') &&
      Object.keys(localStorage).some((k) => k.startsWith('import-map-override:'))
    ) {
      const appErrorActionButtons = fragment?.querySelector('#buttons');
      if (appErrorActionButtons) {
        const clearDevOverridesButton = document.createElement('button');
        clearDevOverridesButton.className = 'cds--btn';
        clearDevOverridesButton.innerHTML = 'Clear dev overrides';
        clearDevOverridesButton.dataset.i18n = 'clearDevOverrides';
        clearDevOverridesButton.onclick = clearDevOverrides;
        appErrorActionButtons.appendChild(clearDevOverridesButton);
      }
    }

    translateStaticPage(fragment);

    const nodes = Array.from(fragment.childNodes);
    document.body.appendChild(fragment);
    return () => nodes.forEach((node) => node.remove());
  }
}

const copyFeedbackMillis = 2000;

/** Copies the text of `source` and briefly shows the "Copied!" tooltip attached to `button`. */
function copyWithFeedback(source: HTMLElement, button: HTMLElement) {
  window.copyText(source);

  const tooltip = button.closest('.cds--popover-container');
  tooltip?.classList.add('cds--popover--open');
  setTimeout(() => tooltip?.classList.remove('cds--popover--open'), copyFeedbackMillis);
}

function clearDevOverrides() {
  const keysToRemove = Object.keys(localStorage).filter(
    (key) =>
      key.startsWith('import-map-override:') &&
      !['import-map-override:react', 'import-map-override:react-dom'].includes(key),
  );
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  location.reload();
}

function createConfigLoader(configUrls: Array<string>) {
  const loadingConfigs = Promise.all(
    configUrls.map((configUrl) => {
      const interpolatedUrl = interpolateUrl(configUrl);
      return fetch(interpolatedUrl)
        .then((res) => res.json())
        .then((config) => ({
          name: configUrl,
          value: config,
        }))
        .catch((err) => {
          console.error(`Loading the config from "${configUrl}" failed.`, err);
          return {
            name: configUrl,
            value: {},
          };
        });
    }),
  );
  return () => loadingConfigs.then(loadConfigs);
}

function showNotifications() {
  renderInlineNotifications(document.querySelector('.omrs-inline-notifications-container'));
  return;
}

function showActionableNotifications() {
  renderActionableNotifications(document.querySelector('.omrs-actionable-notifications-container'));
}

function showToasts() {
  renderToasts(document.querySelector('.omrs-toasts-container'));
}

function showWorkspacesAndActionMenu() {
  renderWorkspaceWindowsAndMenu(document.querySelector('#omrs-workspaces-container'));
}

function showSnackbars() {
  renderSnackbars(document.querySelector('.omrs-snackbars-container'));
}

function showModals() {
  setupModals(document.querySelector('.omrs-modals-container'));
}

function showLoadingSpinner() {
  return renderLoadingSpinner(document.body);
}

/**
 * Registers the extensions coming from the app shell itself.
 */
function registerCoreExtensions() {
  const extensions = getCoreExtensions();
  for (const extension of extensions) {
    // FIXME This "core extensions" concept should likely be retired
    tryRegisterExtension(appName, extension as unknown as ExtensionDefinition);
  }
}

export function run(configUrls: Array<string>) {
  setupImportMapOverrides();

  const closeLoading = showLoadingSpinner();
  const provideConfigs = createConfigLoader(configUrls);

  setupStyleguide();
  integrateBreakpoints();
  showToasts();
  showModals();
  showNotifications();
  showActionableNotifications();
  showSnackbars();
  showWorkspacesAndActionMenu();
  subscribeNotificationShown(showNotification);
  subscribeActionableNotificationShown(showActionableNotification);
  subscribeToastShown(showToast);
  subscribeSnackbarShown(showSnackbar);
  setupApiModule();

  let markBooted: () => void;
  showErrorPageOnSessionFailure(new Promise<void>((resolve) => (markBooted = resolve)));
  setupHistory();
  registerCoreExtensions();
  setupCoreConfig();

  const polyfillReady =
    typeof Intl !== 'undefined' && 'DurationFormat' in Intl
      ? Promise.resolve()
      : import(
          /* webpackChunkName: "intl-durationformat-polyfill" */
          '@formatjs/intl-durationformat/lib/polyfill'
        ).then(() => undefined);

  return polyfillReady
    .then(setupApps)
    .then(() => Promise.resolve(finishRegisteringAllApps()))
    .then(provideConfigs)
    .then(runShell)
    .then(() => markBooted())
    .catch(handleInitFailure)
    .then(closeLoading)
    .then(() => {
      // intentionally not returned so that processing the "started" event doesn't block
      fireOpenmrsEvent('started');
    });
}
