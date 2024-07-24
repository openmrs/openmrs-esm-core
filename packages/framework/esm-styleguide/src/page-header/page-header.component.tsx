/** @module @category UI */
import React from 'react';
import { useConfig } from '@openmrs/esm-react-utils';
import { type StyleguideConfigObject } from '../config-schema';
import styles from './page-header.module.scss';
import classNames from 'classnames';

interface PageHeaderProps {
  title: string | JSX.Element;
  illustration: React.ReactElement;
  className?: string;
}
interface PageHeaderContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageHeaderContainer: React.FC<PageHeaderContainerProps> = ({ children, className }) => {
  return <div className={classNames(styles.pageHeaderContainer, className)}>{children}</div>;
};

export const PageHeader: React.FC<PageHeaderProps> = ({ title, illustration, className }) => {
  const { clinicName } = useConfig<StyleguideConfigObject>({
    externalModuleName: '@openmrs/esm-styleguide',
  });

  return (
    <div className={classNames(styles.pageHeader, className)}>
      {illustration}
      <div className={styles.pageLabels}>
        <p>{clinicName}</p>
        <p className={styles.pageName}>{title}</p>
      </div>
    </div>
  );
};
