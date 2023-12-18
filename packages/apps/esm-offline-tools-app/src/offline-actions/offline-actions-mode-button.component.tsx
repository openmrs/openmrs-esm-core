import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Toggle, Button, DefinitionTooltip } from '@carbon/react';
import { Network_3 } from '@carbon/react/icons';
import {
  getCurrentOfflineMode,
  setCurrentOfflineMode,
  showModal,
  useConnectivity,
} from '@openmrs/esm-framework/src/internal';
import styles from './offline-actions-mode-button.scss';

function doNotCloseMenu(ev: React.SyntheticEvent) {
  ev.stopPropagation();
}

const OfflineActionsModeButton: React.FC = () => {
  const { t } = useTranslation();
  const isOnline = useConnectivity();
  const [lastRun, setLastRun] = useState<string>(() => getCurrentOfflineMode().lastRun);
  const [active, setActive] = useState(() => getCurrentOfflineMode().active);

  const toggle = useCallback(() => {
    const dispose = showModal('offline-tools-offline-ready-modal', {
      closeModal: (result) => {
        setActive(result);
        setCurrentOfflineMode(result ? 'on' : 'off');
        dispose();
      },
    });
  }, [setActive]);

  const handleRefresh = useCallback(() => {
    toggle();
  }, [toggle]);

  return (
    isOnline && (
      <div className={styles.offlineModeButtonContainer}>
        <div>
          <Network_3 size={20} />
          <span onClick={doNotCloseMenu} role="none">
            {t('offlineReady', 'Offline Ready')}
          </span>
        </div>
        <DefinitionTooltip
          openOnHover
          align="top"
          definition={`${t('lastRun', 'Last Run')}: ${active ? lastRun : t('never', 'Never')}`}
        >
          {active && (
            <Button kind="ghost" onClick={handleRefresh}>
              {t('refresh', 'Refresh')}
            </Button>
          )}
        </DefinitionTooltip>
        {!active && <Toggle className={styles.toggle} id="offlineModeSwitch" toggled={active} onToggle={toggle} />}
      </div>
    )
  );
};

export default OfflineActionsModeButton;
