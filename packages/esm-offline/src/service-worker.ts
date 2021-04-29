import { Workbox } from "workbox-window";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

const omrsServiceWorkerSubject = new BehaviorSubject<Workbox | null>(null);
const omrsServiceWorkerPromise = omrsServiceWorkerSubject
  .asObservable()
  .pipe(filter(((x) => !!x) as (x) => x is Workbox))
  .toPromise();

/**
 * If not yet registered, registers the application's global Service Worker.
 * Throws if registration is not possible.
 * @param scriptURL The service worker script associated with this instance.
 * @param [registerOptions] The service worker options associated with this instance.
 * @returns The registered Service Worker.
 */
export function registerOmrsServiceWorker(
  scriptUrl: string,
  registerOptions?: object
) {
  if (omrsServiceWorkerSubject.value) {
    console.warn(
      `The application's Service Worker has already been registered. The new service worker at ${scriptUrl} will not be registered.`
    );
    return omrsServiceWorkerSubject.value;
  }

  if (!("serviceWorker" in navigator)) {
    throw new Error(
      "Registering the Service Worker is not possible due to missing browser capabilities."
    );
  }

  const newServiceWorker = new Workbox(scriptUrl, registerOptions);
  newServiceWorker.register();
  omrsServiceWorkerSubject.next(newServiceWorker);
  omrsServiceWorkerSubject.complete();
  return newServiceWorker;
}

/**
 * Returns a `Workbox` instance which allows interacting with the application's global Service Worker.
 *
 * **Warning:** The promise may never resolve if the Service Worker is never registered (which
 * can, for example, happen when the browser is missing the required capabilities).
 * @returns A promise which will resolve once the application's Service Worker has been initialized.
 */
export function getOmrsServiceWorker(): Promise<Workbox> {
  return omrsServiceWorkerPromise;
}
