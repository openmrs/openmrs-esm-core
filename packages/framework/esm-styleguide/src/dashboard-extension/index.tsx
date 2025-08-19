import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { shallowEqual } from '@openmrs/esm-utils';
import { ConfigurableLink, MaybeIcon } from '@openmrs/esm-framework';
import styles from './dashboard.module.scss';

export interface DashboardExtensionProps {
  path: string;
  title: string;
  basePath: string;
  icon: string;
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
    const paths = p.split('/');

    const localPath = (location.pathname ?? '')
      .split('/')
      .slice(-1 * paths.length)
      .map(s => decodeURI(s));
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
