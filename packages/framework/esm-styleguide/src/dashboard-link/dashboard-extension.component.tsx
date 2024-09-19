import React, { useMemo } from 'react';
import classNames from 'classnames';
import { ConfigurableLink } from '@openmrs/esm-framework';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './dashboard-extension.scss';

export interface DashboardLinkConfig {
  name: string;
  title: string;
  renderIcon?: React.ElementType;
}

export function DashboardExtension({ dashboardLinkConfig }: { dashboardLinkConfig: DashboardLinkConfig }) {
  const { t } = useTranslation();
  const { name } = dashboardLinkConfig;
  const location = useLocation();
  const spaHomePage = ` ${window.getOpenmrsSpaBase()}home`;

  const navLink = useMemo(() => {
    const pathArray = location.pathname.split('/home');
    const lastElement = pathArray[pathArray.length - 1];
    return decodeURIComponent(lastElement);
  }, [location.pathname]);

  return (
    <ConfigurableLink
      className={classNames('cds--side-nav__link', {
        'active-left-nav-link': navLink.match(name),
      })}
      to={`${spaHomePage}/${name}`}
    >
      {dashboardLinkConfig.renderIcon && <dashboardLinkConfig.renderIcon className={styles.icon} size={15} />}
      {t(dashboardLinkConfig.title)}
    </ConfigurableLink>
  );
}
