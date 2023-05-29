import React from "react";
import { useTranslation } from "react-i18next";
import { ExtensionSlot } from "@openmrs/esm-framework";
import { LinkCard } from "./card.component";

import styles from "./index.scss";

export const SystemAdministrationDashbord = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.systemAdminPage}>
      <div className={styles.breadcrumbsContainer}>
        <ExtensionSlot extensionSlotName="breadcrumbs-slot" />
      </div>
      <div className={styles.cardsView}>
        <LinkCard
          header={t("systemAdmin", "System Administration")}
          viewLink={`/openmrs/admin`}
        />
        <LinkCard
          header={t("openConceptLab", "Open Concept Lab")}
          viewLink={`${window.spaBase}/ocl`}
        />
      </div>
    </div>
  );
};
