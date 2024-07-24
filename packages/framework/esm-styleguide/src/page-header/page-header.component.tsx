/** @module @category UI */
import React from 'react';
import { useConfig } from '@openmrs/esm-react-utils';
import { type StyleguideConfigObject } from '../config-schema';
import styles from './page-header.module.scss';
import classNames from 'classnames';

interface PageHeaderProps {
  title: string;
  illustration: React.ReactElement;
}
interface PageHeaderContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageHeaderContainer: React.FC<PageHeaderContainerProps> = ({ className, children }) => {
  return <div className={classNames(styles.pageHeaderContainer, className)}>{children}</div>;
};

export const PageHeader: React.FC<PageHeaderProps> = ({ title, illustration }) => {
  const { clinicName } = useConfig<StyleguideConfigObject>();

  return (
    <div className={styles.pageHeader}>
      {illustration}
      <div className={styles.pageLabels}>
        <p>{clinicName}</p>
        <p className={styles.pageName}>{title}</p>
      </div>
    </div>
  );
};
