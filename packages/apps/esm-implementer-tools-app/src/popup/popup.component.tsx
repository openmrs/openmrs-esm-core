import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ContentSwitcher, IconButton, Switch } from '@carbon/react';
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

export default function Popup({
  close,
  frontendModules,
  backendDependencies,
  visibleTabIndex = 0,
}: DevToolsPopupProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(visibleTabIndex);
  const [height, setHeight] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const defaultHeight = 50;
  const popupRef = useRef<HTMLDivElement>(null);

  const tabContent = useMemo(() => {
    if (activeTab === 0) return <Configuration />;
    if (activeTab === 1) return <FrontendModules frontendModules={frontendModules} />;
    if (activeTab === 2) return <BackendDependencies backendDependencies={backendDependencies} />;
    return <FeatureFlags />;
  }, [activeTab, backendDependencies, frontendModules]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const viewportHeight = window.innerHeight;
      const mouseYPosition = e.clientY;
      const newHeightPx = viewportHeight - mouseYPosition;
      const newHeightVh = (newHeightPx / viewportHeight) * 100;

      const clampedHeight = Math.max(defaultHeight, Math.min(90, newHeightVh));

      requestAnimationFrame(() => {
        setHeight(clampedHeight);
      });
    },
    [isResizing, defaultHeight],
  );

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.body.classList.add('no-select');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResizing);
    }

    return () => {
      document.body.classList.remove('no-select');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, handleMouseMove, stopResizing]);

  return (
    <div ref={popupRef} className={styles.popup} style={{ height: `${height}vh` }}>
      <div className={styles.topBar}>
        <div className={styles.tabs}>
          <ContentSwitcher selectedIndex={activeTab} onChange={({ index }) => setActiveTab(index)} size="lg">
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
      <div className={styles.content}>{tabContent}</div>
      <div
        className={styles.resizer}
        onMouseDown={startResizing}
        style={{ cursor: isResizing ? 'ns-resize' : 'n-resize' }}
      >
        <div className={styles.resizerHandle}></div>
      </div>
    </div>
  );
}
