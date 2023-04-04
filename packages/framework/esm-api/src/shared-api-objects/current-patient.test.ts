import { fhirBaseUrl, openmrsFetch } from "../openmrs-fetch";
import { fetchCurrentPatient } from "./current-patient";

jest.mock("../openmrs-fetch", () => ({
  openmrsFetch: jest.fn(),
}));

describe("current patient", () => {
  beforeEach(() => {
    (openmrsFetch as jest.MockedFunction<any>).mockReset();
  });

  it("fetches the correct patient from a patient chart URL", () => {
    (openmrsFetch as jest.MockedFunction<any>).mockReturnValueOnce(
      Promise.resolve({
        data: {},
      })
    );

    return fetchCurrentPatient("12", undefined, false).then(() => {
      expect(openmrsFetch as jest.MockedFunction<any>).toHaveBeenCalledWith(
        `${fhirBaseUrl}/Patient/12`,
        undefined
      );
    });
  });

  it("fetches the correct patient from the patient home URL", () => {
    (openmrsFetch as jest.MockedFunction<any>).mockReturnValueOnce(
      Promise.resolve({
        data: {},
      })
    );

    return fetchCurrentPatient("34", undefined, false).then(() => {
      expect(openmrsFetch as jest.MockedFunction<any>).toHaveBeenCalledWith(
        `${fhirBaseUrl}/Patient/34`,
        undefined
      );
    });
  });

  it("can handle dashes and alphanumeric characters in the patient uuid", () => {
    (openmrsFetch as jest.MockedFunction<any>).mockReturnValueOnce(
      Promise.resolve({
        data: {},
      })
    );

    return fetchCurrentPatient("34-asdsd-234243h342", undefined, false).then(
      () => {
        expect(openmrsFetch as jest.MockedFunction<any>).toHaveBeenCalledWith(
          `${fhirBaseUrl}/Patient/34-asdsd-234243h342`,
          undefined
        );
      }
    );
  });
});
