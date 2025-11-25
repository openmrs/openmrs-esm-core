/** @module @category UI */
import React, { useEffect, useMemo, useState } from 'react';
import Avatar from 'react-avatar';
import GeoPattern from 'geopattern';
import { SkeletonIcon } from '@carbon/react';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { usePatientPhoto } from './usePatientPhoto';
import PlaceholderIcon from './placeholder-icon.component';
import styles from './patient-photo.module.scss';

export interface PatientPhotoProps {
  patientName: string;
  patientUuid: string;
  alt?: string;
}

/**
 * A component which displays the patient photo https://zeroheight.com/23a080e38/p/6663f3-patient-header. If there is no photo, it will display a generated avatar. The default size is 56px.
 */
export function PatientPhoto({ patientUuid, patientName, alt }: PatientPhotoProps) {
  const { data: photo, isLoading } = usePatientPhoto(patientUuid);
  const [validImageSrc, setValidImageSrc] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const pattern = useMemo(() => GeoPattern.generate(patientUuid), [patientUuid]);

  useEffect(() => {
    if (photo?.imageSrc) {
      setIsValidating(true);
      let cancelled = false;
      const img = new Image();
      img.onload = () => {
        if (!cancelled) {
          setValidImageSrc(photo.imageSrc);
          setIsValidating(false);
        }
      };
      img.onerror = () => {
        if (!cancelled) {
          setValidImageSrc(null);
          setIsValidating(false);
        }
      };
      img.src = photo.imageSrc;

      return () => {
        cancelled = true;
      };
    } else {
      setValidImageSrc(null);
      setIsValidating(false);
    }
  }, [photo?.imageSrc]);

  const altText = useMemo(() => {
    if (alt) {
      return alt;
    }

    return validImageSrc
      ? getCoreTranslation('patientPhotoAlt', 'Profile photo of {{patientName}}', { patientName })
      : getCoreTranslation('patientAvatarAlt', 'Avatar for {{patientName}}', { patientName });
  }, [alt, validImageSrc, patientName]);

  if (isLoading || isValidating) {
    return <SkeletonIcon className={styles.skeleton} data-testid="skeleton-icon" />;
  }

  if (photo?.imageSrc && !validImageSrc) {
    return (
      <PlaceholderIcon
        aria-label={getCoreTranslation('patientPhotoPlaceholder', 'Photo placeholder for {{patientName}}', {
          patientName,
        })}
      />
    );
  }

  return (
    <div aria-label={altText}>
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
    </div>
  );
}
