import React from "react";
import styles from "./overview-cards-container.styles.scss";
import { ExtensionSlot } from "@openmrs/esm-framework";

const OverviewCardsContainer: React.FC = () => {
  return (
    <ExtensionSlot
      extensionSlotName="offline-tools-dashboard-cards"
      className={styles.overviewCardContainer}
    />
    // <PatientsOverviewCard />
    // {/* <FormsOverviewCard /> */}{" "}
    // {/* TODO: <- Restore once offline tool forms are implemented. Commented out to avoid the (tbd) in the demo envs. */}
    // <OfflineActionsOverviewCard />
  );
};

export default OverviewCardsContainer;
