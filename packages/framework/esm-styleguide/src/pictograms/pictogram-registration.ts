import { addSvg } from '../svg-utils';
import appointments from './svgs/appointments.svg';
import assessment1 from './svgs/assessment-1.svg';
import assessment2 from './svgs/assessment-2.svg';
import bloodBank from './svgs/blood-bank.svg';
import cardiology from './svgs/cardiology.svg';
import ctScan from './svgs/ct-scan.svg';
import dentistry from './svgs/dentistry.svg';
import emergencyDepartment from './svgs/emergency-department.svg';
import facility from './svgs/facility.svg';
import geriatrics from './svgs/geriatrics.svg';
import gynaecology from './svgs/gynaecology.svg';
import inPatient from './svgs/in-patient.svg';
import stockManagement from './svgs/inventory.svg';
import labs from './svgs/labs.svg';
import labs2 from './svgs/labs-2.svg';
import obstetrics from './svgs/obstetrics.svg';
import patientSearch from './svgs/patient-search.svg';
import patients from './svgs/patients.svg';
import paymentsDesk from './svgs/payments-desk.svg';
import pharmacy from './svgs/pharmacy-1.svg';
import pharmacy2 from './svgs/pharmacy-2.svg';
import patientRegistration from './svgs/registration.svg';
import serviceQueues from './svgs/service-queues.svg';
import transfer from './svgs/transfer.svg';
import triage from './svgs/triage.svg';
import xray from './svgs/x-ray.svg';
import { type PictogramId } from './pictograms';

export function setupPictograms() {
  addPictogramSvg('omrs-pict-appointments', appointments);
  addPictogramSvg('omrs-pict-assessment-1', assessment1);
  addPictogramSvg('omrs-pict-assessment-2', assessment2);
  addPictogramSvg('omrs-pict-blood-bank', bloodBank);
  addPictogramSvg('omrs-pict-cardiology', cardiology);
  addPictogramSvg('omrs-pict-ct-scan', ctScan);
  addPictogramSvg('omrs-pict-dentistry', dentistry);
  addPictogramSvg('omrs-pict-emergency-department', emergencyDepartment);
  addPictogramSvg('omrs-pict-facility', facility);
  addPictogramSvg('omrs-pict-geriatrics', geriatrics);
  addPictogramSvg('omrs-pict-gynaecology', gynaecology);
  addPictogramSvg('omrs-pict-in-patient', inPatient);
  addPictogramSvg('omrs-pict-laboratory', labs);
  addPictogramSvg('omrs-pict-labs-2', labs2);
  addPictogramSvg('omrs-pict-obstetrics', obstetrics);
  addPictogramSvg('omrs-pict-patient-search', patientSearch);
  addPictogramSvg('omrs-pict-patients', patients);
  addPictogramSvg('omrs-pict-payments-desk', paymentsDesk);
  addPictogramSvg('omrs-pict-pharmacy', pharmacy);
  addPictogramSvg('omrs-pict-pharmacy-2', pharmacy2);
  addPictogramSvg('omrs-pict-registration', patientRegistration);
  addPictogramSvg('omrs-pict-service-queues', serviceQueues);
  addPictogramSvg('omrs-pict-stock-management', stockManagement);
  addPictogramSvg('omrs-pict-transfer', transfer);
  addPictogramSvg('omrs-pict-triage', triage);
  addPictogramSvg('omrs-pict-x-ray', xray);
}

/**
 * A type-safe wrapper around addSvg
 * @param pictogramId
 * @param svgString
 */
function addPictogramSvg(pictogramId: PictogramId, svgString: string) {
  addSvg(pictogramId, svgString);
}
