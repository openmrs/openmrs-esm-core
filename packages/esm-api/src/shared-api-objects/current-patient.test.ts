import { getCurrentPatient } from "./current-patient";
import { fhir } from "../fhir";
import { first } from "rxjs/operators";

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

    window.history.pushState({}, document.title, `/patient/12/chart`);
    window.dispatchEvent(new CustomEvent("single-spa:routing-event"));

    return getCurrentPatient()
      .pipe(first())
      .toPromise()
      .then(() => {
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

    window.history.pushState({}, document.title, `/patient/34`);
    window.dispatchEvent(new CustomEvent("single-spa:routing-event"));

    return getCurrentPatient()
      .pipe(first())
      .toPromise()
      .then(() => {
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

    window.history.pushState(
      {},
      document.title,
      `/patient/34-asdsd-234243h342`
    );
    window.dispatchEvent(new CustomEvent("single-spa:routing-event"));

    return getCurrentPatient()
      .pipe(first())
      .toPromise()
      .then(() => {
        expect(fhir.read as jest.MockedFunction<any>).toHaveBeenCalledWith({
          type: "Patient",
          patient: "34-asdsd-234243h342",
        });
      });
  });
});
