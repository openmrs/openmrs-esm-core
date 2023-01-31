import type {
  OmrsOfflineHttpHeaderNames,
  OmrsOfflineHttpHeaders,
} from "@openmrs/esm-offline";
import {
  omrsOfflineResponseBodyHttpHeaderName,
  omrsOfflineResponseStatusHttpHeaderName,
} from "./constants";

export function parseOmrsOfflineResponseBodyHeader(headers: Headers) {
  // The ?? undefined here is important as getOmrsHeader returns null by default when the header
  // is missing. undefined is different than null in this case since we want the body to be missing
  // if the header is not there (null is not missing).
  return (
    getOmrsHeader(headers, omrsOfflineResponseBodyHttpHeaderName) ?? undefined
  );
}

export function parseOmrsOfflineResponseStatusHeader(headers: Headers) {
  const status = +(
    getOmrsHeader(headers, omrsOfflineResponseStatusHttpHeaderName) ?? ""
  );

  // The Response API requires the status to be in the 200-599 range and throws otherwise.
  return isNaN(status) || status < 200 || status > 599 ? 503 : status;
}

export function getOmrsHeader<T extends OmrsOfflineHttpHeaderNames>(
  headers: Headers,
  name: T
): OmrsOfflineHttpHeaders[T] | null {
  return headers.get(name) as OmrsOfflineHttpHeaders[T];
}

export function headersToObject(headers: Headers) {
  const result = {};
  headers.forEach((value, key) => (result[key] = value));
  return result;
}
