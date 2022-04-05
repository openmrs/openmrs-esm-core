/**
 * @module
 * @category API
 */
import { openmrsFetch, FetchHeaders, OpenmrsFetchError } from "./openmrs-fetch";
import type { FhirClient } from "./types/fhir";

export const fhirBaseUrl = `/ws/fhir2/R4`;

const makeFhir = require("fhir.js/src/fhir.js");
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
          data: err.responseBody,
          config: requestObj,
        };
      }
    );
  },
};

/**
 * The `fhir` object is [an instance of fhir.js](https://github.com/FHIR/fhir.js)
 * that can be used to call FHIR-compliant OpenMRS APIs. See
 * [the docs for fhir.js](https://github.com/FHIR/fhir.js) for more info
 * and example usage.
 *
 * @category API
 */
export const fhir: FhirClient = makeFhir(
  { baseUrl: fhirBaseUrl },
  openmrsFhirAdapter
);

export interface FHIRRequestObj {
  url: string;
  method: string;
  headers: FetchHeaders;
}
