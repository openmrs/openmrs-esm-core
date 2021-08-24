import React from "react";
import FormsOverviewCard from "./forms-overview-card.component";
import OfflineActionsOverviewCard from "./offline-actions-overview-card.component";
import PatientsOverviewCard from "./patients-overview-card.component";
import styles from "./overview-cards-container.styles.scss";

const OverviewCardsContainer: React.FC = () => {
  return (
    <div className={styles.overviewCardContainer}>
      <PatientsOverviewCard />
      <FormsOverviewCard />
      <OfflineActionsOverviewCard className={styles.offlineActionsCard} />
    </div>
  );
};

export default OverviewCardsContainer;
