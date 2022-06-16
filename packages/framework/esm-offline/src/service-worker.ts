import { Workbox } from "workbox-window";

let workboxRegistration: Promise<Workbox> | undefined = undefined;

/**
 * If not yet registered, registers the application's global Service Worker.
 * Throws if registration is not possible.
 * @param scriptURL The service worker script associated with this instance.
 * @param [registerOptions] The service worker options associated with this instance.
 * @returns A promise which resolves to the registered {@link Workbox} instance which manages the SW.
 */
export function registerOmrsServiceWorker(
  scriptUrl: string,
  registerOptions?: object
) {
  if (workboxRegistration !== undefined) {
    console.warn(
      `The application's Service Worker has already been registered. The new service worker at ${scriptUrl} will not be registered.`
    );
    return workboxRegistration;
  }

  if (!("serviceWorker" in navigator)) {
    throw new Error(
      "Registering the Service Worker is not possible due to missing browser capabilities."
    );
  }

  const wb = new Workbox(scriptUrl, registerOptions);
  workboxRegistration = wb.register().then(() => wb.controlling.then(() => wb));
  return workboxRegistration;
}

/**
 * If a service worker has been registered, returns a promise that resolves to a {@link Workbox}
 * instance which is used by the application to manage that service worker.
 *
 * If no service worker has been registered (e.g. when the application is built without offline specific features),
 * returns a promise which immediately resolves to `undefined`.
 * @returns A promise which either resolves to `undefined` or to the app's {@link Workbox} instance.
 */
export function getOmrsServiceWorker(): Promise<Workbox | undefined> {
  return workboxRegistration ?? Promise.resolve(undefined);
}
