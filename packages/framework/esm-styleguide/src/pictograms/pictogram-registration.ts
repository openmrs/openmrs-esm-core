import { addSvg } from '../svg-utils';
import appointments from './svgs/Appointments-2.svg';
import home from './svgs/Facility-2.svg';
import inPatient from './svgs/in-patient.svg';
import laboratory from './svgs/Labs.svg';
import patientLists from './svgs/Patient Management_Patients.svg';
import patientRegistration from './svgs/registration.svg';
import pharmacy from './svgs/pharmacy-1.svg';
import serviceQueues from './svgs/service-queues.svg';
import imagingOrder from './svgs/imaging-order.svg';
import materialOrder from './svgs/material-order.svg';
import procedureOrder from './svgs/procedure-order.svg';
import referralOrder from './svgs/referral-order.svg';

export function setupPictograms() {
  addSvg('omrs-pict-home', home);
  addSvg('omrs-pict-laboratory', laboratory);
  addSvg('omrs-pict-patient-lists', patientLists);
  addSvg('omrs-pict-appointments', appointments);
  addSvg('omrs-pict-service-queues', serviceQueues);
  addSvg('omrs-pict-registration', patientRegistration);
  addSvg('omrs-pict-in-patient', inPatient);
  addSvg('omrs-pict-pharmacy', pharmacy);
  addSvg('omrs-pict-imaging-order', imagingOrder);
  addSvg('omrs-pict-material-order', materialOrder);
  addSvg('omrs-pict-procedure-order', procedureOrder);
  addSvg('omrs-pict-referral-order', referralOrder);
}
