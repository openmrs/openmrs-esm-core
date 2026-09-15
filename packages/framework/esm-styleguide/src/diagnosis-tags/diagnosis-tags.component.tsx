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
  /** Show recorded certainty alongside the name. Missing or unknown certainty is omitted. */
  showCertainty?: boolean;
}

/** Displays diagnoses with configured rank colours and optional certainty labels. */
export const DiagnosisTags: React.FC<DiagnosisTagsProps> = ({ diagnoses, showCertainty = false }) => {
  const { diagnosisTags } = useConfig<StyleguideConfigObject>({ externalModuleName: '@openmrs/esm-styleguide' });

  return (
    <div className={styles.container}>
      {diagnoses.map((diagnosis) => {
        const certaintyLabel =
          showCertainty && diagnosis.certainty === 'CONFIRMED'
            ? getCoreTranslation('confirmed', 'Confirmed')
            : showCertainty && diagnosis.certainty === 'PROVISIONAL'
              ? getCoreTranslation('provisional', 'Provisional')
              : null;
        const color =
          diagnosis.rank === 1 ? diagnosisTags?.primaryColor ?? 'red' : diagnosisTags?.secondaryColor ?? 'blue';

        return (
          <DiagnosisPill key={diagnosis.uuid} certaintyLabel={certaintyLabel} color={color} name={diagnosis.display} />
        );
      })}
    </div>
  );
};

interface DiagnosisPillProps {
  certaintyLabel: string | null;
  color: CarbonTagColor;
  name?: string;
}

function DiagnosisPill({ certaintyLabel, color, name }: DiagnosisPillProps) {
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
  }, [name, certaintyLabel, isInteractive]);

  const className = classNames(
    'cds--tag',
    'cds--tag--md',
    'cds--layout--size-md',
    `cds--tag--${color}`,
    styles.diagnosisTag,
  );
  const content = (
    <>
      <span ref={labelRef} className="cds--tag__label">
        {name}
      </span>
      {certaintyLabel && <span className={styles.certaintySuffix}> ({certaintyLabel})</span>}
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
