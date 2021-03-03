import React from "react";

import { Tile } from "carbon-components-react";
import { useTranslation } from "react-i18next";

import styles from "./error-state.scss";

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  headerTitle
}) => {
  const { t } = useTranslation();

  return (
    <Tile light className={styles.tile}>
      <h1 className={styles.heading}>{headerTitle}</h1>
      <p className={styles.errorMessage}>
        {t("error", "Error")} {`${error.response.status}: `}
        {error.response.statusText}
      </p>
      <p className={styles.errorCopy}>{t("errorCopy")}</p>
    </Tile>
  );
};

export interface ErrorStateProps {
  /**
   * Error object
   */
  error: any;
  /**
   * Error state title
   */
  headerTitle: string;
}
