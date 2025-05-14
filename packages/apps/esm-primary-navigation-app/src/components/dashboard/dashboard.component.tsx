import React, { useMemo } from 'react';
import classNames from 'classnames';
import { last } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ConfigurableLink, MaybeIcon, Type, useConfig } from '@openmrs/esm-framework';
import styles from './dashboard.scss';

export const dashboardFeatureName = 'Dashboard';

export const dashboardConfigSchema = {
  title: {
    _description: 'The display string for this dashboard',
    _default: 'My Dashboard',
    _type: Type.String,
  },
  path: {
    _description: 'The URL fragment this link points to',
    _default: '',
    _type: Type.String,
  },
  icon: {
    _description: 'The icons for the navigation menu',
    _default: '',
    _type: Type.String,
  },
  moduleName: {
    _description: 'The module which the extension should be loaded into',
    _default: '',
    _type: Type.String,
  },
};

export interface DashboardConfig {
  path: string;
  title: string;
  icon: string;
  moduleName: string;
}

interface DashboardProps {
  basePath: string;
}

export default function Dashboard({ basePath }: DashboardProps) {
  const config = useConfig<DashboardConfig>();
  const { t } = useTranslation(config.moduleName);
  const location = useLocation();

  const navLink = useMemo(() => decodeURIComponent(last(location.pathname.split('/'))), [location.pathname]);

  return (
    <BrowserRouter>
      <div key={config.path}>
        <ConfigurableLink
          className={classNames('cds--side-nav__link', { 'active-left-nav-link': config.path === navLink })}
          to={`${basePath}/${encodeURIComponent(config.path)}`}
        >
          <span className={styles.menu}>
            <MaybeIcon icon={config.icon} className={styles.icon} size={16} />
            <span>{t(config.title)}</span>
          </span>
        </ConfigurableLink>
      </div>
    </BrowserRouter>
  );
}
