import React from "react";
import { useTranslation } from "react-i18next";
import { ExtensionSlot } from "@openmrs/esm-framework";
import SharedPageLayout from "../components/shared-page-layout.component";
import styles from "./offline-patients.styles.scss";

const OfflinePatients: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SharedPageLayout header={t("offlinePatientsHeader", "Offline patients")}>
      <div className={styles.contentContainer}>
        <ExtensionSlot extensionSlotName="offline-tools-offline-patients-slot" />
      </div>
    </SharedPageLayout>
  );
};

export default OfflinePatients;
