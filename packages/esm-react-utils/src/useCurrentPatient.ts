import React from "react";
import { reportError } from "@openmrs/esm-error-handling";
import {
  fetchCurrentPatient,
  getCurrentPatient,
  PatientUuid,
} from "@openmrs/esm-api";

type NullablePatient = fhir.Patient | null;

interface CurrentPatientState {
  patient: NullablePatient;
  isLoadingPatient: boolean;
  err: Error | null;
}

interface NewPatient {
  type: ActionTypes.newPatient;
  patient: fhir.Patient;
}

interface PatientLoadError {
  type: ActionTypes.patientLoadError;
  err: Error | null;
}

type Action = NewPatient | PatientLoadError;

enum ActionTypes {
  newPatient = "newPatient",
  patientLoadError = "patientLoadError",
}

const initialState: CurrentPatientState = {
  patient: null,
  isLoadingPatient: true,
  err: null,
};

function getPatientUuidFromUrl(): PatientUuid {
  const match = /\/patient\/([a-zA-Z0-9\-]+)\/?/.exec(location.pathname);
  return match && match[1];
}

function reducer(
  state: CurrentPatientState,
  action: Action
): CurrentPatientState {
  switch (action.type) {
    case ActionTypes.newPatient:
      return {
        ...state,
        patient: action.patient,
        isLoadingPatient: false,
        err: null,
      };
    case ActionTypes.patientLoadError:
      return {
        ...state,
        patient: null,
        isLoadingPatient: false,
        err: action.err,
      };
    default:
      return state;
  }
}

/* This React hook returns the current patient, as specified by the current route. It returns
 * all the information needed to render a loading state, error state, and normal/success state.
 */
export function useCurrentPatient(
  patientUuid = getPatientUuidFromUrl()
): [boolean, NullablePatient, PatientUuid, Error | null] {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    const sub = getCurrentPatient().subscribe(
      (patient) => dispatch({ type: ActionTypes.newPatient, patient }),
      (err) => {
        dispatch({ type: ActionTypes.patientLoadError, err });
        reportError(err);
      }
    );
    return () => {
      sub.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    fetchCurrentPatient(patientUuid);
  }, [patientUuid]);

  return [state.isLoadingPatient, state.patient, patientUuid, state.err];
}
