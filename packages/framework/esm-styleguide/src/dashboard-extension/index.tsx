import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { shallowEqual } from '@openmrs/esm-utils';
import { ConfigurableLink, MaybeIcon } from '@openmrs/esm-framework';
import { type IconId } from '../icons';
import styles from './dashboard.module.scss';

export interface DashboardExtensionProps {
  path: string;
  title: string;
  basePath?: string;
  icon?: IconId;
}

export const DashboardExtension = ({ path, title, basePath, icon }: DashboardExtensionProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = useMemo(() => {
    if (!path) {
      return false;
    }
    const p = path.startsWith('/') ? path.slice(1) : path;
    if (p.startsWith('http')) {
      return p === window.location.href;
    }
    const paths = p.split('/').map((s) => decodeURIComponent(s));

    const localPath = (location.pathname ?? '')
      .split('/')
      .slice(-1 * paths.length)
      .map((s) => decodeURIComponent(s));
    return shallowEqual(paths, localPath);
  }, [location.pathname, path]);

  return (
    <div key={path}>
      <ConfigurableLink
        className={classNames('cds--side-nav__link', { 'active-left-nav-link': isActive })}
        to={`${basePath}/${encodeURIComponent(path)}`}
      >
        <span className={styles.menu}>
          <MaybeIcon icon={icon} className={styles.icon} size={16} />
          <span>{t(title)}</span>
        </span>
      </ConfigurableLink>
    </div>
  );
};

export function createDashboard(props: Omit<DashboardExtensionProps, 'basePath'>) {
  return function ({ basePath }: { basePath: string }) {
    return (
      <BrowserRouter>
        <DashboardExtension basePath={basePath} {...props} />
      </BrowserRouter>
    );
  };
}
