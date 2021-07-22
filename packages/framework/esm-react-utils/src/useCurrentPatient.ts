import { useEffect, useReducer } from "react";
import { fetchCurrentPatient, PatientUuid } from "@openmrs/esm-api";

type NullablePatient = fhir.Patient | null;

interface CurrentPatientState {
  patient: NullablePatient;
  isLoadingPatient: boolean;
  err: Error | null;
}

interface LoadPatient {
  type: ActionTypes.loadPatient;
}

interface NewPatient {
  type: ActionTypes.newPatient;
  patient: NullablePatient;
}

interface PatientLoadError {
  type: ActionTypes.loadError;
  err: Error | null;
}

type Action = LoadPatient | NewPatient | PatientLoadError;

enum ActionTypes {
  loadPatient = "loadPatient",
  newPatient = "newPatient",
  loadError = "patientLloadErroroadError",
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
    case ActionTypes.loadPatient:
      return {
        ...state,
        patient: null,
        isLoadingPatient: true,
        err: null,
      };
    case ActionTypes.newPatient:
      return {
        ...state,
        patient: action.patient,
        isLoadingPatient: false,
        err: null,
      };
    case ActionTypes.loadError:
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
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let active = true;

    if (patientUuid) {
      fetchCurrentPatient(patientUuid).then(
        (patient) =>
          active &&
          dispatch({
            patient: patient.data,
            type: ActionTypes.newPatient,
          }),
        (err) =>
          active &&
          dispatch({
            err,
            type: ActionTypes.loadError,
          })
      );
      dispatch({ type: ActionTypes.loadPatient });
    } else {
      dispatch({ type: ActionTypes.newPatient, patient: null });
    }

    return () => {
      active = false;
    };
  }, [patientUuid]);

  return [state.isLoadingPatient, state.patient, patientUuid, state.err];
}
