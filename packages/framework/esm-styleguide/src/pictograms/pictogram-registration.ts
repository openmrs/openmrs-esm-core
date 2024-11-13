import { addSvg } from '../svg-utils';
import appointments from './svgs/Appointments-2.svg';
import home from './svgs/Facility-2.svg';
import inPatient from './svgs/in-patient.svg';
import laboratory from './svgs/Labs.svg';
import patientLists from './svgs/Patient Management_Patients.svg';
import patientRegistration from './svgs/registration.svg';
import serviceQueues from './svgs/service-queues.svg';

export function setupPictograms() {
  addSvg('omrs-pict-home', home);
  addSvg('omrs-pict-laboratory', laboratory);
  addSvg('omrs-pict-patient-lists', patientLists);
  addSvg('omrs-pict-appointments', appointments);
  addSvg('omrs-pict-service-queues', serviceQueues);
  addSvg('omrs-pict-registration', patientRegistration);
  addSvg('omrs-pict-in-patient', inPatient);
}
