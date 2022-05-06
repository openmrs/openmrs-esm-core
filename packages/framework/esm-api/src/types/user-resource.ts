export interface Session {
  allowedLocales?: Array<string>;
  authenticated: boolean;
  locale?: string;
  sessionId: string;
  user?: LoggedInUser;
  currentProvider?: { uuid: string; identifier: string };
  sessionLocation?: SessionLocation;
}

export interface LoggedInUser {
  uuid: string;
  display: string;
  username: string;
  systemId: string;
  userProperties: { [key: string]: any } | null;
  person: Person;
  privileges: Array<Privilege>;
  roles: Array<Role>;
  retired: boolean;
  locale: string;
  allowedLocales: Array<string>;
  [anythingElse: string]: any;
}

export interface SessionLocation {
  uuid: string;
  display: string;
  links: Array<any>;
}

export interface Person {
  uuid: string;
  display: string;
  links: Array<any>;
}

export interface Privilege {
  uuid: string;
  display: string;
  links?: Array<any>;
}

export interface Role {
  uuid: string;
  display: string;
  links: Array<any>;
}
