import React from 'react';
import usePatientName from './usePatientName';
import { SkeletonText } from '@carbon/react';

interface PatientNameProps {
  patientUuid: string;
  className?: any;
}

/**
 * A react component to render patient name
 *
 * Please note that the person and patient UUID are the same.
 */
const PatientName: React.FC<PatientNameProps> = ({ patientUuid }) => {
  const { patientName, isLoadingName } = usePatientName(patientUuid);

  if (isLoadingName) {
    return <SkeletonText />;
  }

  return <>{patientName}</>;
};

export default PatientName;
