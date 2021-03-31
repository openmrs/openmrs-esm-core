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
  privileges: Array<Privilege>;
  roles: Array<Role>;
  retired: boolean;
  locale: string;
  allowedLocales: Array<string>;
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
  links: Array<any>;
}

export interface Privilege {
  uuid: string;
  display: string;
  links: Array<any>;
}

export interface Role {
  uuid: string;
  display: string;
  links: Array<any>;
}
