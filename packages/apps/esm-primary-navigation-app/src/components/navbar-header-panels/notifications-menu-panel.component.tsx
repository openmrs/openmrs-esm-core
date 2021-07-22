import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ExtensionSlot } from "@openmrs/esm-framework";
import type { HeaderPanelProps } from "carbon-components-react";
import { HeaderPanel } from "carbon-components-react/es/components/UIShell";
import styles from "./notifications-menu.component.panel.scss";

interface NotificationsMenuPanelProps extends HeaderPanelProps {
  expanded: boolean;
}

const NotificationsMenuPanel: React.FC<NotificationsMenuPanelProps> = ({
  expanded,
}) => {
  const { t } = useTranslation();
  const state = useMemo(() => ({ expanded }), [expanded]);

  return (
    <HeaderPanel
      className={styles.notificationsPanel}
      aria-label="Notifications Panel"
      expanded={expanded}
    >
      <h1 className={styles.heading}>{t("notifications", "Notifications")}</h1>
      <ExtensionSlot
        extensionSlotName="notifications-nav-menu-slot"
        state={state}
      />
    </HeaderPanel>
  );
};

export default NotificationsMenuPanel;
