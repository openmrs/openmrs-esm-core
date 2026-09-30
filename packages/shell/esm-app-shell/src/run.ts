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
  provide,
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
// imported so we create the MF shares for these
import 'swr/mutation';
import 'swr/subscription';
import './routing-events';
import './events';
import { appName, getCoreExtensions } from './ui';
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

/**
 * No app can render without a session, so a session fetch that fails before any session has loaded
 * gets the same error page as a failed startup. Reading the session store retries the fetch, so the
 * page is taken down again if a later fetch succeeds, e.g. once a backend that was starting up is ready.
 */
function showErrorPageOnSessionFailure() {
  let removeErrorPage: (() => void) | undefined;
  const unsubscribe = getSessionStore().subscribe((state) => {
    if (state.loaded) {
      unsubscribe();
      removeErrorPage?.();
    } else if (state.error && !removeErrorPage) {
      removeErrorPage = renderFatalErrorPage(state.error);
    }
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

    if (
      localStorage.getItem('openmrs:devtools') &&
      Object.keys(localStorage).some((k) => k.startsWith('import-map-override:'))
    ) {
      const appErrorActionButtons = fragment?.querySelector('#buttons');
      if (appErrorActionButtons) {
        const clearDevOverridesButton = document.createElement('button');
        clearDevOverridesButton.className = 'cds--btn';
        clearDevOverridesButton.innerHTML = 'Clear dev overrides';
        clearDevOverridesButton.onclick = clearDevOverrides;
        appErrorActionButtons.appendChild(clearDevOverridesButton);
      }
    }

    const nodes = Array.from(fragment.childNodes);
    document.body.appendChild(fragment);
    return () => nodes.forEach((node) => node.remove());
  }
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
  showErrorPageOnSessionFailure();
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
    .catch(handleInitFailure)
    .then(closeLoading)
    .then(() => {
      // intentionally not returned so that processing the "started" event doesn't block
      fireOpenmrsEvent('started');
    });
}
