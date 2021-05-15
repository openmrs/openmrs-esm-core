export interface LoggedInUser {
  uuid: string;
  username: string;
  userProperties: any;
  person: {
    display: string;
  };
}

export interface UserSession {
  sessionLocation?: {
    display: string;
  };
}

export interface SearchedPatient {
  patientId: number;
  uuid: string;
  identifiers: Array<Identifier>;
  person: {
    age: number;
    birthdate: string;
    display: string;
    gender: string;
  };
  display: string;
}

export interface Identifier {
  display: string;
  uuid: string;
  identifier: string;
  identifierType: {
    uuid: string;
    display: string;
  };
  location: {
    uuid: string;
    display: string;
  };
  preferred: boolean;
  voided: boolean;
}
