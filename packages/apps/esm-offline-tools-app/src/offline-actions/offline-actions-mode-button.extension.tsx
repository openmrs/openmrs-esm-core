import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { Network_3 } from '@carbon/react/icons';
import {
  getCurrentOfflineMode,
  setCurrentOfflineMode,
  showModal,
  useConnectivity,
} from '@openmrs/esm-framework/src/internal';
import styles from './offline-actions-mode-button.scss';
import { SwitcherItem } from '@carbon/react';

function doNotCloseMenu(ev: React.SyntheticEvent) {
  ev.stopPropagation();
}

const OfflineActionsModeButton: React.FC = () => {
  const { t } = useTranslation();
  const isOnline = useConnectivity();
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
      <SwitcherItem aria-label="Offline Ready" className={styles.panelItemContainer}>
        <div>
          <Network_3 size={20} />
          <p>{t('offlineReady', 'Offline Ready')}</p>
        </div>
        {active ? (
          <Button kind="ghost" onClick={handleRefresh}>
            {t('refresh', 'Refresh')}
          </Button>
        ) : (
          <Button kind="ghost" id="offlineModeSwitch" onClick={toggle}>
            {t('turnOn', 'Turn On')}
          </Button>
        )}
      </SwitcherItem>
    )
  );
};

export default OfflineActionsModeButton;
