/** @module @category UI */
import React, { useMemo } from 'react';
import Avatar from 'react-avatar';
import GeoPattern from 'geopattern';
import { usePatientPhoto } from './usePatientPhoto';

export interface PatientPhotoProps {
  patientName: string;
  patientUuid: string;
  size?: 'small' | undefined;
}

/**
 * A component which displays the patient photo. If there is no photo, it will display
 * a generated avatar. The default size is 80px. Set the size prop to 'small' to display
 * a 48px avatar.
 */
export function PatientPhoto({ patientUuid, patientName, size }: PatientPhotoProps) {
  const { data: photo } = usePatientPhoto(patientUuid);
  const pattern = useMemo(() => GeoPattern.generate(patientUuid), [patientUuid]);

  return (
    <Avatar
      alt={`${patientName ? `${patientName}'s avatar` : 'Patient avatar'}`}
      color="rgba(0,0,0,0)"
      name={patientName}
      src={photo?.imageSrc}
      size={size === 'small' ? '48' : '80'}
      textSizeRatio={size === 'small' ? 1 : 2}
      style={
        !photo
          ? {
              backgroundImage: pattern.toDataUrl(),
              backgroundRepeat: 'round',
            }
          : undefined
      }
    />
  );
}
