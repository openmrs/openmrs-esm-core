export interface LoggedInUser {
  uuid: string;
  display: string;
  username: string | null;
  systemId: string;
  userProperties: Record<string, string>;
  person: Person;
  privileges: Array<Privilege>;
  roles: Array<Role>;
  retired?: boolean;
  [anythingElse: string]: any;
}

export interface UnauthenticatedUser {
  sessionId: string;
  authenticated: boolean;
  user?: LoggedInUser;
  locale: string;
  allowedLocals: Array<string>;
  sessionLocation: null | {
    display: string;
  };
  currentProvider: Person;
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
