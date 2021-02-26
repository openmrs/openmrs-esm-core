import React from "react";
import styles from "./summary-section-cards.css";

export default function SummarySectionCards(props) {
  return <div className={styles.sectionCards}>{props.children}</div>;
}
