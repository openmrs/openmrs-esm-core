import React from 'react';
import { trimEnd } from 'lodash-es';
import { useLocation, useParams } from 'react-router-dom';
import { ExtensionSlot, useExtensionSlotMeta } from '@openmrs/esm-framework';
import type { OfflineToolsPageConfig } from '../types';

export interface OfflineToolsPageParams {
  page: string;
}

const OfflineToolsPage: React.FC = () => {
  const location = useLocation();
  const { page } = useParams();
  const basePath = trimEnd(window.getOpenmrsSpaBase(), '/') + location.pathname;
  const meta = useExtensionSlotMeta<OfflineToolsPageConfig>('offline-tools-page-slot');

  const pageConfig = Object.values(meta).find((pageConfig) => pageConfig.name === page);

  if (!pageConfig) {
    return null;
  }

  return (
    <>
      <ExtensionSlot name="breadcrumbs-slot" />
      <ExtensionSlot key={pageConfig.slot} name={pageConfig.slot} state={{ basePath }} />
    </>
  );
};

export default OfflineToolsPage;
