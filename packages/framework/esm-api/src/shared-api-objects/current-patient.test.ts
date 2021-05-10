import { fetchCurrentPatient } from "./current-patient";
import { fhir } from "../fhir";

jest.mock("../fhir", () => ({
  fhir: {
    read: jest.fn(),
  },
}));

describe("current patient", () => {
  beforeEach(() => {
    (fhir.read as jest.MockedFunction<any>).mockReset();
  });

  it("fetches the correct patient from a patient chart URL", () => {
    (fhir.read as jest.MockedFunction<any>).mockReturnValueOnce(
      Promise.resolve({
        data: {},
      })
    );

    return fetchCurrentPatient("12").then(() => {
      expect(fhir.read as jest.MockedFunction<any>).toHaveBeenCalledWith({
        type: "Patient",
        patient: "12",
      });
    });
  });

  it("fetches the correct patient from the patient home URL", () => {
    (fhir.read as jest.MockedFunction<any>).mockReturnValueOnce(
      Promise.resolve({
        data: {},
      })
    );

    return fetchCurrentPatient("34").then(() => {
      expect(fhir.read as jest.MockedFunction<any>).toHaveBeenCalledWith({
        type: "Patient",
        patient: "34",
      });
    });
  });

  it("can handle dashes and alphanumeric characters in the patient uuid", () => {
    (fhir.read as jest.MockedFunction<any>).mockReturnValueOnce(
      Promise.resolve({
        data: {},
      })
    );

    return fetchCurrentPatient("34-asdsd-234243h342").then(() => {
      expect(fhir.read as jest.MockedFunction<any>).toHaveBeenCalledWith({
        type: "Patient",
        patient: "34-asdsd-234243h342",
      });
    });
  });
});
