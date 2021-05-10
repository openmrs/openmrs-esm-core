import { LoggedInUser, UnauthenticatedUser } from "./user-resource";

export interface FetchResponse<T = any> extends Response {
  data: T;
}

export interface LoggedInUserFetchResponse extends FetchResponse {
  data: UnauthenticatedUser & {
    user?: LoggedInUser;
  };
}
