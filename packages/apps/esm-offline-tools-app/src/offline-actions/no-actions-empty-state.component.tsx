import { Tile } from "carbon-components-react";
import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./no-actions-empty-state.styles.scss";

const NoActionsEmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tile light className={styles.emptyStateContainer}>
      <h4 className={styles.productiveHeading01}>
        {t(
          "offlineActionsNoActionsEmptyStateTitle",
          "No actions pending upload"
        )}
      </h4>
      <span className={styles.bodyLong01}>
        {t(
          "offlineActionsNoActionsEmptyStateContent",
          "All offline actions have been uploaded successfully, and merged with the online patient records."
        )}
      </span>
    </Tile>
  );
};

export default NoActionsEmptyState;
