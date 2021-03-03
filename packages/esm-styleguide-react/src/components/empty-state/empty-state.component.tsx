import React from "react";

import { Link, Tile } from "carbon-components-react";
import { Trans, useTranslation } from "react-i18next";

import EmptyDataIllustration from "./empty-data-illustration.component";
import styles from "./empty-state.scss";

/**
 * Component for rendering empty state of the enclosing component
 * @param props
 */
export const EmptyState: React.FC<EmptyStateProps> = props => {
  const { t } = useTranslation();

  return (
    <Tile light className={styles.tile}>
      <h1 className={styles.heading}>{props.headerTitle}</h1>
      <EmptyDataIllustration />
      <p className={styles.content}>
        <Trans
          i18nKey="emptyStateText"
          values={{ displayText: props.displayText.toLowerCase() }}
        >
          There are no {props.displayText.toLowerCase()} to display for this
          patient
        </Trans>
      </p>
      {props.launchForm && (
        <p className={styles.action}>
          <Link onClick={() => props.launchForm?.()}>
            {t("record", "Record")} {props.displayText.toLowerCase()}
          </Link>
        </p>
      )}
    </Tile>
  );
};

export interface EmptyStateProps {
  /**
   * The state title
   */
  headerTitle: string;
  /**
   * Domain name for empty state
   */
  displayText: string;
  /**
   * Optional callback for rendering the form that records new entries
   * @default null
   */
  launchForm?: Function;
}
