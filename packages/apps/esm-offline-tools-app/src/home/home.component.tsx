import React from "react";
import { useTranslation } from "react-i18next";
import SharedPageLayout from "../components/shared-page-layout.component";
import OverviewCardsContainer from "./overview-cards-container.component";
import { ExtensionSlot, syncOfflinePatientData } from "@openmrs/esm-framework";
import styles from "./home.styles.scss";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SharedPageLayout header={t("homeHeader", "Offline home")}>
      <OverviewCardsContainer />

      <div className={styles.offlinePatientsTableContainer}>
        <ExtensionSlot extensionSlotName="offline-tools-home-overview-slot" />
      </div>
    </SharedPageLayout>
  );
};

export default Home;
