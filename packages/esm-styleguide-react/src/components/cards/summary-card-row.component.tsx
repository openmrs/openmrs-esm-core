import React from "react";
import { Link } from "react-router-dom";
import styles from "./summary-card-row.css";

export default function SummaryCardRow(props: SummaryCardRowProps) {
  if (!props.linkTo) {
    return (
      <div className={`omrs-unstyled ${styles.row}`}>{props.children}</div>
    );
  }
  return (
    <Link to={props.linkTo} className={`omrs-unstyled ${styles.row}`}>
      {props.children}
      <svg className="omrs-icon" fill="var(--omrs-color-ink-low-contrast)">
        <use xlinkHref="#omrs-icon-chevron-right" />
      </svg>
    </Link>
  );
}

type SummaryCardRowProps = {
  linkTo?: string;
  children: React.ReactNode;
};
