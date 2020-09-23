import makeFhir from "fhir.js/src/fhir.js";
import { openmrsFetch, FetchHeaders, OpenmrsFetchError } from "./openmrs-fetch";

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
          data: err.responseBody,
          config: requestObj,
        };
      }
    );
  },
};

export const fhir = makeFhir({ baseUrl: fhirBaseUrl }, openmrsFhirAdapter);

type FHIRRequestObj = {
  url: string;
  method: string;
  headers: FetchHeaders;
};
