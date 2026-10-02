import React, { useLayoutEffect, useRef, useState } from 'react';
import { Button, Tooltip, TooltipTrigger } from 'react-aria-components';
import classNames from 'classnames';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { useConfig } from '@openmrs/esm-react-utils';
import type { Diagnosis } from '@openmrs/esm-emr-api';
import type { StyleguideConfigObject } from '../config-schema';
import type { CarbonTagColor } from '../utils';
import styles from './diagnosis-tags.module.scss';

export interface DiagnosisTagsProps {
  diagnoses: Array<Pick<Diagnosis, 'uuid' | 'display' | 'rank' | 'certainty'>>;
  /**
   * Mark provisional diagnoses with a leading "?". Confirmed diagnoses, and any with missing or
   * unknown certainty, show just the name. Off by default because diagnoses saved before
   * certainty was captured are stored as provisional.
   */
  showCertainty?: boolean;
}

/** Displays diagnoses with configured rank colours, optionally marking provisional ones. */
export const DiagnosisTags: React.FC<DiagnosisTagsProps> = ({ diagnoses, showCertainty = false }) => {
  const { diagnosisTags } = useConfig<StyleguideConfigObject>({ externalModuleName: '@openmrs/esm-styleguide' });

  return (
    <div className={styles.container}>
      {diagnoses.map((diagnosis) => {
        const isProvisional = showCertainty && diagnosis.certainty === 'PROVISIONAL';
        const color =
          diagnosis.rank === 1 ? (diagnosisTags?.primaryColor ?? 'blue') : (diagnosisTags?.secondaryColor ?? 'gray');

        return (
          <DiagnosisPill key={diagnosis.uuid} color={color} isProvisional={isProvisional} name={diagnosis.display} />
        );
      })}
    </div>
  );
};

interface DiagnosisPillProps {
  color: CarbonTagColor;
  isProvisional: boolean;
  name?: string;
}

function DiagnosisPill({ color, isProvisional, name }: DiagnosisPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [isTruncated, setIsTruncated] = useState(false);
  const isInteractive = isTruncated || isFocused;
  const labelRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!label) {
      return;
    }
    const measure = () => {
      const truncated = label.scrollWidth > label.clientWidth;
      setIsTruncated(truncated);
      if (!truncated) {
        setIsOpen(false);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    return () => observer.disconnect();
  }, [name, isProvisional, isInteractive]);

  const className = classNames(
    'cds--tag',
    'cds--tag--md',
    'cds--layout--size-md',
    `cds--tag--${color}`,
    styles.diagnosisTag,
  );
  const content = (
    <>
      {isProvisional && (
        <>
          <span aria-hidden="true" className={styles.provisionalMark}>
            ?
          </span>
          <span className="cds--visually-hidden">{getCoreTranslation('provisional', 'Provisional')} </span>
        </>
      )}
      <span ref={labelRef} className="cds--tag__label">
        {name}
      </span>
    </>
  );

  if (!isInteractive) {
    return (
      <span className={className} data-testid="diagnosis-tag">
        {content}
      </span>
    );
  }

  return (
    <TooltipTrigger delay={0} closeDelay={150} isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        className={className}
        data-testid="diagnosis-tag"
        onFocusChange={setIsFocused}
        onPress={() => setIsOpen(true)}
      >
        {content}
      </Button>
      <Tooltip className={styles.tagTooltip} placement="bottom" offset={4} containerPadding={8}>
        {name}
      </Tooltip>
    </TooltipTrigger>
  );
}
