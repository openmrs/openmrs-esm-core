import {
  defineConfigSchema,
  defineExtensionConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
  navigate,
} from '@openmrs/esm-framework';
import { type Application } from 'single-spa';
import { configSchema } from './config-schema';
import { moduleName } from './constants';
import primaryNavRootComponent from './root.component';
import userPanelComponent from './components/user-panel-switcher-item/user-panel-switcher.component';
import changeLanguageLinkComponent from './components/change-language/change-language-link.extension';
import { NavGroup, navGroupConfigSchema } from './components/nav-group/nav-group.component';
import { dashboardConfigSchema } from './components/dashboard/dashboard.component';
import genericLinkComponent, { genericLinkConfigSchema } from './components/generic-link/generic-link.component';
import UserMenuButton from './components/navbar/user-menu-button.component';
import AppMenuButton from './components/navbar/app-menu-button.component';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'primary navigation',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  defineExtensionConfigSchema('link', genericLinkConfigSchema);
  defineExtensionConfigSchema('nav-group', navGroupConfigSchema);
  defineExtensionConfigSchema('dashboard', dashboardConfigSchema);
}

export const root = getSyncLifecycle(primaryNavRootComponent, options);

export const redirect: Application = async () => ({
  bootstrap: async () => navigate({ to: '${openmrsSpaBase}/home' }),
  mount: async () => undefined,
  unmount: async () => undefined,
});

export const userMenuButton = getSyncLifecycle(UserMenuButton, {
  featureName: 'user-menu-button',
  moduleName,
});

export const userPanel = getSyncLifecycle(userPanelComponent, options);

export const changeLanguageLink = getSyncLifecycle(changeLanguageLinkComponent, options);

export const changeLanguageModal = getAsyncLifecycle(
  () => import('./components/change-language/change-language.modal'),
  options,
);

export const appMenuButton = getSyncLifecycle(AppMenuButton, {
  featureName: 'app-menu-button',
  moduleName,
});

export const linkComponent = getSyncLifecycle(genericLinkComponent, {
  featureName: 'Link',
  moduleName,
});

export const navGroup = getSyncLifecycle(NavGroup, options);

export const dashboard = getAsyncLifecycle(() => import('./components/dashboard/dashboard.component'), options);
