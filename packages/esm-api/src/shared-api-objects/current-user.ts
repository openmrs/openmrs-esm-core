import { Observable, ReplaySubject } from "rxjs";
import { filter, map, tap, mergeAll } from "rxjs/operators";
import { openmrsFetch, sessionEndpoint } from "../openmrs-fetch";
import {
  LoggedInUserFetchResponse,
  LoggedInUser,
  CurrentUserWithResponseOption,
  UnauthenticatedUser,
  CurrentUserWithoutResponseOption,
  CurrentUserOptions,
} from "../types";

const userSubject = new ReplaySubject<Promise<LoggedInUserFetchResponse>>(1);
let lastFetchTimeMillis = 0;

function getCurrentUser(): Observable<LoggedInUser>;
function getCurrentUser(
  opts: CurrentUserWithResponseOption
): Observable<UnauthenticatedUser>;
function getCurrentUser(
  opts: CurrentUserWithoutResponseOption
): Observable<LoggedInUser>;
function getCurrentUser(
  opts: CurrentUserOptions = { includeAuthStatus: false }
): Observable<LoggedInUser | UnauthenticatedUser> {
  if (lastFetchTimeMillis < Date.now() - 1000 * 60) {
    refetchCurrentUser();
  }

  return userSubject.asObservable().pipe(
    mergeAll(),
    tap(setUserLanguage),
    map((r: LoggedInUserFetchResponse) =>
      opts.includeAuthStatus ? r.data : r.data.user
    ),
    filter(Boolean)
  ) as Observable<LoggedInUser | UnauthenticatedUser>;
}

function setUserLanguage(sessionResponse: LoggedInUserFetchResponse) {
  if (sessionResponse?.data?.user?.userProperties?.defaultLocale) {
    const locale = sessionResponse.data.user.userProperties.defaultLocale;
    const htmlLang = document.documentElement.getAttribute("lang");
    if (locale != htmlLang) {
      document.documentElement.setAttribute("lang", locale);
    }
  }
}

function userHasPrivilege(requiredPrivilege: string, user: LoggedInUser) {
  return user.privileges.find((p) => requiredPrivilege === p.display);
}

function isSuperUser(user: LoggedInUser) {
  const superUserRole = "System Developer";
  return user.roles.find((role) => role.display === superUserRole);
}

export { getCurrentUser };

export function refetchCurrentUser() {
  lastFetchTimeMillis = Date.now();
  userSubject.next(openmrsFetch(sessionEndpoint));
}

export function userHasAccess(requiredPrivilege: string, user: LoggedInUser) {
  return userHasPrivilege(requiredPrivilege, user) || isSuperUser(user);
}
