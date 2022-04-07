/** @module @category API */
import { Observable, ReplaySubject } from "rxjs";
import { filter, map, tap, mergeAll } from "rxjs/operators";
import { openmrsFetch, sessionEndpoint } from "../openmrs-fetch";
import type {
  LoggedInUser,
  CurrentUserWithResponseOption,
  CurrentUserWithoutResponseOption,
  CurrentUserOptions,
  SessionLocation,
  Privilege,
  Role,
  Session,
} from "../types";

const userSubject = new ReplaySubject<Promise<Session>>(1);
let lastFetchTimeMillis = 0;

/**
 * The getCurrentUser function returns an observable that produces
 * **zero or more values, over time**. It will produce zero values
 * by default if the user is not logged in. And it will provide a
 * first value when the logged in user is fetched from the server.
 * Subsequent values will be produced whenever the user object is
 * updated.
 *
 * @param options An object with `includeAuthStatus` boolean
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
function getCurrentUser(): Observable<LoggedInUser>;
function getCurrentUser(
  opts: CurrentUserWithResponseOption
): Observable<Session>;
function getCurrentUser(
  opts: CurrentUserWithoutResponseOption
): Observable<LoggedInUser>;
function getCurrentUser(
  opts: CurrentUserOptions = { includeAuthStatus: false }
): Observable<LoggedInUser | Session> {
  if (lastFetchTimeMillis < Date.now() - 1000 * 60) {
    refetchCurrentUser();
  }

  return userSubject.asObservable().pipe(
    mergeAll(),
    tap(setUserLanguage),
    map((r) => (opts.includeAuthStatus ? r : r.user)),
    filter(Boolean)
  ) as Observable<LoggedInUser | Session>;
}

export { getCurrentUser };

function setUserLanguage(data: Session) {
  const locale = data?.user?.userProperties?.defaultLocale ?? data.locale;
  const htmlLang = document.documentElement.getAttribute("lang");

  if (locale !== htmlLang) {
    document.documentElement.setAttribute("lang", locale);
  }
}

function userHasPrivilege(
  requiredPrivilege: string,
  user: { privileges: Array<Privilege> }
) {
  return user.privileges.find((p) => requiredPrivilege === p.display);
}

function isSuperUser(user: { roles: Array<Role> }) {
  const superUserRole = "System Developer";
  return user.roles.find((role) => role.display === superUserRole);
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
export function refetchCurrentUser() {
  lastFetchTimeMillis = Date.now();
  userSubject.next(
    openmrsFetch(sessionEndpoint)
      .then((res) =>
        typeof res.data === "object" ? res.data : Promise.reject()
      )
      .catch(() => ({
        sessionId: "",
        authenticated: false,
      }))
  );
}

export function userHasAccess(
  requiredPrivilege: string,
  user: { privileges: Array<Privilege>; roles: Array<Role> }
) {
  return userHasPrivilege(requiredPrivilege, user) || isSuperUser(user);
}

export function getLoggedInUser() {
  return new Promise<LoggedInUser>((res, rej) => {
    const sub = getCurrentUser().subscribe((user) => {
      res(user);
      sub.unsubscribe();
    }, rej);
  });
}

export function getSessionLocation() {
  return new Promise<SessionLocation | undefined>((res, rej) => {
    const sub = getCurrentUser({ includeAuthStatus: true }).subscribe(
      (session) => {
        res(session.sessionLocation);
        sub.unsubscribe();
      },
      rej
    );
  });
}

export async function setSessionLocation(
  locationUuid: string,
  abortController: AbortController
): Promise<any> {
  await openmrsFetch(sessionEndpoint, {
    method: "POST",
    body: { sessionLocation: locationUuid },
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
  });

  refetchCurrentUser();
}
