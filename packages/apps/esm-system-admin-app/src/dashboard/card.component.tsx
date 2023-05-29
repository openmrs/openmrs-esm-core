import React from "react";
import { useTranslation } from "react-i18next";
import { Layer, Tile, TileProps, Button } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";
import styles from "./card.scss";

export interface LinkCardProps extends TileProps {
  header: string;
  viewLink: string;
  children?: React.ReactNode;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  header,
  viewLink,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Layer>
      <Tile className={styles.overviewCard}>
        <div className={styles.heading}>{header}</div>
        <Button
          className={styles.viewButton}
          kind="ghost"
          renderIcon={(props) => <ArrowRight size={16} {...props} />}
          size="sm"
          href={viewLink}
          target="_blank"
          rel="no-refferer"
        >
          {t("homeOverviewCardView", "View")}
        </Button>
      </Tile>
    </Layer>
  );
};
