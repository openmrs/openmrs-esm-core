import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderPanel, type HeaderPanelProps } from '@carbon/react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import styles from './notifications-menu.panel.scss';

interface NotificationsMenuPanelProps extends HeaderPanelProps {
  expanded: boolean;
}

const NotificationsMenuPanel: React.FC<NotificationsMenuPanelProps> = ({ expanded }) => {
  const { t } = useTranslation();
  const state = useMemo(() => ({ expanded }), [expanded]);

  return (
    <HeaderPanel aria-label="Notifications Panel" expanded={expanded}>
      <h1 className={styles.heading}>{t('notifications', 'Notifications')}</h1>
      <ExtensionSlot name="notifications-nav-menu-slot" state={state} />
    </HeaderPanel>
  );
};

export default NotificationsMenuPanel;
