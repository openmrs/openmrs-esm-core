/** @module @category UI */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { getConfig } from '@openmrs/esm-config';
import { type StyleguideConfigObject } from '../config-schema';
import styles from './page-header.module.scss';
import { type CoreTranslationKey, getCoreTranslation } from '@openmrs/esm-translations';

export interface PageHeaderContentProps {
  title: string | JSX.Element;
  illustration: React.ReactElement;
  className?: string;
}

export interface PageHeaderWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/** @internal */
export type ExcludeOptionalKeys<T, U> = {
  [K in keyof T]: K extends keyof U ? never : K;
}[keyof T];

/** @internal */
export type XOR<T, U> =
  | (T & { [K in ExcludeOptionalKeys<U, T>]?: never })
  | (U & { [K in ExcludeOptionalKeys<T, U>]?: never });

export type PageHeaderProps = XOR<PageHeaderWrapperProps, PageHeaderContentProps>;

const isPageHeaderWrapperProps = (props: any): props is PageHeaderWrapperProps => {
  return 'children' in props;
};

/**
 * The page header is typically located at the top of a dashboard. It includes a pictogram on the left,
 * the name of the dashboard or page, and the `implementationName` from the configuration, which is typically
 * the name of the clinic or the authority that is using the implementation. It can also include interactive
 * content on the right-hand side. It can be used in two ways:
 *
 * 1. Alone, in order to render just the page header, with no content on the right side:
 * @example
 * ```tsx
 *   <PageHeader title="My Dashboard" illustration={<Illustration />} />
 * ```
 *
 * 2. Wrapped around the [[PageHeaderContent]] component, in order to render the page header on the left
 * and some other content on the right side:
 * @example
 * ```tsx
 *   <PageHeader>
 *     <PageHeaderContent title="My Dashboard" illustration={<Illustration />} />
 *     <Button>Click me</Button>
 *   </PageHeader>
 * ```
 */
export const PageHeader: React.FC<PageHeaderProps> = (props) => {
  if (isPageHeaderWrapperProps(props)) {
    const { children, className, ...rest } = props;
    return (
      <div className={classNames(styles.pageHeader, className)} {...rest}>
        {children}
      </div>
    );
  } else {
    const { title, illustration, className, ...rest } = props;
    return (
      <div className={classNames(styles.pageHeader, className)} {...rest}>
        <PageHeaderContent title={title} illustration={illustration} />
      </div>
    );
  }
};

/**
 * The PageHeaderContent component should be used inside the [[PageHeader]] component. It is used if the page
 * header should include some content on the right side, in addition to the pictogram and the name of the page.
 * If only the page header is needed, without any additional content, the [[PageHeader]] component can be used
 * on its own, and the PageHeaderContent component is not needed.
 *
 * @example
 * ```tsx
 *   <PageHeader>
 *     <PageHeaderContent title="My Dashboard" illustration={<Illustration />} />
 *     <Button>Click me</Button>
 *   </PageHeader>
 * ```
 */
export const PageHeaderContent: React.FC<PageHeaderContentProps> = ({ title, illustration, className }) => {
  const [config, setConfig] = useState<StyleguideConfigObject | null>(null);

  useEffect(() => {
    getConfig('@openmrs/esm-styleguide').then((fetchedConfig: StyleguideConfigObject) => {
      setConfig(fetchedConfig);
    });
  }, []);

  return (
    <div className={classNames(styles.pageHeaderContent, className)}>
      {illustration}
      <div className={styles.pageLabels}>
        {config?.implementationName && <p>{getCoreTranslation(config.implementationName as CoreTranslationKey)}</p>}
        <p className={styles.pageName}>{title}</p>
      </div>
    </div>
  );
};
