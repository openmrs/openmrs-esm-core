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
