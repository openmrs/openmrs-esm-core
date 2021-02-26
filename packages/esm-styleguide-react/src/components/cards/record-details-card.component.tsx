import React from "react";
import SummaryCard from "../cards/summary-card.component";
import styles from "./record-details-card.css";
import { useTranslation } from "react-i18next";

export default function RecordDetails(props: DetailsProps) {
  const { t } = useTranslation();

  return (
    <SummaryCard
      name={t("details", "Details")}
      styles={{
        width: "100%",
        backgroundColor: "var(--omrs-color-bg-medium-contrast)"
      }}
    >
      <div
        style={props.styles}
        className={`omrs-type-body-regular ${styles.detailsCard}`}
      >
        {props.children}
      </div>
    </SummaryCard>
  );
}

type DetailsProps = {
  children: React.ReactNode;
  styles?: React.CSSProperties;
};
