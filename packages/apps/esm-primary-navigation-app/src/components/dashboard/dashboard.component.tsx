import React from 'react';
import { Type, useConfig } from '@openmrs/esm-framework';
import { DashboardExtension } from '@openmrs/esm-styleguide';

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

  return (
    <DashboardExtension
      path={config.path}
      title={config.title}
      basePath={basePath}
      icon={config.icon}
      moduleName={config.moduleName}
    />
  );
}
