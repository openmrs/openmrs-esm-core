import React from "react";
import OfflineActions from "./offline-actions.component";
import styles from "./offline-actions-patient-chart-widget.styles.scss";
import { useLayoutType } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";

export interface OfflineActionsPatientChartWidgetProps {
  patientUuid: string;
}

const OfflineActionsPatientChartWidget: React.FC<
  OfflineActionsPatientChartWidgetProps
> = ({ patientUuid }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.widgetCard}>
      <CardHeader title={t("offlineActions", "Offline actions")} />
      <OfflineActions patientUuid={patientUuid} />
    </div>
  );
};

const CardHeader: React.FC<{
  title: string;
}> = ({ title, children }) => {
  const isTablet = useLayoutType() === "tablet";

  return (
    <div className={isTablet ? styles.tabletHeader : styles.desktopHeader}>
      <h4>{title}</h4>
      {children}
    </div>
  );
};

export default OfflineActionsPatientChartWidget;
