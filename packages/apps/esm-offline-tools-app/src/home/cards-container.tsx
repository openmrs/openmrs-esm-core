import React from "react";
import styles from "./cards-container.styles.scss";
import { ExtensionSlot } from "@openmrs/esm-framework";

const CardsContainer: React.FC = () => {
  return (
    <ExtensionSlot
      extensionSlotName="offline-tools-dashboard-cards"
      className={styles.overviewCardContainer}
    />
  );
};

export default CardsContainer;
