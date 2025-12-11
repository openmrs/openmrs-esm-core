import { start, triggerAppChange } from 'single-spa';
import { type CalendarIdentifier } from '@internationalized/date';
import {
  activateOfflineCapability,
  canAccessStorage,
  dispatchConnectivityChanged,
  dispatchPrecacheStaticDependencies,
  type ExtensionDefinition,
  finishRegisteringAllApps,
  fireOpenmrsEvent,
  getConfig,
  getCurrentUser,
  integrateBreakpoints,
  interpolateUrl,
  isOpenmrsAppRoutes,
  isOpenmrsRoutes,
  localStorageRoutesPrefix,
  messageOmrsServiceWorker,
  openmrsFetch,
  provide,
  registerApp,
  registerDefaultCalendar,
  registerOmrsServiceWorker,
  renderActionableNotifications,
  renderInlineNotifications,
  renderLoadingSpinner,
  renderSnackbars,
  renderToasts,
  renderWorkspaceWindowsAndMenu,
  restBaseUrl,
  setupApiModule,
  setupHistory,
  setupModals,
  showActionableNotification,
  showNotification,
  showSnackbar,
  showToast,
  subscribeActionableNotificationShown,
  subscribeConnectivity,
  subscribeNotificationShown,
  subscribePrecacheStaticDependencies,
  subscribeSnackbarShown,
  subscribeToastShown,
  tryRegisterExtension,
  type Config,
  type OpenmrsAppRoutes,
  type OpenmrsRoutes,
  type StyleguideConfigObject,
} from '@openmrs/esm-framework/src/internal';
import { setupI18n } from './locale';
import './routing-events';
import './events';
import { appName, getCoreExtensions } from './ui';
import { setupCoreConfig } from './core-config';

// @internal
// used to track when the window.installedModules global is finalised
// so we can pre-load all modules
const REGISTRATION_PROMISES = Symbol('openmrs_registration_promises');

/**
 * Sets up the frontend modules (apps). Uses the defined export
 * from the root modules of the apps. This is done by reading the
 * list of apps from the routes.registry.json file, which serves
 * as the registry of all apps in the application.
 */
async function setupApps() {
  const scriptTags = document.querySelectorAll<HTMLScriptElement>("script[type='openmrs-routes']");

  const promises: Array<Promise<OpenmrsRoutes>> = [];
  for (let i = 0; i < scriptTags.length; i++) {
    promises.push(
      (async (scriptTag) => {
        let routes: OpenmrsRoutes | undefined = undefined;
        try {
          if (scriptTag.textContent) {
            routes = JSON.parse(scriptTag.textContent) as OpenmrsRoutes;
          } else if (scriptTag.src) {
            routes = (await openmrsFetch<OpenmrsRoutes>(scriptTag.src)).data;
          }
        } catch (e) {
          console.error(`Caught error while loading routes from ${scriptTag.src ?? 'JSON script tag content'}`, e);

          return {};
        }

        return Promise.resolve(routes ?? {});
      })(scriptTags.item(i)),
    );
  }

  if (canAccessStorage()) {
    // load routes overrides from localStorage if any
    const localStorage = window.localStorage;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(localStorageRoutesPrefix)) {
        const localOverride = localStorage.getItem(key);
        if (localOverride) {
          try {
            const maybeOpenmrsRoutes = JSON.parse(localOverride);
            if (isOpenmrsAppRoutes(maybeOpenmrsRoutes)) {
              promises.push(
                Promise.resolve<OpenmrsRoutes>({
                  [key.slice(localStorageRoutesPrefix.length)]: maybeOpenmrsRoutes,
                }),
              );
            } else if (typeof maybeOpenmrsRoutes === 'string' && maybeOpenmrsRoutes.startsWith('http')) {
              promises.push(
                openmrsFetch<OpenmrsAppRoutes>(maybeOpenmrsRoutes)
                  .then((response) => {
                    if (isOpenmrsAppRoutes(response.data)) {
                      return Promise.resolve({
                        [key.slice(localStorageRoutesPrefix.length)]: response.data,
                      });
                    }

                    return Promise.reject(
                      `${maybeOpenmrsRoutes} did not resolve to a valid OpenmrsAppRoutes JSON object`,
                    );
                  })
                  .catch((reason) => {
                    console.warn(
                      `Failed to fetch route overrides for ${key.slice(localStorageRoutesPrefix.length)}`,
                      reason,
                    );

                    // still fail the promise
                    throw reason;
                  }),
              );
            } else {
              console.warn(
                `Route override for ${key.slice(
                  localStorageRoutesPrefix.length,
                )} could not be handled as it was neither a JSON object nor a URL string`,
                localOverride,
              );
            }
          } catch (e) {
            console.error(`Error parsing local route override for ${key}`, e);
          }
        }
      }
    }
  }

  const routes: OpenmrsRoutes = (await Promise.allSettled(promises))
    .filter((p) => p.status === 'fulfilled')
    .map((p) => (p as PromiseFulfilledResult<OpenmrsRoutes>).value)
    .filter(isOpenmrsRoutes)
    .reduce(
      (accumulatedRoutes, routes) => ({
        ...accumulatedRoutes,
        ...routes,
      }),
      {},
    );

  const modules: typeof window.installedModules = [];
  const registrationPromises = Object.entries(routes).map(async ([module, routes]) => {
    modules.push([module, routes]);
    registerApp(module, routes);
  });

  window[REGISTRATION_PROMISES] = Promise.all(registrationPromises);
  window.installedModules = modules;
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
 * Invoked when the connectivity is changed.
 */
function connectivityChanged() {
  if (!window.offlineEnabled) {
    return;
  }

  const online = navigator.onLine;
  // NB We do not wait for this to be done; it is simply scheduled
  triggerAppChange();

  dispatchConnectivityChanged(online);
  showToast({
    critical: true,
    description: `Connection: ${online ? 'online' : 'offline'}`,
    title: 'App',
    kind: online ? 'success' : 'warning',
  });
}

/**
 * Runs the shell by importing the translations and starting single SPA.
 */
async function runShell() {
  return setupI18n()
    .catch((err) => console.error(`Failed to initialize translations`, err))
    .then(async () => {
      const { preferredCalendar } = await getConfig<StyleguideConfigObject>('@openmrs/esm-styleguide');

      for (const entry of Object.entries(preferredCalendar)) {
        registerDefaultCalendar(entry[0], entry[1] as CalendarIdentifier);
      }
    })
    .then(() => start());
}

function handleInitFailure(e: Error) {
  console.error(e);
  renderFatalErrorPage(e);
}

function renderFatalErrorPage(e?: Error) {
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

    document.body.appendChild(fragment);
  }
}

function clearDevOverrides() {
  for (const key of Object.keys(localStorage)) {
    if (
      key.startsWith('import-map-override:') &&
      !['import-map-override:react', 'import-map-override:react-dom'].includes(key)
    ) {
      localStorage.removeItem(key);
    }
  }
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

async function setupOffline() {
  try {
    await registerOmrsServiceWorker(`${window.getOpenmrsSpaBase()}service-worker.js`);
    await activateOfflineCapability();
    setupOfflineStaticDependencyPrecaching();
  } catch (error) {
    console.error('Error while setting up offline mode.', error);
    showNotification({
      kind: 'error',
      title: 'Offline Setup Error',
      description: error.message,
    });
  }
}

function setupOfflineStaticDependencyPrecaching() {
  const precacheDelay = 1000 * 60 * 5;
  let lastPrecache: Date | null = null;

  subscribeOnlineAndLoginChange((online, hasLoggedInUser) => {
    const hasExceededPrecacheDelay = !lastPrecache || new Date().getTime() - lastPrecache.getTime() > precacheDelay;

    if (hasLoggedInUser && online && hasExceededPrecacheDelay) {
      lastPrecache = new Date();
      dispatchPrecacheStaticDependencies();
    }
  });
}

function subscribeOnlineAndLoginChange(cb: (online: boolean, hasLoggedInUser: boolean) => void) {
  let isOnline = false;
  let hasLoggedInUser = false;

  getCurrentUser({ includeAuthStatus: false }).subscribe((user) => {
    hasLoggedInUser = !!user;
    cb(isOnline, hasLoggedInUser);
  });

  subscribeConnectivity(({ online }) => {
    isOnline = online;
    cb(online, hasLoggedInUser);
  });
}

async function precacheGlobalStaticDependencies() {
  await precacheImportMap();

  // By default, cache the session endpoint.
  // This ensures that a lot of user/session related functions also work offline.
  const sessionPathUrl = new URL(`${window.openmrsBase}${restBaseUrl}/session`, window.location.origin).href;

  await messageOmrsServiceWorker({
    type: 'registerDynamicRoute',
    url: sessionPathUrl,
    strategy: 'network-first',
  });

  await openmrsFetch(`${restBaseUrl}/session`).catch((e) =>
    console.warn(
      'Failed to precache the user session data from the app shell. MFs depending on this data may run into problems while offline.',
      e,
    ),
  );
}

async function precacheImportMap() {
  const importMap = await window.importMapOverrides.getCurrentPageMap();
  await messageOmrsServiceWorker({
    type: 'onImportMapChanged',
    importMap,
  });
}

function registerOfflineHandlers() {
  window.addEventListener('offline', connectivityChanged);
  window.addEventListener('online', connectivityChanged);
}

function setupOfflineCssClasses() {
  subscribeConnectivity(({ online }) => {
    const body = document.querySelector('body')!;
    if (online) {
      body.classList.remove('omrs-offline');
    } else {
      body.classList.add('omrs-offline');
    }
  });
}

export function run(configUrls: Array<string>) {
  const offlineEnabled = window.offlineEnabled;
  const closeLoading = showLoadingSpinner();
  const provideConfigs = createConfigLoader(configUrls);

  return import('@openmrs/esm-styleguide/src/index').then(() => {
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
    subscribePrecacheStaticDependencies(precacheGlobalStaticDependencies);
    setupApiModule();
    setupHistory();
    registerCoreExtensions();
    setupCoreConfig();

    return setupApps()
      .then(finishRegisteringAllApps)
      .then(offlineEnabled ? setupOfflineCssClasses : undefined)
      .then(offlineEnabled ? registerOfflineHandlers : undefined)
      .then(provideConfigs)
      .then(runShell)
      .catch(handleInitFailure)
      .then(closeLoading)
      .then(offlineEnabled ? setupOffline : undefined)
      .then(() => {
        // intentionally not returned so that processing the "started" event doesn't block
        fireOpenmrsEvent('started');
      });
  });
}
