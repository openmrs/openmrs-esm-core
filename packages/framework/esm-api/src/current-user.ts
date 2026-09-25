/** @module @category API */
import { reportError } from '@openmrs/esm-error-handling';
import { createGlobalStore } from '@openmrs/esm-state';
import { isUndefined } from 'lodash-es';
import { openmrsFetch, restBaseUrl, sessionEndpoint } from './openmrs-fetch';
import type { LoggedInUser, SessionLocation, Privilege, Role, Session, FetchResponse } from './types';

export type SessionStore = LoadedSessionStore | UnloadedSessionStore;

export type LoadedSessionStore = {
  loaded: true;
  session: Session;
};

export type UnloadedSessionStore = {
  loaded: false;
  session: null;
};

/** @internal */
export const sessionStore = createGlobalStore<SessionStore>('session', {
  loaded: false,
  session: null,
});

/**
 * The upper bound on how old the session handed to a reader may be. It is measured from the moment a
 * fetch is *started*, not from the moment its response lands, so the session a reader sees is always
 * strictly newer than this.
 */
const sessionMaxAgeMillis = 60 * 1000;

let lastFetchTimeMillis = 0;
let inFlightRefresh: Promise<SessionStore> | null = null;

/**
 * Fetches the session if the store is unloaded or its session is older than `sessionMaxAgeMillis`.
 * Returns `null` only when the store already holds a session fresh enough to be read as-is, so a
 * caller that gets a promise back must wait for it rather than read the store.
 *
 * A fetch already in flight is joined rather than duplicated. This is what keeps `sessionMaxAgeMillis`
 * an upper bound: while a fetch is running, the store still holds the previous session, and returning
 * that would hand back data older than the bound allows.
 *
 * The returned promise rejects if the fetch fails, but the rejection is already handled and reported,
 * so a caller that only needs the fetch started can ignore it.
 */
function refreshSessionIfStale(): Promise<SessionStore> | null {
  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  if (sessionStore.getState().loaded && lastFetchTimeMillis >= Date.now() - sessionMaxAgeMillis) {
    return null;
  }

  return refetchCurrentUser();
}

/**
 * The getCurrentUser function returns a Promise that resolves once with the
 * current user's session. If the session hasn't been loaded, was loaded more than
 * a minute ago, or is in the middle of being refetched, the Promise waits for the
 * fetch in question rather than resolving with data that may be out of date. The
 * session it resolves with is therefore never more than a minute old.
 *
 * The function accepts an optional `opts` object with an `includeAuthStatus` boolean
 * property that defaults to `true`. When `true`, the entire {@link Session} object
 * from the API is provided. When `false`, only the {@link LoggedInUser} property of
 * the response is provided.
 *
 * To react to subsequent session changes (login, logout, user-property updates),
 * use {@link getSessionStore} (`getState()` / `subscribe()`) or the `useSession`
 * React hook rather than calling this repeatedly.
 *
 * @returns A Promise resolving to a {@link LoggedInUser} object (if `includeAuthStatus`
 *   is `false`) or a {@link Session} object (if `includeAuthStatus` is `true` or not
 *   provided).
 *
 * @example
 *
 * ```js
 * import { getCurrentUser } from '@openmrs/esm-api'
 * const session = await getCurrentUser({ includeAuthStatus: true })
 * console.log(session.authenticated)
 * ```
 */
function getCurrentUser(): Promise<Session>;
/**
 * @param opts Options for controlling the response format.
 * @param opts.includeAuthStatus When `true`, resolves with the full {@link Session} object
 *   including authentication status.
 * @returns A Promise resolving to a {@link Session} object.
 */
function getCurrentUser(opts: { includeAuthStatus: true }): Promise<Session>;
/**
 * @param opts Options for controlling the response format.
 * @param opts.includeAuthStatus When `false`, resolves with only the {@link LoggedInUser} object
 *   without the surrounding session information.
 * @returns A Promise resolving to a {@link LoggedInUser} object.
 */
function getCurrentUser(opts: { includeAuthStatus: false }): Promise<LoggedInUser>;
function getCurrentUser(opts?: { includeAuthStatus?: boolean }): Promise<Session | LoggedInUser> {
  const includeAuthStatus = opts?.includeAuthStatus ?? true;
  const select = (session: Session) => (includeAuthStatus ? session : (session.user as LoggedInUser));

  if (!refreshSessionIfStale()) {
    return Promise.resolve(select((sessionStore.getState() as LoadedSessionStore).session));
  }

  return new Promise<Session | LoggedInUser>((resolve) => {
    const unsubscribe = sessionStore.subscribe((state) => {
      if (state.loaded) {
        unsubscribe();
        resolve(select(state.session));
      }
    });
  });
}

export { getCurrentUser };

/**
 * Returns the global session store containing the current user's session information.
 * If the session data is stale (older than 1 minute) or not yet loaded, this function
 * will trigger a refetch of the current user's session.
 *
 * @returns The global session store that can be subscribed to for session updates.
 *
 * @example
 * ```ts
 * import { getSessionStore } from '@openmrs/esm-api';
 * const store = getSessionStore();
 * const unsubscribe = store.subscribe((state) => {
 *   if (state.loaded) {
 *     console.log('Session:', state.session);
 *   }
 * });
 * ```
 */
export function getSessionStore() {
  refreshSessionIfStale();
  return sessionStore;
}

// NB locale is string only if this returns true
function isValidLocale(locale: unknown): locale is string {
  if (locale === undefined || typeof locale !== 'string') {
    return false;
  }

  try {
    new Intl.Locale(locale);
  } catch (e) {
    return false;
  }

  return true;
}

/**
 * Sets the document's language attribute based on the user's locale preference
 * from the session data. This affects the HTML `lang` attribute which is used
 * for accessibility and internationalization.
 *
 * The locale is determined from either the session's locale or the user's
 * default locale property. Underscores in the locale are converted to hyphens
 * to match BCP 47 language tag format.
 *
 * @param data The session object containing locale information.
 */
export function setUserLanguage(data: Session) {
  let locale = data.locale ?? data.user?.userProperties?.defaultLocale;

  // Only underscores are converted here, deliberately, rather than reusing `toLanguageTag`. i18next
  // reads this value back off `document.lang` and uses it as the translation bundle key, and those
  // bundles are named with the POSIX form (`uz@Latn.json`), so converting `@` would send the loader
  // after a bundle that does not exist.
  if (locale && locale.includes('_')) {
    locale = locale.replaceAll('_', '-');
  }

  if (isValidLocale(locale) && locale !== document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', locale);
  }
}

sessionStore.subscribe((state: SessionStore) => {
  if (state.loaded && state.session) {
    setUserLanguage(state.session);
  }
});

function userHasPrivilege(requiredPrivilege: string | string[] | undefined, user: { privileges: Array<Privilege> }) {
  if (typeof requiredPrivilege === 'string') {
    return !isUndefined(user.privileges.find((p) => requiredPrivilege === p.display));
  } else if (Array.isArray(requiredPrivilege)) {
    return requiredPrivilege.every((rp) => !isUndefined(user.privileges.find((p) => rp === p.display)));
  } else if (!isUndefined(requiredPrivilege)) {
    console.error(`Could not understand privileges "${requiredPrivilege}"`);
  }

  return true;
}

function isSuperUser(user: { roles: Array<Role> }) {
  return !isUndefined(user.roles.find((role) => role.display === 'System Developer'));
}

/**
 * The `refetchCurrentUser` function causes a network request to redownload
 * the user. All subscribers to the session store will be notified of the
 * new user once the new version of the user object is downloaded.
 *
 * @returns A Promise resolving to the updated session store state.
 *
 * @example
 * ```js
 * import { refetchCurrentUser } from '@openmrs/esm-api'
 * refetchCurrentUser()
 * ```
 */
export function refetchCurrentUser(username?: string, password?: string) {
  lastFetchTimeMillis = Date.now();
  let headers = {};
  if (username && password) {
    headers['Authorization'] = `Basic ${window.btoa(`${username}:${password}`)}`;
  }

  const refresh = handleSessionResponse(
    openmrsFetch(sessionEndpoint, {
      headers,
    }),
  );

  // Publish the request so that readers can wait on it instead of reading the session it is about to
  // replace. Each call still issues its own request; this only tracks the most recent one.
  const clear = () => {
    if (inFlightRefresh === refresh) {
      inFlightRefresh = null;
    }
  };
  refresh.then(clear, clear);
  inFlightRefresh = refresh;

  return refresh;
}

/**
 * Clears the current user session from the session store, setting the session
 * to an unauthenticated state. This is typically called during logout to reset
 * the application's authentication state.
 *
 * @example
 * ```ts
 * import { clearCurrentUser } from '@openmrs/esm-api';
 * // During logout
 * clearCurrentUser();
 * ```
 */
export function clearCurrentUser() {
  sessionStore.setState({
    loaded: true,
    session: { authenticated: false, sessionId: '' },
  });
}

/**
 * Checks whether the given user has access based on the required privilege(s).
 * A user has access if they have the required privilege(s) or if they are a
 * "System Developer" (super user). If no privilege is required, access is granted.
 *
 * @param requiredPrivilege A single privilege string or an array of privilege strings
 *   that the user must have. If an array is provided, the user must have ALL privileges.
 * @param user The user object containing their privileges and roles.
 * @returns `true` if the user has access, `false` otherwise. Returns `true` if no
 *   privilege is required, and `false` if the user is undefined but a privilege is required.
 *
 * @example
 * ```ts
 * import { userHasAccess } from '@openmrs/esm-api';
 * const hasAccess = userHasAccess('View Patients', currentUser);
 * const hasMultipleAccess = userHasAccess(['View Patients', 'Edit Patients'], currentUser);
 * ```
 */
export function userHasAccess(
  requiredPrivilege: string | Array<string>,
  user: { privileges: Array<Privilege>; roles: Array<Role> },
) {
  if (user === undefined) {
    // if the user hasn't been loaded, then return false iff there is a required privilege
    return !Boolean(requiredPrivilege);
  }

  if (!Boolean(requiredPrivilege)) {
    // if user exists but no requiredPrivilege is defined
    return true;
  }

  return userHasPrivilege(requiredPrivilege, user) || isSuperUser(user);
}

/**
 * Returns a Promise that resolves with the currently logged-in user object.
 * If the user is already loaded in the session store, the Promise resolves immediately.
 * Otherwise, it subscribes to the session store and resolves when a logged-in user
 * becomes available.
 *
 * @returns A Promise that resolves with the LoggedInUser object once available.
 *
 * @example
 * ```ts
 * import { getLoggedInUser } from '@openmrs/esm-api';
 * const user = await getLoggedInUser();
 * console.log('Logged in as:', user.display);
 * ```
 */
export function getLoggedInUser() {
  let user: LoggedInUser;
  let unsubscribe: () => void;
  return new Promise<LoggedInUser>((res) => {
    const handler = (state: SessionStore) => {
      if (state.loaded && state.session.user) {
        user = state.session.user;
        res(state.session.user);

        if (unsubscribe) {
          unsubscribe();
        }
      }
    };
    handler(sessionStore.getState());
    if (!user) {
      unsubscribe = sessionStore.subscribe(handler);
    }
  });
}

/**
 * Returns a Promise that resolves with the current session location, if one is set.
 * The session location represents the physical location where the user is currently
 * working (e.g., a clinic or ward).
 *
 * @returns A Promise that resolves with the SessionLocation object, or `undefined`
 *   if no session location is set.
 *
 * @example
 * ```ts
 * import { getSessionLocation } from '@openmrs/esm-api';
 * const location = await getSessionLocation();
 * if (location) {
 *   console.log('Current location:', location.display);
 * }
 * ```
 */
export async function getSessionLocation(): Promise<SessionLocation | undefined> {
  const session = await getCurrentUser();
  return session.sessionLocation;
}

/**
 * Sets the session location for the current user. The session location represents
 * the physical location where the user is working (e.g., a clinic or ward).
 * This triggers a server request to update the session and refreshes the local
 * session store.
 *
 * @param locationUuid The UUID of the location to set as the session location.
 * @param abortController An AbortController to allow cancellation of the request.
 * @returns A Promise that resolves with the updated SessionStore.
 *
 * @example
 * ```ts
 * import { setSessionLocation } from '@openmrs/esm-api';
 * const abortController = new AbortController();
 * await setSessionLocation('location-uuid-here', abortController);
 * ```
 */
export async function setSessionLocation(locationUuid: string, abortController: AbortController): Promise<any> {
  return handleSessionResponse(
    openmrsFetch(sessionEndpoint, {
      method: 'POST',
      body: { sessionLocation: locationUuid },
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortController.signal,
    }),
  );
}

/**
 * Updates the user properties for a specific user. User properties are key-value
 * pairs that store user-specific settings and preferences. After updating the
 * properties on the server, the current user session is refetched to reflect
 * the changes.
 *
 * @param userUuid The UUID of the user whose properties should be updated.
 * @param userProperties An object containing the properties to set or update.
 * @param abortController Optional AbortController to allow cancellation of the request.
 *   If not provided, a new AbortController is created.
 * @returns A Promise that resolves with the updated SessionStore after refetching
 *   the current user.
 *
 * @example
 * ```ts
 * import { getLoggedInUser, setUserProperties } from '@openmrs/esm-api';
 * const user = await getLoggedInUser();
 * await setUserProperties(user.uuid, {
 *   defaultLocale: 'en_GB',
 *   customSetting: 'value'
 * });
 * ```
 */
export async function setUserProperties(
  userUuid: string,
  userProperties: {
    [x: string]: string;
  },
  abortController?: AbortController,
): Promise<SessionStore> {
  if (!abortController) {
    abortController = new AbortController();
  }
  await openmrsFetch(`${restBaseUrl}/user/${userUuid}`, {
    method: 'POST',
    body: { userProperties },
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
  });

  return refetchCurrentUser();
}

function handleSessionResponse(result: Promise<FetchResponse<Session>>) {
  return new Promise<SessionStore>((resolve, reject) => {
    result
      .then((res) => {
        let nextState: SessionStore;
        if (typeof res?.data === 'object') {
          nextState = { loaded: true, session: res.data };
          sessionStore.setState(nextState);
          resolve(nextState);
        } else {
          nextState = { loaded: false, session: null };
          sessionStore.setState(nextState);
          reject(nextState);
        }
      })
      .catch((err) => {
        reportError(`Failed to fetch new session information: ${err}`);
        const nextState: SessionStore = { loaded: false, session: null };
        sessionStore.setState(nextState);
        reject(nextState);
      });
  });
}
