import React from 'react';
import usePatientName from './usePatientName';
import { SkeletonText } from '@carbon/react';

interface PatientNameProps {
  patientUuid: string;
  className?: any;
}
const PatientName: React.FC<PatientNameProps> = ({ patientUuid }) => {
  const { patientName, isLoadingName } = usePatientName(patientUuid);

  if (isLoadingName) {
    return <SkeletonText />;
  }

  return <>{patientName}</>;
};

export default PatientName;
