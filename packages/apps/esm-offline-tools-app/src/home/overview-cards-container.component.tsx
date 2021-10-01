import React from "react";
import FormsOverviewCard from "./forms-overview-card.component";
import OfflineActionsOverviewCard from "./offline-actions-overview-card.component";
import PatientsOverviewCard from "./patients-overview-card.component";
import styles from "./overview-cards-container.styles.scss";

const OverviewCardsContainer: React.FC = () => {
  return (
    <div className={styles.overviewCardContainer}>
      <PatientsOverviewCard />
      {/* <FormsOverviewCard /> */}{" "}
      {/* TODO: <- Restore once offline tool forms are implemented. Commented out to avoid the (tbd) in the demo envs. */}
      <OfflineActionsOverviewCard />
    </div>
  );
};

export default OverviewCardsContainer;
