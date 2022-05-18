import React from "react";
import { useTranslation } from "react-i18next";
import SharedPageLayout from "../components/shared-page-layout.component";
import CardsContainer from "./cards-container.component";
import { ExtensionSlot } from "@openmrs/esm-framework";
import styles from "./home.styles.scss";
import { useParams } from "react-router-dom";

/**
 * The offline tool's home/dashboard page.
 * Renders the overview cards and provides an extension slot for the read-only offline patient table.
 *
 * Designs: https://zpl.io/an851Lr
 */
const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SharedPageLayout header={t("homeHeader", "Offline home")}>
      <CardsContainer />

      <div className={styles.offlinePatientsTableContainer}>
        <ExtensionSlot extensionSlotName="offline-tools-home-overview-slot" />
      </div>
    </SharedPageLayout>
  );
};

export default Home;
