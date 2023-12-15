import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurableLink } from '@openmrs/esm-framework';
import { routes } from '../constants';

interface OfflineToolsNavLinkProps {
  page?: string;
  title: string;
}

export default function OfflineToolsNavLink({ page, title }: OfflineToolsNavLinkProps) {
  const { t } = useTranslation();

  return (
    <div key={page}>
      <ConfigurableLink
        to={'${openmrsSpaBase}/' + routes.offlineTools + (page ? `/${page}` : '')}
        className="cds--side-nav__link"
      >
        {t(title)}
      </ConfigurableLink>
    </div>
  );
}
