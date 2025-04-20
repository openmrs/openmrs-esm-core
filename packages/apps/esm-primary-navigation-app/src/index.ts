import {
  defineConfigSchema,
  defineExtensionConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
  navigate,
  setupOfflineSync,
} from '@openmrs/esm-framework';
import { type Application } from 'single-spa';
import { configSchema } from './config-schema';
import { moduleName, userPropertyChange } from './constants';
import { syncUserLanguagePreference } from './offline';
import primaryNavRootComponent from './root.component';
import userPanelComponent from './components/user-panel-switcher-item/user-panel-switcher.component';
import changeLanguageLinkComponent from './components/change-language/change-language-link.extension';
import offlineBannerComponent from './components/offline-banner/offline-banner.component';
import { NavGroup, navGroupConfigSchema } from './components/nav-group/nav-group.component';
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
  defineExtensionConfigSchema('global-nav-group', navGroupConfigSchema);

  setupOfflineSync(userPropertyChange, [], syncUserLanguagePreference);
}

export const root = getSyncLifecycle(primaryNavRootComponent, options);

export const redirect: Application = async () => ({
  bootstrap: async () => navigate({ to: '${openmrsSpaBase}/home' }),
  mount: async () => undefined,
  unmount: async () => undefined,
});

export const userPanel = getSyncLifecycle(userPanelComponent, options);

export const changeLanguageLink = getSyncLifecycle(changeLanguageLinkComponent, options);

export const offlineBanner = getSyncLifecycle(offlineBannerComponent, options);

export const linkComponent = getSyncLifecycle(genericLinkComponent, {
  featureName: 'Link',
  moduleName,
});

export const navGroup = getSyncLifecycle(NavGroup, options);

export const changeLanguageModal = getAsyncLifecycle(
  () => import('./components/change-language/change-language.modal'),
  options,
);

export const userMenuButton = getSyncLifecycle(UserMenuButton, {
  featureName: 'user-menu-button',
  moduleName,
});

export const appMenuButton = getSyncLifecycle(AppMenuButton, {
  featureName: 'app-menu-button',
  moduleName,
});
