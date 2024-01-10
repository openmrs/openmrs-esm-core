import type { ReactNode } from 'react';
import React from 'react';
import styles from './shared-page-layout.styles.scss';

export interface SharedPageLayoutProps {
  header: string;
  primaryActions?: ReactNode;
  children?: React.ReactNode;
}

const SharedPageLayout: React.FC<SharedPageLayoutProps> = ({ header: title, primaryActions, children }) => {
  return (
    <>
      <header className={styles.pageHeaderContainer}>
        <h1 className={styles.pageHeader}>{title}</h1>
        {primaryActions}
      </header>
      {children}
    </>
  );
};

export default SharedPageLayout;
