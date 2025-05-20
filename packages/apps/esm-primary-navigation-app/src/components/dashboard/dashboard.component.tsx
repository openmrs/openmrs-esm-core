import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { isEmpty } from 'lodash-es';
import { InlineNotification } from '@carbon/react';
import { getCoreTranslation, Type, useConfig } from '@openmrs/esm-framework';
import { DashboardExtension } from '@openmrs/esm-styleguide';

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
  const { t } = useTranslation();
  const config = useConfig<DashboardConfig>();

  if (!config.moduleName || isEmpty(config.moduleName)) {
    console.error("Config schema for the dashboard extension is missing the property 'moduleName'");
  }

  if (!config.path || isEmpty(config.path)) {
    console.error("Config schema for the dashboard extension is missing the property 'path'");
    return (
      <InlineNotification
        kind="error"
        subtitle={t(
          'missingPropertyInDashboardExtension',
          `Error: Cannot render the dashboard extension without the property "path" being set in the configuration schema`,
        )}
        title={getCoreTranslation('error')}
      />
    );
  }

  return (
    <BrowserRouter>
      <DashboardExtension
        path={config.path}
        title={config.title}
        basePath={basePath}
        icon={config.icon}
        moduleName={config.moduleName}
      />
    </BrowserRouter>
  );
}
