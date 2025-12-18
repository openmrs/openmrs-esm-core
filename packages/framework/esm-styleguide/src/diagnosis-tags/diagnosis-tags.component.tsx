import React from 'react';
import { Tag } from '@carbon/react';
import { useConfig } from '@openmrs/esm-react-utils';
import { type Diagnosis } from '@openmrs/esm-emr-api';
import { type StyleguideConfigObject } from '../config-schema';
import styles from './diagnosis-tags.module.scss';

interface DiagnosisTagsProps {
  diagnoses: Array<Diagnosis>;
}

/**
 * This component takes a list of diagnoses and displays them as
 * Carbon tags, with colors configured base on whether the diagnoses are primary
 * or secondary.
 */
export const DiagnosisTags: React.FC<DiagnosisTagsProps> = ({ diagnoses }) => {
  const { diagnosisTags } = useConfig<StyleguideConfigObject>({
    externalModuleName: '@openmrs/esm-styleguide',
  });

  return (
    <div className={styles.container}>
      {diagnoses.map((diagnosis) => {
        const { rank, uuid, display } = diagnosis;
        // technically rank can be any integer, but we only use 1 for primary
        // and 2 for secondary
        const key = rank === 1 ? 'primaryColor' : 'secondaryColor';
        const color = diagnosisTags[key];
        return (
          <Tag key={uuid} type={color}>
            {display}
          </Tag>
        );
      })}
    </div>
  );
};
