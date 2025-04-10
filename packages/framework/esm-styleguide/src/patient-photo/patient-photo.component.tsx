/** @module @category UI */
import React, { useEffect, useMemo, useState } from 'react';
import Avatar from 'react-avatar';
import GeoPattern from 'geopattern';
import { SkeletonIcon } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { usePatientPhoto } from './usePatientPhoto';
import PlaceholderIcon from './placeholder-icon.component';
import styles from './patient-photo.module.scss';

export interface PatientPhotoProps {
  patientName: string;
  patientUuid: string;
  // TODO: Remove this prop
  size?: 'small' | undefined;
}

/**
 * A component which displays the patient photo https://zeroheight.com/23a080e38/p/6663f3-patient-header. If there is no photo, it will display a generated avatar. The default size is 56px.
 */
export function PatientPhoto({ patientUuid, patientName, size }: PatientPhotoProps) {
  const { t } = useTranslation();
  const { data: photo, isLoading } = usePatientPhoto(patientUuid);
  const [validImageSrc, setValidImageSrc] = useState<string | null>(null);
  const pattern = useMemo(() => GeoPattern.generate(patientUuid), [patientUuid]);

  useEffect(() => {
    if (photo?.imageSrc) {
      const img = new Image();
      img.onload = () => setValidImageSrc(photo.imageSrc);
      img.onerror = () => setValidImageSrc(null);
      img.src = photo.imageSrc;
    }
  }, [photo?.imageSrc]);

  const altText = t('avatarAltText', 'Profile photo unavailable - grey placeholder image');

  if (isLoading) {
    return <SkeletonIcon className={styles.skeleton} role="progressbar" />;
  }

  if (photo?.imageSrc && !validImageSrc) {
    return <PlaceholderIcon />;
  }

  return (
    <Avatar
      alt={altText}
      color="rgba(0,0,0,0)"
      maxInitials={3}
      name={patientName}
      size="56"
      src={validImageSrc ?? undefined}
      style={
        !validImageSrc
          ? {
              backgroundImage: pattern.toDataUrl(),
              backgroundRepeat: 'round',
            }
          : undefined
      }
      textSizeRatio={2}
    />
  );
}
