/** @module @category API */
import { openmrsFetch, FetchHeaders, OpenmrsFetchError } from "./openmrs-fetch";
import type { ResourceName } from "./types/fhir";

export const fhirBaseUrl = `/ws/fhir2/R4`;

const openmrsFhirAdapter = {
  http(requestObj: FHIRRequestObj) {
    return openmrsFetch(requestObj.url, {
      method: requestObj.method,
      headers: requestObj.headers,
    }).then(
      (response) => {
        return {
          status: response.status,
          headers: response.headers,
          data: response.data,
          config: requestObj,
        };
      },
      (err: OpenmrsFetchError) => {
        return {
          status: err.response.status,
          headers: err.response.headers,
          data: err.responseBody as any,
          config: requestObj,
        };
      }
    );
  },
};

/**
 * The `fhir` object is replicates the API from [fhir.js](https://github.com/FHIR/fhir.js)
 * that can be used to call FHIR-compliant OpenMRS APIs. See
 * [the docs for fhir.js](https://github.com/FHIR/fhir.js) for more info
 * and example usage.
 *
 * This object should be considered deprecated and may be removed from a future version
 * of the framework.
 *
 * @category API
 * @deprecated
 */
export const fhir = {
  read: <T>(
    options: FHIRRequestOptions
  ): Promise<{
    status: number;
    headers: Headers;
    data: T;
    config: FHIRRequestObj;
  }> => {
    return openmrsFhirAdapter.http({
      url: `${fhirBaseUrl}/${options.type}/${options.patient}`,
      method: "GET",
      headers: options.headers ?? {},
    });
  },
};

/** @deprecated */
export interface FHIRRequestOptions {
  type: ResourceName;
  patient: string;
  headers?: FetchHeaders;
}

/** @deprecated */
export interface FHIRRequestObj {
  url: string;
  method: string;
  headers: FetchHeaders;
}
