import { Session } from "./user-resource";

export interface FetchResponse<T = any> extends Response {
  data: T;
}

export interface LoggedInUserFetchResponse extends FetchResponse {
  data: Session;
}
