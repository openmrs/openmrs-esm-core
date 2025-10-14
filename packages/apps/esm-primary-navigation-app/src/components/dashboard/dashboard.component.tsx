import React, { useContext, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InlineNotification } from '@carbon/react';
import {
  ComponentContext,
  DashboardExtension,
  getCoreTranslation,
  useConfig,
  openmrsComponentDecorator,
  type OpenmrsReactComponentProps,
  Type,
  type IconId,
} from '@openmrs/esm-framework/src/internal';

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
  icon: IconId;
  moduleName: string;
}

interface DashboardProps {
  basePath: string;
  moduleName?: string;
}

export default function Dashboard({ basePath, moduleName }: DashboardProps) {
  const componentContext = useContext(ComponentContext);
  const module = moduleName ?? componentContext.extension?.extensionSlotModuleName ?? componentContext.moduleName;

  const Component = useMemo(
    () =>
      openmrsComponentDecorator<OpenmrsReactComponentProps>({
        moduleName: module,
        featureName: 'dashboard',
      })(() => <DashboardInternal basePath={basePath} />),
    [basePath, module],
  );

  return (
    <BrowserRouter>
      <Component
        _extensionContext={{
          extensionId: componentContext.extension?.extensionId,
          extensionSlotName: componentContext.extension?.extensionSlotName,
          extensionSlotModuleName: module,
        }}
      />
    </BrowserRouter>
  );
}

// t('noPathInDashboardExtension', 'Cannot render the dashboard extension without the property "path" being set in the configuration schema')
function DashboardInternal({ basePath }: { basePath: string }) {
  const { t } = useTranslation('@openmrs/esm-primary-navigation-app');
  const config = useConfig<DashboardConfig>();

  if (!config.path) {
    return (
      <InlineNotification
        kind="error"
        subtitle={t(
          'noPathInDashboardExtension',
          `Cannot render the dashboard extension without the property "path" being set in the configuration schema`,
        )}
        title={getCoreTranslation('error')}
      />
    );
  }

  return <DashboardExtension path={config.path} title={config.title} basePath={basePath} icon={config.icon} />;
}
