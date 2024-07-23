/** @module @category UI */
import React from 'react';
import styles from './page-header.module.scss';
import classNames from 'classnames';

interface PageHeaderProps {
  title: string;
  illustration: React.ReactElement;
  clinicName: string;
}
interface PageHeaderContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, illustration, clinicName }) => {
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

export const PageHeaderContainer: React.FC<PageHeaderContainerProps> = ({ className, children }) => {
  return <div className={classNames(styles.pageHeaderContainer, className)}>{children}</div>;
};
