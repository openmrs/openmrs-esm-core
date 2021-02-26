import React from "react";
import { Link } from "react-router-dom";
import styles from "./summary-card-footer.css";
import { Trans } from "react-i18next";

export default function SummaryCardFooter(props: SummaryCardFooterProps) {
  if (!props.linkTo) {
    return (
      <div className={styles.footer}>
        <p className="omrs-bold">
          <Trans i18nKey="seeAll">See all</Trans>
        </p>
      </div>
    );
  }
  return (
    <div className={styles.footer}>
      <svg className="omrs-icon" fill="var(--omrs-color-ink-medium-contrast)">
        <use xlinkHref="#omrs-icon-chevron-right" />
      </svg>
      <Link
        to={props.linkTo}
        className={`omrs-unstyled`}
        style={{ border: "none" }}
      >
        <p className="omrs-bold">
          <Trans i18nKey="seeAll">See all</Trans>
        </p>
      </Link>
    </div>
  );
}

type SummaryCardFooterProps = {
  linkTo?: string;
};
