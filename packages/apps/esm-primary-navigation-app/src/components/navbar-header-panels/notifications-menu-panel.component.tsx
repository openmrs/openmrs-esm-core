import React from "react";
import { useTranslation } from "react-i18next";
import { ExtensionSlot } from "@openmrs/esm-framework";
import { HeaderPanel, HeaderPanelProps } from "carbon-components-react";
import styles from "./notifications-menu.component.panel.scss";

interface NotificationsMenuPanelProps extends HeaderPanelProps {
  expanded: boolean;
}

const NotificationsMenuPanel: React.FC<NotificationsMenuPanelProps> = ({
  expanded,
}) => {
  const { t } = useTranslation();

  return (
    <HeaderPanel
      className={styles.notificationsPanel}
      aria-label="Notifications Panel"
      expanded={expanded}
    >
      <h1 className={styles.heading}>{t("notifications", "Notifications")}</h1>
      <ExtensionSlot
        extensionSlotName="notifications-nav-menu-slot"
        state={{ expanded: expanded }}
      />
    </HeaderPanel>
  );
};

export default NotificationsMenuPanel;
