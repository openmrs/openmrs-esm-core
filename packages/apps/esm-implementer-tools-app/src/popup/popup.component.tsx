import React, { useMemo, useState } from "react";
import Close16 from "@carbon/icons-react/es/close/16";
import styles from "./popup.styles.scss";
import { Button, ContentSwitcher, Switch } from "carbon-components-react";
import { useTranslation } from "react-i18next";
import { Configuration } from "../configuration/configuration.component";
import {
  FrontendModule,
  FrontendModules,
} from "../frontend-modules/frontend-modules.component";
import { ModuleDiagnostics } from "../backend-dependencies/backend-dependencies.component";
import type { ResolvedDependenciesModule } from "../backend-dependencies/openmrs-backend-dependencies";

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
}: DevToolsPopupProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const tabContent = useMemo(() => {
    if (activeTab == 0) {
      return <Configuration />;
    } else if (activeTab == 1) {
      return <FrontendModules frontendModules={frontendModules} />;
    } else {
      return <ModuleDiagnostics frontendModules={backendDependencies} />;
    }
  }, [activeTab]);

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
            />
            <Switch
              name="frontend-modules-tab"
              text={t("frontendModules", "Frontend Modules")}
            />
            <Switch
              name="backend-modules-tab"
              text={t("backendModules", "Backend Modules")}
            />
          </ContentSwitcher>
        </div>
        <div>
          <Button
            kind="secondary"
            renderIcon={Close16}
            iconDescription="Close"
            onClick={close}
            hasIconOnly
          />
        </div>
      </div>
      <div className={styles.content}>{tabContent}</div>
    </div>
  );
}
