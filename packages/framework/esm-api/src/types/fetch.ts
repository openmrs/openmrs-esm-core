import { LoggedInUser, UnauthenticatedUser } from "./user-resource";

export interface FetchResponse<T = any> extends Response {
  data: T;
}

export type LoggedInUserData = UnauthenticatedUser & {
  user?: LoggedInUser;
};

export interface LoggedInUserFetchResponse extends FetchResponse {
  data: LoggedInUserData;
}
