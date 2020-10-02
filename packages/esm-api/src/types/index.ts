export interface FetchResponse<T = any> extends Response {
  data: T;
}

export interface CurrentUserOptions {
  includeAuthStatus?: boolean;
}

export interface CurrentUserWithResponseOption extends CurrentUserOptions {
  includeAuthStatus: true;
}

export interface CurrentUserWithoutResponseOption extends CurrentUserOptions {
  includeAuthStatus: false;
}

export interface LoggedInUser {
  uuid: string;
  display: string;
  username: string;
  systemId: string;
  userProperties: any;
  person: Person;
  privileges: Privilege[];
  roles: Role[];
  retired: boolean;
  locale: string;
  allowedLocales: string[];
  [anythingElse: string]: any;
}

export interface UnauthenticatedUser {
  sessionId: string;
  authenticated: boolean;
  user?: LoggedInUser;
}

export interface Person {
  uuid: string;
  display: string;
  links: any[];
}

export interface Privilege {
  uuid: string;
  display: string;
  links: any[];
}

export interface Role {
  uuid: string;
  display: string;
  links: any[];
}

export interface LoggedInUserFetchResponse extends FetchResponse {
  data: UnauthenticatedUser & {
    user?: LoggedInUser;
  };
}
