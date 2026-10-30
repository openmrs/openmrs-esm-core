import React, { useMemo } from 'react';
import { ContentSwitcher, IconButton, Switch, Theme } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { CloseIcon } from '@openmrs/esm-framework';
import { type ImplementerToolsTab, implementerToolsStore, implementerToolsTabs } from '../store';
import { Configuration } from '../configuration/configuration.component';
import { FrontendModules } from '../frontend-modules/frontend-modules.component';
import { BackendDependencies } from '../backend-dependencies/backend-dependencies.component';
import { FeatureFlags } from '../feature-flags/feature-flags.component';
import type { FrontendModule } from '../types';
import type { ResolvedDependenciesModule } from '../backend-dependencies/openmrs-backend-dependencies';
import styles from './popup.styles.scss';

interface DevToolsPopupProps {
  close(): void;
  frontendModules: Array<FrontendModule>;
  backendDependencies: Array<ResolvedDependenciesModule>;
  visibleTab?: ImplementerToolsTab;
}

interface SwitcherItem {
  index: number;
  name: string;
  text: string;
}

export default function Popup({
  close,
  frontendModules,
  backendDependencies,
  visibleTab = 'configuration',
}: DevToolsPopupProps) {
  const { t } = useTranslation();

  // The visible tab lives in the store so something outside the popup can select a tab while the
  // popup is open.
  const setActiveTab = (tab: ImplementerToolsTab) =>
    implementerToolsStore.setState((state) => ({ ...state, openTab: tab }));

  // Keyed by tab rather than switched on, so a tab added to `implementerToolsTabs` without a label
  // and a panel is a type error rather than a blank panel.
  const labels: Record<ImplementerToolsTab, string> = useMemo(
    () => ({
      configuration: t('configuration', 'Configuration'),
      'frontend-modules': t('frontendModules', 'Frontend modules'),
      'backend-modules': t('backendModules', 'Backend modules'),
      'feature-flags': t('featureFlags', 'Feature flags'),
    }),
    [t],
  );

  const panels: Record<ImplementerToolsTab, React.ReactNode> = useMemo(
    () => ({
      configuration: <Configuration />,
      'frontend-modules': <FrontendModules frontendModules={frontendModules} />,
      'backend-modules': <BackendDependencies backendDependencies={backendDependencies} />,
      'feature-flags': <FeatureFlags />,
    }),
    [backendDependencies, frontendModules],
  );

  return (
    <div className={styles.popup}>
      <Theme theme="g90">
        <div className={styles.topBar}>
          <div className={styles.tabs}>
            <ContentSwitcher
              className={styles.contentSwitcher}
              selectedIndex={implementerToolsTabs.indexOf(visibleTab)}
              onChange={(switcherItem: SwitcherItem) => setActiveTab(implementerToolsTabs[switcherItem.index])}
              size="lg"
            >
              {implementerToolsTabs.map((tab) => (
                <Switch className="darkThemeSwitch" key={tab} name={`${tab}-tab`} text={labels[tab]} />
              ))}
            </ContentSwitcher>
          </div>
          <div>
            <IconButton
              align="left"
              className={styles.closeButton}
              kind="secondary"
              label={t('close', 'Close')}
              onClick={close}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className={styles.content}>{panels[visibleTab]}</div>
      </Theme>
    </div>
  );
}
