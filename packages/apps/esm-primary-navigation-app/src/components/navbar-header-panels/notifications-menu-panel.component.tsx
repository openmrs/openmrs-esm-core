import React from "react";
import { HeaderPanel, HeaderPanelProps } from "carbon-components-react";
import styles from "./notifications-menu.component.panel.scss";
import { useTranslation } from "react-i18next";

interface NotificationsMenuPanelProps extends HeaderPanelProps {}

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
      <div>
        <p className={styles.emptyNotifications}>
          {t("noNotifications", "You currently have no notifications")}
        </p>
      </div>
    </HeaderPanel>
  );
};

export default NotificationsMenuPanel;
