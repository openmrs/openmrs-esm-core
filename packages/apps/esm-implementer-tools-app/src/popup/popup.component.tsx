import React, { useMemo, useState } from 'react';
import { ContentSwitcher, IconButton, Switch } from '@carbon/react';
import { ChevronUp, ChevronDown } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { CloseIcon } from '@openmrs/esm-framework';
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
  visibleTabIndex?: number;
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
  visibleTabIndex = 0,
}: DevToolsPopupProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(visibleTabIndex ? visibleTabIndex : 0);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleHeight = () => {
    setIsExpanded(!isExpanded);
  };

  const tabContent = useMemo(() => {
    if (activeTab === 0) {
      return <Configuration isExpanded={isExpanded} />;
    } else if (activeTab === 1) {
      return <FrontendModules frontendModules={frontendModules} />;
    } else if (activeTab === 2) {
      return <BackendDependencies backendDependencies={backendDependencies} />;
    } else {
      return <FeatureFlags />;
    }
  }, [activeTab, backendDependencies, frontendModules, isExpanded]);

  return (
    <div className={`${styles.popup} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.topBar}>
        <div className={styles.tabs}>
          <ContentSwitcher
            selectedIndex={activeTab}
            onChange={(switcherItem: SwitcherItem) => {
              setActiveTab(switcherItem.index);
            }}
            size="lg"
          >
            <Switch name="configuration-tab" text={t('configuration', 'Configuration')} className="darkThemeSwitch" />
            <Switch
              name="frontend-modules-tab"
              text={t('frontendModules', 'Frontend modules')}
              className="darkThemeSwitch"
            />
            <Switch
              name="backend-modules-tab"
              text={t('backendModules', 'Backend modules')}
              className="darkThemeSwitch"
            />
            <Switch name="feature-flags-tab" text={t('featureFlags', 'Feature flags')} className="darkThemeSwitch" />
          </ContentSwitcher>
        </div>
        <div>
          <IconButton
            align="left"
            className={styles.toggleButton}
            kind="secondary"
            label={isExpanded ? t('collapse', 'Collapse') : t('expand', 'Expand')}
            onClick={toggleHeight}
          >
            {isExpanded ? <ChevronDown /> : <ChevronUp />}
          </IconButton>
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
      <div className={styles.content}>{tabContent}</div>
    </div>
  );
}
