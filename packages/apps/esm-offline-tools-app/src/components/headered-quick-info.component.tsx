import type { ReactNode } from 'react';
import React from 'react';
import { SkeletonText } from '@carbon/react';
import styles from './headered-quick-info.styles.scss';

export interface HeaderedQuickInfoProps {
  header: string;
  content: ReactNode;
  isLoading?: boolean;
}

const HeaderedQuickInfo: React.FC<HeaderedQuickInfoProps> = ({ header, content, isLoading = false }) => {
  return (
    <div>
      <h4 className={styles.label01}>{header}</h4>
      {isLoading ? <SkeletonText heading /> : <span className={styles.productiveHeading04}>{content}</span>}
    </div>
  );
};

export default HeaderedQuickInfo;
