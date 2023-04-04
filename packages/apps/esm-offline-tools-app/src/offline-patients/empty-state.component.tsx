import React from "react";
import { Trans } from "react-i18next";
import { Layer, Tile } from "@carbon/react";
import { useLayoutType } from "@openmrs/esm-framework";
import { EmptyDataIllustration } from "./empty-data-illustration.component";
import styles from "./empty-state.scss";

type EmptyStateProps = {
  displayText: string;
  headerTitle: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  displayText,
  headerTitle,
}) => {
  const isTablet = useLayoutType() === "tablet";
  return (
    <Layer>
      <Tile className={styles.tile}>
        <div
          className={isTablet ? styles.tabletHeading : styles.desktopHeading}
        >
          <h4>{headerTitle}</h4>
        </div>
        <EmptyDataIllustration />
        <p className={styles.content}>
          <Trans i18nKey="emptyStateText" values={{ displayText: displayText }}>
            There are no {displayText} to display
          </Trans>
        </p>
      </Tile>
    </Layer>
  );
};

export default EmptyState;
