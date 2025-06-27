import { type OpenmrsResource } from './openmrs-resource';
import { type Person } from './person-resource';

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
  userProperties: {
    /**
     * The UUIDs of patients the user has visited
     * Separated by commas
     * To get the array, do `user.userProperties.patientsVisited.split(',')`
     * To store the array, do `patientsVisited: patientsVisited.join(',')`
     */
    patientsVisited?: string;
    /**
     * The UUIDs of patient lists the user has starred
     * Separated by commas
     * To get the array, do `user.userProperties.starredPatientLists.split(',')`
     * To store the array, perform `starredPatientLists: starredPatientLists.join(',')`
     */
    starredPatientLists?: string;
    /**
     * The UUID of the location the user has set preference to use for next logins
     */
    defaultLocation?: string;
    [key: string]: string | undefined;
  } | null;
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface User extends OpenmrsResource {
  // TODO: add more attributes
}
