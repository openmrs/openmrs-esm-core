import { addSvg } from '../svg-utils';
import home from './svgs/Facility-2.svg';
import laboratory from './svgs/Labs.svg';
import appointments from './svgs/Appointments-2.svg';
import patientLists from './svgs/Patient Management_Patients.svg';
import serviceQueues from './svgs/service-queues.svg';

export function setupPictograms() {
  addSvg('omrs-pict-home', home);
  addSvg('omrs-pict-laboratory', laboratory);
  addSvg('omrs-pict-patient-lists', patientLists);
  addSvg('omrs-pict-appointments', appointments);
  addSvg('omrs-pict-service-queues', serviceQueues);
}
