/** @module @category API */
import { reportError } from '@openmrs/esm-error-handling';
import { createGlobalStore } from '@openmrs/esm-state';
import { isUndefined } from 'lodash-es';
import { OpenmrsFetchError, openmrsFetch, restBaseUrl, sessionEndpoint } from './openmrs-fetch';
import type { LoggedInUser, SessionLocation, Privilege, Role, Session, FetchResponse } from './types';

export type SessionStore = LoadedSessionStore | UnloadedSessionStore;

export type LoadedSessionStore = {
  loaded: true;
  session: Session;
};

export type UnloadedSessionStore = {
  loaded: false;
  session: null;
  /** Set when fetching the session failed before any session had loaded. */
  error?: Error;
  /**
   * Set alongside `error`. `true` when the backend appears to be still starting up rather than broken:
   * it redirected the session request to its initial setup page, or its gateway answered with a 502
   * shortly after the page loaded.
   */
  initializing?: boolean;
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

/**
 * How long after the first session fetch a 502 is taken to mean that the backend is still starting up. A
 * gateway answers with a 502 until the backend has deployed, which can take a few minutes after a restart.
 */
const startupGracePeriodMillis = 3 * 60 * 1000;

let firstFetchTimeMillis: number | undefined;
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
 * session it resolves with is therefore never more than a minute old, unless that fetch fails,
 * in which case it resolves with the last session that loaded.
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

  const refresh = refreshSessionIfStale();
  if (!refresh) {
    return Promise.resolve(select((sessionStore.getState() as LoadedSessionStore).session));
  }

  return new Promise<Session | LoggedInUser>((resolve) => {
    const resolveIfLoaded = () => {
      const state = sessionStore.getState();
      if (state.loaded) {
        unsubscribe();
        resolve(select(state.session));
      }
    };
    const unsubscribe = sessionStore.subscribe(resolveIfLoaded);
    // A failed refresh keeps an already-loaded session without updating the store, so the
    // subscription alone would never fire.
    refresh.then(resolveIfLoaded, resolveIfLoaded);
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
 * If the server rejects the request as unauthenticated (401 or 403), the store records a
 * logged-out session. If the request fails for any other reason, a session that has already
 * loaded is kept; otherwise the store records the error.
 *
 * @returns A Promise resolving to the updated session store state. It rejects with the
 *   store state if the request fails for a reason other than authentication.
 *
 * @example
 * ```js
 * import { refetchCurrentUser } from '@openmrs/esm-api'
 * refetchCurrentUser()
 * ```
 */
export function refetchCurrentUser(username?: string, password?: string) {
  lastFetchTimeMillis = Date.now();
  firstFetchTimeMillis ??= lastFetchTimeMillis;
  let headers = {};
  if (username && password) {
    headers['Authorization'] = `Basic ${window.btoa(`${username}:${password}`)}`;
  }

  const refresh = handleSessionResponse(
    openmrsFetch(sessionEndpoint, {
      headers,
      rejectAuthFailure: true,
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
  sessionStore.setState(
    {
      loaded: true,
      session: { authenticated: false, sessionId: '' },
    },
    true,
  );
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
export async function setSessionLocation(locationUuid: string, abortController?: AbortController): Promise<any> {
  return handleSessionResponse(
    openmrsFetch(sessionEndpoint, {
      method: 'POST',
      body: { sessionLocation: locationUuid },
      headers: {
        'Content-Type': 'application/json',
      },
      rejectAuthFailure: true,
      signal: abortController?.signal,
    }),
  );
}

/**
 * Sets the locale for the current session only, leaving the user's default locale unchanged.
 * Use {@link setUserProperties} with a `defaultLocale` property to change the default instead.
 *
 * @param locale The locale in Java's `Locale#toString()` form, e.g. `en_GB`.
 * @param abortController Optional AbortController to allow cancellation of the request.
 * @returns A Promise that resolves with the updated SessionStore after refetching the current user.
 *   It rejects with an {@link OpenmrsFetchError} if the server does not accept the locale.
 *
 * @example
 * ```ts
 * import { setSessionLocale } from '@openmrs/esm-api';
 * await setSessionLocale('fr');
 * ```
 *
 * @internal
 */
export async function setSessionLocale(locale: string, abortController?: AbortController): Promise<SessionStore> {
  await openmrsFetch(sessionEndpoint, {
    method: 'POST',
    body: { locale },
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController?.signal,
  });

  return refetchCurrentUser();
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

/**
 * Submits a TOTP code to complete a two-factor login challenge. When the code is accepted, the
 * session store is refreshed with the now-authenticated session.
 *
 * @param code The code from the user's authenticator app.
 * @param rememberDevice Whether the server should skip the challenge on this device in future.
 * @returns A Promise resolving to the session. Its `authenticated` property is `false` if the
 *   code was not accepted. It rejects with an {@link OpenmrsFetchError} if the server rejects the
 *   request, in which case `responseBody` may explain why.
 *
 * @example
 * ```ts
 * import { verifyTotpCode } from '@openmrs/esm-api';
 * const session = await verifyTotpCode('123456', true);
 * ```
 *
 * @internal
 */
export async function verifyTotpCode(code: string, rememberDevice = false): Promise<Session> {
  const response = await openmrsFetch<Session>(
    rememberDevice ? `${sessionEndpoint}?rememberMe=true` : sessionEndpoint,
    {
      headers: {
        'X-Totp-Code': code,
      },
    },
  );

  if (response.data?.authenticated) {
    // `refetchCurrentUser` only resolves once the store holds a session.
    const store = (await refetchCurrentUser()) as LoadedSessionStore;
    return store.session;
  }

  return response.data;
}

/**
 * Ends the current session on the server and records a logged-out session in the session store.
 * A server that has already ended the session (401 or 403) counts as a successful logout.
 *
 * Other data cached for the logged-in user, such as SWR caches, is the caller's to clear.
 *
 * @returns A Promise that resolves once the session store holds a logged-out session.
 *
 * @example
 * ```ts
 * import { logout } from '@openmrs/esm-api';
 * await logout();
 * ```
 *
 * @internal
 */
export async function logout(): Promise<void> {
  try {
    await openmrsFetch(sessionEndpoint, { method: 'DELETE', rejectAuthFailure: true });
  } catch (err) {
    if (!isAuthFailure(err)) {
      throw err;
    }
  }

  clearCurrentUser();
  // The session just cleared is already correct, so a failed refresh loses nothing.
  await refetchCurrentUser().catch(() => {});
}

function handleSessionResponse(result: Promise<FetchResponse<Session>>) {
  return new Promise<SessionStore>((resolve, reject) => {
    result
      .then((res) => {
        if (typeof res?.data === 'object') {
          const nextState: SessionStore = { loaded: true, session: res.data };
          sessionStore.setState(nextState, true);
          resolve(nextState);
        } else if (isInitialSetupRedirect(res)) {
          reject(recordSessionFailure(Error('The server is still starting up'), true));
        } else {
          reject(recordSessionFailure(Error('The session endpoint did not respond with a session')));
        }
      })
      .catch((err) => {
        // An auth failure is the session endpoint's answer for "not logged in", not a failed lookup.
        if (isAuthFailure(err)) {
          if (isUnauthenticatedSession(err.responseBody)) {
            sessionStore.setState({ loaded: true, session: err.responseBody }, true);
          } else {
            clearCurrentUser();
          }
          resolve(sessionStore.getState());
          return;
        }

        if (isGatewayErrorDuringStartup(err)) {
          reject(recordSessionFailure(err, true));
          return;
        }

        reportError(`Failed to fetch new session information: ${err}`);
        reject(recordSessionFailure(err));
      });
  });
}

function isAuthFailure(err: unknown): err is OpenmrsFetchError {
  return err instanceof OpenmrsFetchError && (err.response.status === 401 || err.response.status === 403);
}

/**
 * Until the backend has finished its initial setup, it answers every request with a redirect to its
 * setup page, which `fetch()` follows, so the session request resolves with that page's HTML.
 */
function isInitialSetupRedirect(res: FetchResponse | undefined) {
  if (!res?.redirected || !res.url) {
    return false;
  }

  try {
    return new URL(res.url, window.location.href).pathname.replace(/\/+$/, '').endsWith('/initialsetup');
  } catch {
    return false;
  }
}

function isGatewayErrorDuringStartup(err: unknown) {
  return (
    err instanceof OpenmrsFetchError &&
    err.response.status === 502 &&
    !sessionStore.getState().loaded &&
    firstFetchTimeMillis !== undefined &&
    Date.now() - firstFetchTimeMillis < startupGracePeriodMillis
  );
}

function isUnauthenticatedSession(body: unknown): body is Session {
  return typeof body === 'object' && body !== null && (body as Session).authenticated === false;
}

/**
 * A session that has already loaded is kept when a later fetch fails, since it is still the best answer
 * available. With nothing to fall back on, the error is recorded so the app shell can show an error page.
 */
function recordSessionFailure(err: unknown, initializing = false): SessionStore {
  if (!sessionStore.getState().loaded) {
    sessionStore.setState(
      {
        loaded: false,
        session: null,
        error: err instanceof Error ? err : Error(String(err)),
        initializing,
      },
      true,
    );
  }

  return sessionStore.getState();
}
