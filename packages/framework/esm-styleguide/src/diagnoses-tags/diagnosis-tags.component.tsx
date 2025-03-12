import { Tag } from '@carbon/react';
import { type Diagnosis } from '@openmrs/esm-api';
import React from 'react';
import { useDiagnosisRankToColorMap } from './diagnosis-tags.resource';

interface DiagnosisTagsProps {
  diagnoses: Diagnosis[];
}

/**
 * This component takes a list of diagnoses and displays them as
 * Carbon tags, with colors configured base on the rank (e.g. primary or
 * secondary) of the diagnoses.
 */
export const DiagnosisTags: React.FC<DiagnosisTagsProps> = ({ diagnoses }) => {
  const rankToColorMap = useDiagnosisRankToColorMap();

  return (
    <>
      {diagnoses.map((diagnosis) => {
        const color = rankToColorMap?.[diagnosis.rank ?? ''];
        return (
          <Tag key={diagnosis.uuid} type={color}>
            {diagnosis.display}
          </Tag>
        );
      })}
    </>
  );
};
