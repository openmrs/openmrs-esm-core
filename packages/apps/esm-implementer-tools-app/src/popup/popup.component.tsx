import React, { useState } from "react";
import Close16 from "@carbon/icons-react/es/close/16";
import { Button, ContentSwitcher, Switch } from "carbon-components-react";
import styles from "./popup.styles.css";
import { useTranslation } from "react-i18next";
import { Configuration } from "../configuration/configuration.component";
import { ModuleDiagnostics } from "../backend-dependencies/backend-dependencies.component";
import { FrontendModule } from "../backend-dependencies/openmrs-backend-dependencies";

interface DevToolsPopupProps {
  close(): void;
  frontendModules: Array<FrontendModule>;
  visibleTabIndex?: number;
}

export default function Popup(props: DevToolsPopupProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.popup}>
      <div className={styles.topBar}>
        <div className={styles.tabs}>
          <ContentSwitcher
            onChange={(c) => {
              setActiveTab((c as any).index);
            }}
          >
            <Switch
              name="configuration-tab"
              text={t("configuration", "Configuration")}
              onClick={() => {}}
              onKeyDown={() => {}}
            />
            <Switch
              name="backend-modules-tab"
              text={t("backendModules", "Backend Modules")}
              onClick={() => {}}
              onKeyDown={() => {}}
            />
          </ContentSwitcher>
        </div>
        <div>
          <Button
            className={styles.closeButton}
            kind="secondary"
            renderIcon={Close16}
            iconDescription="Close"
            onClick={props.close}
            hasIconOnly
          />
        </div>
      </div>
      <div className={styles.content}>
        {activeTab == 0 ? (
          <Configuration />
        ) : (
          <ModuleDiagnostics frontendModules={props.frontendModules} />
        )}
      </div>
    </div>
  );
}
