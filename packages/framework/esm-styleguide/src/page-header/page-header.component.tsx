/** @module @category UI */
import React from 'react';
import { useConfig } from '@openmrs/esm-react-utils';
import { type StyleguideConfigObject } from '../config-schema';
import styles from './page-header.module.scss';
import classNames from 'classnames';

interface PageHeaderContentProps {
  title: string | JSX.Element;
  illustration: React.ReactElement;
  className?: string;
}

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

type ExcludeOptionalKeys<T, U> = {
  [K in keyof T]: K extends keyof U ? never : K;
}[keyof T];

type XOR<T, U> =
  | (T & { [K in ExcludeOptionalKeys<U, T>]?: never })
  | (U & { [K in ExcludeOptionalKeys<T, U>]?: never });

type ExactPageHeaderProps = XOR<PageHeaderProps, PageHeaderContentProps>;

const isPageHeaderProps = (props: any): props is PageHeaderProps => {
  return 'children' in props;
};

export const PageHeaderContent: React.FC<PageHeaderContentProps> = ({ title, illustration, className }) => {
  const { implementationName } = useConfig<StyleguideConfigObject>({
    externalModuleName: '@openmrs/esm-styleguide',
  });

  return (
    <div className={classNames(styles.pageHeaderContent, className)}>
      {illustration}
      <div className={styles.pageLabels}>
        <p>{implementationName}</p>
        <p className={styles.pageName}>{title}</p>
      </div>
    </div>
  );
};

export const PageHeader: React.FC<ExactPageHeaderProps> = (props) => {
  if (isPageHeaderProps(props)) {
    const { children, className } = props;
    return <div className={classNames(styles.pageHeader, className)}>{children}</div>;
  } else {
    const { title, illustration, className } = props;
    return (
      <div className={classNames(styles.pageHeader, className)}>
        <PageHeaderContent title={title} illustration={illustration} />
      </div>
    );
  }
};
