import React from "react";
import { useTranslation } from "react-i18next";
import { Tile, Button, TileProps } from "@carbon/react";
import { ArrowRight } from "@carbon/icons-react";
import { navigate } from "@openmrs/esm-framework";
import styles from "./overview-card.styles.scss";

export interface OverviewCardProps extends TileProps {
  header: string;
  viewLink: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  header,
  viewLink,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Tile light className={`${styles.overviewCard}`}>
      <div className={styles.headerContainer}>
        <h3 className={styles.productiveHeading01}>{header}</h3>
        <Button
          kind="ghost"
          renderIcon={(props) => <ArrowRight size={16} {...props} />}
          size="sm"
          onClick={() => navigate({ to: `\${openmrsSpaBase}/${viewLink}` })}
        >
          {t("homeOverviewCardView", "View")}
        </Button>
      </div>
      <div className={styles.contentContainer}>{children}</div>
    </Tile>
  );
};

export default OverviewCard;
