import { start, triggerAppChange } from "single-spa";
import {
  setupApiModule,
  renderLoadingSpinner,
  createAppState,
  Config,
  provide,
  showNotification,
  showActionableNotification,
  showToast,
  renderInlineNotifications,
  renderActionableNotifications,
  renderToasts,
  integrateBreakpoints,
  dispatchConnectivityChanged,
  subscribeNotificationShown,
  subscribeActionableNotificationShown,
  subscribeToastShown,
  registerOmrsServiceWorker,
  messageOmrsServiceWorker,
  subscribeConnectivity,
  getCurrentUser,
  renderModals,
  dispatchPrecacheStaticDependencies,
  activateOfflineCapability,
  subscribePrecacheStaticDependencies,
  openmrsFetch,
  interpolateUrl,
  OpenmrsRoutes,
  getCurrentImportMap,
  importDynamic,
} from "@openmrs/esm-framework/src/internal";
import {
  finishRegisteringAllApps,
  registerApp,
  tryRegisterExtension,
} from "./apps";
import { setupI18n } from "./locale";
import { appName, getCoreExtensions } from "./ui";

// @internal
// used to track when the window.installedModules global is finalised
// so we can pre-load all modules
const REGISTRATION_PROMISES = Symbol("openmrs_registration_promises");

/**
 * Sets up the frontend modules (apps). Uses the defined export
 * from the root modules of the apps. This is done by reading the
 * list of apps from the routes.registry.json file, which serves
 * as the registry of all apps in the application.
 */
async function setupApps() {
  const scriptTags = document.querySelectorAll<HTMLScriptElement>(
    "script[type='openmrs-routes']"
  );

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
          console.error(
            `Caught error while loading routes from ${
              scriptTag.src ?? "JSON script tag content"
            }`,
            e
          );

          return {};
        }

        return Promise.resolve(routes ?? {});
      })(scriptTags.item(i))
    );
  }

  const routes = (await Promise.all(promises)).reduce(
    (accumulatedRoutes, routes) => ({ ...accumulatedRoutes, ...routes }),
    {}
  );

  const modules: typeof window.installedModules = [];
  const registrationPromises = Object.entries(routes).map(
    async ([module, routes]) => {
      modules.push([module, routes]);
      registerApp(module, routes);
    }
  );

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
  const online = navigator.onLine;
  // NB We do not wait for this to be done; it is simply scheduled
  triggerAppChange();

  dispatchConnectivityChanged(online);
  showToast({
    critical: true,
    description: `Connection: ${online ? "online" : "offline"}`,
    title: "App",
    kind: online ? "success" : "warning",
  });
}

/**
 * Runs the shell by importing the translations and starting single SPA.
 */
function runShell() {
  window.addEventListener("offline", connectivityChanged);
  window.addEventListener("online", connectivityChanged);
  return setupI18n()
    .catch((err) => console.error(`Failed to initialize translations`, err))
    .then(() => start());
}

async function preloadScripts() {
  const [, importMap] = await Promise.all([
    window[REGISTRATION_PROMISES],
    getCurrentImportMap(),
  ]);

  window.installedModules.map(async ([module]) => {
    importDynamic(module, undefined, { importMap });
  });
}

function handleInitFailure(e: Error) {
  console.error(e);
  renderFatalErrorPage(e);
}

function renderFatalErrorPage(e?: Error) {
  const template = document.querySelector<HTMLTemplateElement>("#app-error");

  if (template) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const messageContainer = fragment.querySelector('[data-var="message"]');

    if (messageContainer) {
      messageContainer.textContent =
        e?.message || "No additional information available.";
    }

    if (
      localStorage.getItem("openmrs:devtools") &&
      Object.keys(localStorage).some((k) =>
        k.startsWith("import-map-override:")
      )
    ) {
      const appErrorActionButtons = fragment?.querySelector("#buttons");
      if (appErrorActionButtons) {
        const clearDevOverridesButton = document.createElement("button");
        clearDevOverridesButton.className = "cds--btn";
        clearDevOverridesButton.innerHTML = "Clear dev overrides";
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
      key.startsWith("import-map-override:") &&
      !["import-map-override:react", "import-map-override:react-dom"].includes(
        key
      )
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
    })
  );
  return () => loadingConfigs.then(loadConfigs);
}

function showNotifications() {
  renderInlineNotifications(
    document.querySelector(".omrs-inline-notifications-container")
  );
  return;
}

function showActionableNotifications() {
  renderActionableNotifications(
    document.querySelector(".omrs-actionable-notifications-container")
  );
}

function showToasts() {
  renderToasts(document.querySelector(".omrs-toasts-container"));
}

function showModals() {
  renderModals(document.querySelector(".omrs-modals-container"));
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
    tryRegisterExtension(appName, extension);
  }
}

async function setupOffline() {
  try {
    await registerOmrsServiceWorker(
      `${window.getOpenmrsSpaBase()}service-worker.js`
    );
    await activateOfflineCapability();
    setupOfflineStaticDependencyPrecaching();
  } catch (error) {
    console.error("Error while setting up offline mode.", error);
    showNotification({
      kind: "error",
      title: "Offline Setup Error",
      description: error.message,
    });
  }
}

function setupOfflineStaticDependencyPrecaching() {
  const precacheDelay = 1000 * 60 * 5;
  let lastPrecache: Date | null = null;

  subscribeOnlineAndLoginChange((online, hasLoggedInUser) => {
    const hasExceededPrecacheDelay =
      !lastPrecache ||
      new Date().getTime() - lastPrecache.getTime() > precacheDelay;

    if (hasLoggedInUser && online && hasExceededPrecacheDelay) {
      lastPrecache = new Date();
      dispatchPrecacheStaticDependencies();
    }
  });
}

function subscribeOnlineAndLoginChange(
  cb: (online: boolean, hasLoggedInUser: boolean) => void
) {
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
  const sessionPathUrl = new URL(
    `${window.openmrsBase}/ws/rest/v1/session`,
    window.location.origin
  ).href;

  await messageOmrsServiceWorker({
    type: "registerDynamicRoute",
    url: sessionPathUrl,
    strategy: "network-first",
  });

  await openmrsFetch("/ws/rest/v1/session").catch((e) =>
    console.warn(
      "Failed to precache the user session data from the app shell. MFs depending on this data may run into problems while offline.",
      e
    )
  );
}

async function precacheImportMap() {
  const importMap = await window.importMapOverrides.getCurrentPageMap();
  await messageOmrsServiceWorker({
    type: "onImportMapChanged",
    importMap,
  });
}

function setupOfflineCssClasses() {
  subscribeConnectivity(({ online }) => {
    const body = document.querySelector("body")!;
    if (online) {
      body.classList.remove("omrs-offline");
    } else {
      body.classList.add("omrs-offline");
    }
  });
}

export function run(configUrls: Array<string>, offline: boolean) {
  const closeLoading = showLoadingSpinner();
  const provideConfigs = createConfigLoader(configUrls);

  integrateBreakpoints();
  showToasts();
  showModals();
  showNotifications();
  showActionableNotifications();
  createAppState({});
  subscribeNotificationShown(showNotification);
  subscribeActionableNotificationShown(showActionableNotification);
  subscribeToastShown(showToast);
  subscribePrecacheStaticDependencies(precacheGlobalStaticDependencies);
  setupApiModule();
  registerCoreExtensions();

  return setupApps()
    .then(finishRegisteringAllApps)
    .then(setupOfflineCssClasses)
    .then(provideConfigs)
    .then(runShell)
    .catch(handleInitFailure)
    .then(closeLoading)
    .then(offline ? setupOffline : undefined)
    .then(preloadScripts);
}
