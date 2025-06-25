import React, { useMemo } from 'react';
import classNames from 'classnames';
import { last } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ConfigurableLink, MaybeIcon } from '@openmrs/esm-framework';
import { InlineNotification } from '@carbon/react';
import { getCoreTranslation } from '@openmrs/esm-translations';
import styles from './dashboard.scss';

export interface DashboardExtensionProps {
  path: string;
  title: string;
  basePath: string;
  icon: string;
}

export const DashboardExtension = ({ path, title, basePath, icon }: DashboardExtensionProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const navLink = useMemo(() => decodeURIComponent(last(location.pathname) ?? ''), [location.pathname]);

  return (
    <div key={path}>
      <ConfigurableLink
        className={classNames('cds--side-nav__link', { 'active-left-nav-link': path === navLink })}
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
