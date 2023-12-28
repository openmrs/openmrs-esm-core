import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurableLink } from '@openmrs/esm-framework';

export default function OfflineToolsAppMenuLink() {
  const { t } = useTranslation();
  return (
    <ConfigurableLink to="${openmrsSpaBase}/offline-tools">
      {t('offlineToolsAppMenuLink', 'Offline tools')}
    </ConfigurableLink>
  );
}
