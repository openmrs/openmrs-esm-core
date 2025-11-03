/** @module @category API */
import { reportError } from '@openmrs/esm-error-handling';
import { createGlobalStore } from '@openmrs/esm-state';
import { isUndefined } from 'lodash-es';
import { Observable } from 'rxjs';
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
let lastFetchTimeMillis = 0;

/**
 * The getCurrentUser function returns an observable that produces
 * **zero or more values, over time**. It will produce zero values
 * by default if the user is not logged in. And it will provide a
 * first value when the logged in user is fetched from the server.
 * Subsequent values will be produced whenever the user object is
 * updated.
 *
 * @param opts An object with `includeAuthStatus` boolean
 *   property that defaults to `false`. When `includeAuthStatus` is set
 *   to `true`, the entire response object from the API will be provided.
 *   When `includeAuthStatus` is set to `false`, only the `user` property
 *   of the response object will be provided.
 *
 * @returns An Observable that produces zero or more values (as
 *   described above). The values produced will be a user object (if
 *   `includeAuthStatus` is set to `false`) or an object with a session
 *   and authenticated property (if `includeAuthStatus` is set to `true`).
 *
 * #### Example
 *
 * ```js
 * import { getCurrentUser } from '@openmrs/esm-api'
 * const subscription = getCurrentUser().subscribe(
 *   user => console.log(user)
 * )
 * subscription.unsubscribe()
 * getCurrentUser({includeAuthStatus: true}).subscribe(
 *   data => console.log(data.authenticated)
 * )
 * ```
 *
 * #### Be sure to unsubscribe when your component unmounts
 *
 * Otherwise your code will continue getting updates to the user object
 * even after the UI component is gone from the screen. This is a memory
 * leak and source of bugs.
 */
function getCurrentUser(): Observable<Session>;
function getCurrentUser(opts: { includeAuthStatus: true }): Observable<Session>;
function getCurrentUser(opts: { includeAuthStatus: false }): Observable<LoggedInUser>;
function getCurrentUser(opts = { includeAuthStatus: true }): Observable<Session | LoggedInUser> {
  if (lastFetchTimeMillis < Date.now() - 1000 * 60 || !sessionStore.getState().loaded) {
    refetchCurrentUser();
  }

  return new Observable((subscriber) => {
    const handler = (state: SessionStore) => {
      if (state.loaded) {
        if (opts.includeAuthStatus) {
          subscriber.next(state.session);
        } else {
          subscriber.next(state.session?.user);
        }
      }
    };
    handler(sessionStore.getState());
    // The observable subscribe function should return an unsubscribe function,
    // which happens to be exactly what `subscribe` returns.
    return sessionStore.subscribe(handler);
  });
}

export { getCurrentUser };

export function getSessionStore() {
  if (lastFetchTimeMillis < Date.now() - 1000 * 60 || !sessionStore.getState().loaded) {
    refetchCurrentUser();
  }

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

export function setUserLanguage(data: Session) {
  let locale = data.locale ?? data.user?.userProperties?.defaultLocale;

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
 * the user. All subscribers to the current user will be notified of the
 * new users once the new version of the user object is downloaded.
 *
 * @returns The same observable as returned by [[getCurrentUser]].
 *
 * #### Example
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

  return handleSessionResponse(
    openmrsFetch(sessionEndpoint, {
      headers,
    }),
  );
}

export function clearCurrentUser() {
  sessionStore.setState({
    loaded: true,
    session: { authenticated: false, sessionId: '' },
  });
}

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

export function getSessionLocation() {
  return new Promise<SessionLocation | undefined>((res, rej) => {
    const sub = getCurrentUser().subscribe((session) => {
      res(session.sessionLocation);
    }, rej);
    sub.unsubscribe();
  });
}

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
