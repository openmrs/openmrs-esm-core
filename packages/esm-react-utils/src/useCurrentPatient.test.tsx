import React from "react";
import { render } from "@testing-library/react";
import { getCurrentPatient, getCurrentPatientUuid } from "@openmrs/esm-api";
import { never, of, throwError } from "rxjs";
import { useCurrentPatient } from "./useCurrentPatient";

const mockedGetPatient = (getCurrentPatient as unknown) as jest.MockedFunction<any>;
const mockedGetPatientUuid = (getCurrentPatientUuid as unknown) as jest.MockedFunction<any>;

jest.mock("@openmrs/esm-api", () => ({
  getCurrentPatient: jest.fn(),
  getCurrentPatientUuid: jest.fn(),
}));

function RenderPatientValues() {
  const [isLoadingPatient, patient, patientUuid, err] = useCurrentPatient();
  return (
    <>
      <div>{isLoadingPatient ? "loadingPatient" : "notLoadingPatient"}</div>
      <div>{patient || "noPatient"}</div>
      <div>{patientUuid || "noPatientUuid"}</div>
      <div>{err ? err.message : "noErr"}</div>
    </>
  );
}

describe(`useCurrentPatient`, () => {
  beforeEach(() => {
    mockedGetPatient.mockReset();
    mockedGetPatientUuid.mockReset();
  });

  it(`starts off with the patient loading`, () => {
    mockedGetPatient.mockReturnValueOnce(never());
    mockedGetPatientUuid.mockReturnValueOnce(never());
    const wrapper = render(<RenderPatientValues />);
    expect(wrapper.getByText("loadingPatient")).toBeTruthy();
    expect(wrapper.getByText("noPatient")).toBeTruthy();
    expect(wrapper.getByText("noPatientUuid")).toBeTruthy();
    expect(wrapper.getByText("noErr")).toBeTruthy();
  });

  it(`it first sets the patientUuid`, () => {
    mockedGetPatient.mockReturnValueOnce(never());
    mockedGetPatientUuid.mockReturnValueOnce(of("thePatientUuid"));
    const wrapper = render(<RenderPatientValues />);
    expect(wrapper.getByText("loadingPatient")).toBeTruthy();
    expect(wrapper.getByText("noPatient")).toBeTruthy();
    expect(wrapper.getByText("thePatientUuid")).toBeTruthy();
    expect(wrapper.getByText("noErr")).toBeTruthy();
  });

  it(`it eventually sets both the patientUuid and patient`, () => {
    mockedGetPatient.mockReturnValueOnce(of("thePatient"));
    mockedGetPatientUuid.mockReturnValueOnce(of("thePatientUuid"));
    const wrapper = render(<RenderPatientValues />);
    expect(wrapper.getByText("notLoadingPatient")).toBeTruthy();
    expect(wrapper.getByText("thePatient")).toBeTruthy();
    expect(wrapper.getByText("thePatientUuid")).toBeTruthy();
    expect(wrapper.getByText("noErr")).toBeTruthy();
  });

  it(`it sets the error if one occurs`, () => {
    mockedGetPatient.mockReturnValueOnce(
      throwError(Error("Could not find patient"))
    );
    mockedGetPatientUuid.mockReturnValueOnce(of("thePatientUuid"));
    const wrapper = render(<RenderPatientValues />);
    expect(wrapper.getByText("notLoadingPatient")).toBeTruthy();
    expect(wrapper.getByText("noPatient")).toBeTruthy();
    expect(wrapper.getByText("thePatientUuid")).toBeTruthy();
    expect(wrapper.getByText("Could not find patient")).toBeTruthy();
  });
});
